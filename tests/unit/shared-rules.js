import { describe, expect, it } from 'vitest'
import { arrow, classes, clickDay, d, day, grid, monthTitle, weekHeader } from '../helpers'

// Calendar and selection rules shared by VueHotelDatepicker and VueHotelDatepickerModal.
// `open(props)` returns an opened picker; `selections(wrapper)` returns every emitted
// selection normalised to { start: 'YYYY/MM/DD' | null, end: 'YYYY/MM/DD' | null }.
export function sharedRules ({ open, selections }) {
  const lastSelection = wrapper => {
    const list = selections(wrapper)
    return list[list.length - 1]
  }
  const errors = wrapper => (wrapper.emitted('error') || []).map(args => args[0])

  describe('calendar grid', () => {
    it('shows the month of minDate (today by default) and the following month', async () => {
      const wrapper = await open()
      expect(monthTitle(wrapper, 'left')).toBe('May. 2026')
      expect(monthTitle(wrapper, 'right')).toBe('Jun. 2026')
    })

    it('lays out weeks Sunday-first with empty cells around the month', async () => {
      const wrapper = await open()
      expect(grid(wrapper, 'left')).toEqual([
        ['', '', '', '', '', '1', '2'],
        ['3', '4', '5', '6', '7', '8', '9'],
        ['10', '11', '12', '13', '14', '15', '16'],
        ['17', '18', '19', '20', '21', '22', '23'],
        ['24', '25', '26', '27', '28', '29', '30'],
        ['31', '', '', '', '', '', '']
      ])
      expect(grid(wrapper, 'right')).toEqual([
        ['', '1', '2', '3', '4', '5', '6'],
        ['7', '8', '9', '10', '11', '12', '13'],
        ['14', '15', '16', '17', '18', '19', '20'],
        ['21', '22', '23', '24', '25', '26', '27'],
        ['28', '29', '30', '', '', '', '']
      ])
    })

    it('renders a month that fills exactly four weeks (February 2026)', async () => {
      const wrapper = await open({ minDate: d(2026, 2, 1) })
      expect(monthTitle(wrapper, 'left')).toBe('Feb. 2026')
      expect(grid(wrapper, 'left')).toEqual([
        ['1', '2', '3', '4', '5', '6', '7'],
        ['8', '9', '10', '11', '12', '13', '14'],
        ['15', '16', '17', '18', '19', '20', '21'],
        ['22', '23', '24', '25', '26', '27', '28']
      ])
    })

    it('renders a month that starts on Saturday (August 2026)', async () => {
      const wrapper = await open({ minDate: d(2026, 8, 1) })
      const weeks = grid(wrapper, 'left')
      expect(weeks[0]).toEqual(['', '', '', '', '', '', '1'])
      expect(weeks[weeks.length - 1]).toEqual(['30', '31', '', '', '', '', ''])
      expect(weeks).toHaveLength(6)
    })

    it('handles leap day and the year boundary', async () => {
      const leap = await open({ minDate: d(2028, 2, 1) })
      expect(grid(leap, 'left').flat().filter(Boolean)).toHaveLength(29)

      const december = await open({ minDate: d(2026, 12, 1) })
      expect(monthTitle(december, 'left')).toBe('Dec. 2026')
      expect(monthTitle(december, 'right')).toBe('Jan. 2027')
    })

    it('marks empty cells and today', async () => {
      const wrapper = await open()
      expect(wrapper.findAll('.vhd-calendar-left .day.empty')).toHaveLength(5 + 6)
      expect(classes(wrapper, 10)).toContain('today')
      expect(classes(wrapper, 11)).not.toContain('today')
    })

    it('uses weekList and monthList for labels', async () => {
      const weekList = ['Ne', 'Po', 'Ut', 'Sr', 'Če', 'Pe', 'Su']
      const monthList = ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
      const wrapper = await open({ weekList, monthList })
      expect(weekHeader(wrapper, 'left')).toEqual(weekList)
      expect(weekHeader(wrapper, 'right')).toEqual(weekList)
      expect(monthTitle(wrapper, 'left')).toBe('Svi 2026')
      expect(monthTitle(wrapper, 'right')).toBe('Lip 2026')
    })

    it('shows the message only when one is given', async () => {
      const without = await open()
      expect(without.find('.vhd-calendar-message').exists()).toBe(false)
      const withMessage = await open({ message: 'Minimum stay 3 nights' })
      expect(withMessage.find('.vhd-calendar-message').text()).toBe('Minimum stay 3 nights')
    })
  })

  describe('month navigation', () => {
    it('moves one or two months forward', async () => {
      const wrapper = await open()
      await arrow(wrapper, 1).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
      expect(monthTitle(wrapper, 'right')).toBe('Jul. 2026')
      await arrow(wrapper, 2).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Aug. 2026')
      expect(monthTitle(wrapper, 'right')).toBe('Sep. 2026')
      expect(grid(wrapper, 'left')[0]).toEqual(['', '', '', '', '', '', '1'])
    })

    it('moves back but never before the month of minDate', async () => {
      const wrapper = await open()
      await arrow(wrapper, 2).trigger('click')
      await arrow(wrapper, 1).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Aug. 2026')
      await arrow(wrapper, -1).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Jul. 2026')
      await arrow(wrapper, -2).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('May. 2026')
      await arrow(wrapper, -2).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('May. 2026')
    })

    it('flags the previous arrows as disabled on the minDate month only', async () => {
      const wrapper = await open()
      expect(arrow(wrapper, -1).classes()).toContain('disabled')
      expect(arrow(wrapper, -2).classes()).toContain('disabled')
      await arrow(wrapper, 1).trigger('click')
      expect(arrow(wrapper, -1).classes()).not.toContain('disabled')
      expect(arrow(wrapper, -2).classes()).not.toContain('disabled')
    })

    it('with selectForward=false allows browsing months before minDate', async () => {
      const wrapper = await open({ selectForward: false })
      expect(arrow(wrapper, -1).classes()).not.toContain('disabled')
      await arrow(wrapper, -1).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Apr. 2026')
      expect(classes(wrapper, 20)).toContain('disabled')
    })

    it('crosses the year boundary', async () => {
      const wrapper = await open({ minDate: d(2026, 11, 15) })
      await arrow(wrapper, 2).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Jan. 2027')
      expect(monthTitle(wrapper, 'right')).toBe('Feb. 2027')
    })
  })

  describe('min / max date', () => {
    it('disables days before minDate and ignores clicks on them', async () => {
      const wrapper = await open()
      expect(classes(wrapper, 9)).toContain('disabled')
      expect(classes(wrapper, 10)).not.toContain('disabled')
      await clickDay(wrapper, 9)
      expect(selections(wrapper)).toEqual([])
    })

    it('disables days after maxDate and ignores clicks on them', async () => {
      const wrapper = await open({ maxDate: d(2026, 5, 20) })
      expect(classes(wrapper, 20)).not.toContain('disabled')
      expect(classes(wrapper, 21)).toContain('disabled')
      await clickDay(wrapper, 21)
      await clickDay(wrapper, 3, 'right')
      expect(selections(wrapper)).toEqual([])
    })

    it('accepts minDate and maxDate as strings', async () => {
      const wrapper = await open({ minDate: '2026/06/10', maxDate: '2026/06/12' })
      expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
      expect(classes(wrapper, 9)).toContain('disabled')
      expect(classes(wrapper, 10)).not.toContain('disabled')
      expect(classes(wrapper, 12)).not.toContain('disabled')
      expect(classes(wrapper, 13)).toContain('disabled')
    })
  })

  describe('range selection', () => {
    it('first click sets the start date', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      expect(selections(wrapper)).toEqual([{ start: '2026/05/12', end: null }])
      expect(classes(wrapper, 12)).toContain('start-date')
    })

    it('second click sets the end date and highlights the range', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/12', end: '2026/05/15' })
      expect(classes(wrapper, 12)).toContain('start-date')
      expect(classes(wrapper, 13)).toContain('in-date-range')
      expect(classes(wrapper, 14)).toContain('in-date-range')
      expect(classes(wrapper, 15)).toContain('end-date')
      expect(classes(wrapper, 16)).not.toContain('in-date-range')
    })

    it('selects across the two months', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 29)
      await clickDay(wrapper, 2, 'right')
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/29', end: '2026/06/02' })
      expect(classes(wrapper, 31)).toContain('in-date-range')
      expect(classes(wrapper, 1, 'right')).toContain('in-date-range')
      expect(classes(wrapper, 2, 'right')).toContain('end-date')
    })

    it('swaps the dates when the second click is before the start', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 15)
      await clickDay(wrapper, 12)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/12', end: '2026/05/15' })
      expect(classes(wrapper, 12)).toContain('start-date')
      expect(classes(wrapper, 15)).toContain('end-date')
    })

    it('ignores a second click on the start date and keeps waiting for the end date', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 12)
      expect(selections(wrapper)).toHaveLength(1)
      await clickDay(wrapper, 14)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/12', end: '2026/05/14' })
    })

    it('a click on a complete selection starts a new one instead of extending it', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await clickDay(wrapper, 20)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/20', end: null })
      expect(classes(wrapper, 20)).toContain('start-date')
      expect(classes(wrapper, 12)).not.toContain('start-date')
      expect(classes(wrapper, 13)).not.toContain('in-date-range')
      expect(classes(wrapper, 15)).not.toContain('end-date')
    })

    it('uses the diagonal classes with useDiagonalStartEnd', async () => {
      const wrapper = await open({ useDiagonalStartEnd: true })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(classes(wrapper, 12)).toContain('start-date-diagonal')
      expect(classes(wrapper, 12)).not.toContain('start-date')
      expect(classes(wrapper, 15)).toContain('end-date-diagonal')
      expect(classes(wrapper, 15)).not.toContain('end-date')
      expect(classes(wrapper, 13)).toContain('in-date-range')
    })
  })

  describe('minNight / maxNight', () => {
    it('disables end dates below minNight in both directions and rejects them with an error', async () => {
      const wrapper = await open({ minNight: 3 })
      await clickDay(wrapper, 15)
      expect(classes(wrapper, 13)).toContain('disabled')
      expect(classes(wrapper, 14)).toContain('disabled')
      expect(classes(wrapper, 16)).toContain('disabled')
      expect(classes(wrapper, 17)).toContain('disabled')
      expect(classes(wrapper, 12)).not.toContain('disabled')
      expect(classes(wrapper, 18)).not.toContain('disabled')

      await clickDay(wrapper, 17)
      expect(errors(wrapper)).toEqual(['Minimum stay is 3 nights.'])
      expect(selections(wrapper)).toHaveLength(1)

      await clickDay(wrapper, 18)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/15', end: '2026/05/18' })
    })

    it('disables end dates above maxNight and rejects them with an error', async () => {
      const wrapper = await open({ maxNight: 2 })
      await clickDay(wrapper, 12)
      expect(classes(wrapper, 14)).not.toContain('disabled')
      expect(classes(wrapper, 15)).toContain('disabled')

      await clickDay(wrapper, 15)
      expect(errors(wrapper)).toEqual(['Maximum stay is 2 nights.'])
      expect(selections(wrapper)).toHaveLength(1)

      await clickDay(wrapper, 14)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/12', end: '2026/05/14' })
    })

    it('lifts the night restrictions once a range is complete', async () => {
      const wrapper = await open({ minNight: 3 })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 16)
      expect(classes(wrapper, 17)).not.toContain('disabled')
      expect(classes(wrapper, 11)).not.toContain('disabled')
    })
  })

  describe('disabledDates', () => {
    const disabledDates = ['2026/05/14', '2026/05/15', '2026/05/20']

    it('marks disabled dates as disabled + forbidden and refuses them as a start date', async () => {
      const wrapper = await open({ disabledDates })
      for (const n of [14, 15, 20]) {
        expect(classes(wrapper, n)).toContain('disabled')
        expect(classes(wrapper, n)).toContain('forbidden')
      }
      expect(classes(wrapper, 13)).not.toContain('disabled')
      await clickDay(wrapper, 14)
      expect(selections(wrapper)).toEqual([])
      expect(errors(wrapper)).toEqual([])
    })

    it('accepts Date objects and ISO strings', async () => {
      const wrapper = await open({ disabledDates: [d(2026, 5, 14), '2026-05-20'] })
      expect(classes(wrapper, 14)).toContain('forbidden')
      expect(classes(wrapper, 20)).toContain('forbidden')
      expect(classes(wrapper, 15)).not.toContain('forbidden')
    })

    it('ignores unparsable entries and logs them', async () => {
      const wrapper = await open({ disabledDates: ['not a date', '2026/05/14'] })
      expect(console.error).toHaveBeenCalled()
      expect(classes(wrapper, 14)).toContain('forbidden')
      expect(wrapper.findAll('.day.forbidden')).toHaveLength(1)
    })

    it('offers the first disabled date after the start as a checkout day', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      expect(classes(wrapper, 14)).toContain('selectable-disabled')
      expect(classes(wrapper, 14)).not.toContain('disabled')
      expect(classes(wrapper, 14)).not.toContain('forbidden')
      // occupied days behind the first disabled date stay out of reach
      expect(classes(wrapper, 15)).toContain('disabled')
      expect(classes(wrapper, 15)).toContain('forbidden')
    })

    it('allows ending the range on that disabled date', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 14)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/12', end: '2026/05/14' })
      expect(classes(wrapper, 14)).toContain('end-date')
      expect(classes(wrapper, 14)).not.toContain('forbidden')
      expect(classes(wrapper, 13)).toContain('in-date-range')
    })

    it('uses the diagonal class for it with useDiagonalStartEnd', async () => {
      const wrapper = await open({ disabledDates, useDiagonalStartEnd: true })
      await clickDay(wrapper, 12)
      expect(classes(wrapper, 14)).toContain('selectable-disabled-diagonal')
      expect(classes(wrapper, 14)).not.toContain('selectable-disabled')
    })

    it('does not offer a disabled date before the start as selectable', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 17)
      expect(classes(wrapper, 15)).toContain('disabled')
      expect(classes(wrapper, 15)).toContain('forbidden')
      expect(classes(wrapper, 15)).not.toContain('selectable-disabled')
    })

    it('rejects an occupied day behind the first disabled date with an error', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(errors(wrapper)).toEqual(['Range includes a disabled date.'])
      expect(selections(wrapper)).toHaveLength(1)
      // still waiting for a valid end date
      await clickDay(wrapper, 13)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/12', end: '2026/05/13' })
    })

    it('silently refuses a backwards click that would start the range on a disabled date', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 17)
      await clickDay(wrapper, 15)
      expect(errors(wrapper)).toEqual([])
      expect(selections(wrapper)).toHaveLength(1)
    })

    it('resets the selection when its start date becomes disabled', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.setProps({ disabledDates: ['2026/05/12'] })
      expect(wrapper.emitted('selection-invalidated')).toEqual([[{ start: null, end: null }]])
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.end-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.in-date-range')).toHaveLength(0)
    })

    it('resets the whole selection when its end date becomes disabled', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.setProps({ disabledDates: ['2026/05/15'] })
      expect(wrapper.emitted('selection-invalidated')).toHaveLength(1)
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.end-date')).toHaveLength(0)
    })

    it('resets the selection when a date inside it becomes disabled', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.setProps({ disabledDates: ['2026/05/13'] })
      expect(wrapper.emitted('selection-invalidated')).toHaveLength(1)
      expect(wrapper.findAll('.day.in-date-range')).toHaveLength(0)
    })

    it('keeps the selection when unrelated dates become disabled', async () => {
      const wrapper = await open()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.setProps({ disabledDates: ['2026/05/20'] })
      expect(wrapper.emitted('selection-invalidated')).toBeUndefined()
      expect(classes(wrapper, 12)).toContain('start-date')
      expect(classes(wrapper, 15)).toContain('end-date')
      expect(classes(wrapper, 20)).toContain('forbidden')
    })
  })

  describe('changing the start date while picking the end date', () => {
    const disabledDates = ['2026/05/14', '2026/05/15', '2026/05/20']

    it('keeps free days behind a disabled date clickable, marked as a new start', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      for (const n of [16, 17, 18, 19, 21, 22]) {
        expect(classes(wrapper, n)).toContain('selectable-restart')
        expect(classes(wrapper, n)).not.toContain('disabled')
      }
      // days that can end this stay are not marked
      expect(classes(wrapper, 13)).not.toContain('selectable-restart')
      expect(classes(wrapper, 14)).not.toContain('selectable-restart')
      // occupied days are never a new start
      expect(classes(wrapper, 15)).not.toContain('selectable-restart')
      expect(classes(wrapper, 20)).not.toContain('selectable-restart')
    })

    it('a click on such a day moves the start there instead of doing nothing', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 17)
      expect(errors(wrapper)).toEqual([])
      expect(selections(wrapper)).toEqual([
        { start: '2026/05/12', end: null },
        { start: '2026/05/17', end: null }
      ])
      expect(classes(wrapper, 17)).toContain('start-date')
      expect(classes(wrapper, 12)).not.toContain('start-date')
      await clickDay(wrapper, 19)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/17', end: '2026/05/19' })
    })

    it('works backwards across a disabled date too', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 22)
      expect(classes(wrapper, 18)).toContain('selectable-restart')
      await clickDay(wrapper, 18)
      expect(errors(wrapper)).toEqual([])
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/18', end: null })
    })

    it('also across months', async () => {
      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      expect(classes(wrapper, 3, 'right')).toContain('selectable-restart')
      await clickDay(wrapper, 3, 'right')
      expect(lastSelection(wrapper)).toEqual({ start: '2026/06/03', end: null })
    })

    it('does not mark days before minDate or after maxDate', async () => {
      const wrapper = await open({ disabledDates: ['2026/05/14'], maxDate: d(2026, 5, 20) })
      await clickDay(wrapper, 16)
      expect(classes(wrapper, 5)).not.toContain('selectable-restart')
      expect(classes(wrapper, 5)).toContain('disabled')
      expect(classes(wrapper, 25)).not.toContain('selectable-restart')
      expect(classes(wrapper, 12)).toContain('selectable-restart')
    })

    it('leaves the night limits as they were: too close or too far is still an error', async () => {
      const wrapper = await open({ minNight: 3, maxNight: 5 })
      await clickDay(wrapper, 12)
      expect(classes(wrapper, 13)).toContain('disabled')
      expect(classes(wrapper, 13)).not.toContain('selectable-restart')
      expect(classes(wrapper, 20)).toContain('disabled')
      await clickDay(wrapper, 20)
      expect(errors(wrapper)).toEqual(['Maximum stay is 5 nights.'])
      expect(selections(wrapper)).toHaveLength(1)
    })

    it('has no such days without disabled dates or once the range is complete', async () => {
      const plain = await open()
      await clickDay(plain, 12)
      expect(plain.findAll('.day.selectable-restart')).toHaveLength(0)

      const wrapper = await open({ disabledDates })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 13)
      expect(wrapper.findAll('.day.selectable-restart')).toHaveLength(0)
    })
  })

  describe('initial startDate / endDate', () => {
    it('preselects the range and opens on the month of the start date', async () => {
      const wrapper = await open({ startDate: d(2026, 7, 3), endDate: d(2026, 7, 8) })
      expect(monthTitle(wrapper, 'left')).toBe('Jul. 2026')
      expect(classes(wrapper, 3)).toContain('start-date')
      expect(classes(wrapper, 5)).toContain('in-date-range')
      expect(classes(wrapper, 8)).toContain('end-date')
      expect(selections(wrapper)).toEqual([])
    })

    it('accepts strings', async () => {
      const wrapper = await open({ startDate: '2026/06/03', endDate: '2026/06/05' })
      expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
      expect(classes(wrapper, 3)).toContain('start-date')
      expect(classes(wrapper, 5)).toContain('end-date')
    })

    it('accepts a start date on its own', async () => {
      const wrapper = await open({ startDate: d(2026, 5, 20) })
      expect(classes(wrapper, 20)).toContain('start-date')
      await clickDay(wrapper, 22)
      expect(lastSelection(wrapper)).toEqual({ start: '2026/05/20', end: '2026/05/22' })
    })

    it('drops a range whose start date is disabled', async () => {
      const wrapper = await open({ startDate: d(2026, 5, 14), endDate: d(2026, 5, 18), disabledDates: ['2026/05/14'] })
      expect(console.warn).toHaveBeenCalled()
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.end-date')).toHaveLength(0)
    })

    it('drops a range that spans a disabled date', async () => {
      const wrapper = await open({ startDate: d(2026, 5, 12), endDate: d(2026, 5, 18), disabledDates: ['2026/05/14'] })
      expect(console.warn).toHaveBeenCalled()
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
    })

    it('keeps a range that ends on a disabled date', async () => {
      const wrapper = await open({ startDate: d(2026, 5, 12), endDate: d(2026, 5, 14), disabledDates: ['2026/05/14'] })
      expect(classes(wrapper, 12)).toContain('start-date')
      expect(classes(wrapper, 14)).toContain('end-date')
      expect(day(wrapper, 14).classes()).not.toContain('forbidden')
    })

    it('drops a lone start date that is disabled', async () => {
      const wrapper = await open({ startDate: d(2026, 5, 14), disabledDates: ['2026/05/14'] })
      expect(console.warn).toHaveBeenCalled()
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
    })
  })
}
