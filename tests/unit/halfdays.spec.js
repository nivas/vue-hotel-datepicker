import { describe, expect, it } from 'vitest'
import { classes, clickDay, d, openModal, openPicker } from '../helpers'

// Occupied nights: 14 + 15 (a block), 20 (a single night), 25 + 26 + 27 (a block)
const disabledDates = ['2026-05-14', '2026-05-15', '2026-05-20', '2026-05-25', '2026-05-26', '2026-05-27']
const HALF = ['half-day-checkout', 'half-day-arrival', 'full-day-occupied']
const halfClasses = (wrapper, n, side) => classes(wrapper, n, side).filter(c => HALF.includes(c))

for (const [name, open] of [['VueHotelDatepicker', openPicker], ['VueHotelDatepickerModal', openModal]]) {
  describe(`${name} showHalfDays`, () => {
    it('is off by default', async () => {
      const wrapper = await open({ disabledDates })
      expect(wrapper.findAll('.day.half-day-checkout, .day.half-day-arrival, .day.full-day-occupied')).toHaveLength(0)
    })

    it('marks the first occupied day of a block as check-out only, before any click', async () => {
      const wrapper = await open({ disabledDates, showHalfDays: true })
      expect(halfClasses(wrapper, 14)).toEqual(['half-day-checkout'])
      expect(halfClasses(wrapper, 20)).toEqual(['half-day-checkout'])
      expect(halfClasses(wrapper, 25)).toEqual(['half-day-checkout'])
      // still not a valid start date
      expect(classes(wrapper, 14)).toContain('disabled')
    })

    it('marks the first free day after a block as arrival only', async () => {
      const wrapper = await open({ disabledDates, showHalfDays: true })
      expect(halfClasses(wrapper, 16)).toEqual(['half-day-arrival'])
      expect(halfClasses(wrapper, 21)).toEqual(['half-day-arrival'])
      expect(halfClasses(wrapper, 28)).toEqual(['half-day-arrival'])
      expect(classes(wrapper, 16)).not.toContain('disabled')
    })

    it('marks the remaining occupied days as fully occupied', async () => {
      const wrapper = await open({ disabledDates, showHalfDays: true })
      expect(halfClasses(wrapper, 15)).toEqual(['full-day-occupied'])
      expect(halfClasses(wrapper, 26)).toEqual(['full-day-occupied'])
      expect(halfClasses(wrapper, 27)).toEqual(['full-day-occupied'])
    })

    it('leaves ordinary free days unmarked', async () => {
      const wrapper = await open({ disabledDates, showHalfDays: true })
      for (const n of [12, 13, 17, 18, 19, 22, 29]) expect(halfClasses(wrapper, n)).toEqual([])
    })

    it('works across the month boundary', async () => {
      const wrapper = await open({ disabledDates: ['2026-05-31'], showHalfDays: true })
      expect(halfClasses(wrapper, 31)).toEqual(['half-day-checkout'])
      expect(halfClasses(wrapper, 1, 'right')).toEqual(['half-day-arrival'])
    })

    it('an occupied first selectable day is fully occupied: nobody could arrive before it', async () => {
      const wrapper = await open({ disabledDates: ['2026-05-10', '2026-05-11'], showHalfDays: true })
      expect(halfClasses(wrapper, 10)).toEqual(['full-day-occupied'])
      expect(halfClasses(wrapper, 12)).toEqual(['half-day-arrival'])
    })

    it('does not mark days before minDate or after maxDate', async () => {
      const wrapper = await open({ disabledDates: ['2026-05-05', '2026-05-24'], maxDate: d(2026, 5, 22), showHalfDays: true })
      expect(halfClasses(wrapper, 5)).toEqual([])
      expect(halfClasses(wrapper, 6)).toEqual([])
      expect(halfClasses(wrapper, 24)).toEqual([])
      expect(halfClasses(wrapper, 25)).toEqual([])
    })

    it('keeps the markers while a stay is selected onto them', async () => {
      const wrapper = await open({ disabledDates, showHalfDays: true, useDiagonalStartEnd: true })
      await clickDay(wrapper, 16)
      expect(classes(wrapper, 16)).toEqual(expect.arrayContaining(['start-date-diagonal', 'half-day-arrival']))
      expect(classes(wrapper, 20)).toEqual(expect.arrayContaining(['selectable-disabled-diagonal', 'half-day-checkout']))
      await clickDay(wrapper, 20)
      expect(classes(wrapper, 20)).toEqual(expect.arrayContaining(['end-date-diagonal', 'half-day-checkout']))
      expect(halfClasses(wrapper, 18)).toEqual([])
    })

    it('follows changed disabledDates', async () => {
      const wrapper = await open({ disabledDates: ['2026-05-14'], showHalfDays: true })
      expect(halfClasses(wrapper, 15)).toEqual(['half-day-arrival'])
      await wrapper.setProps({ disabledDates: ['2026-05-14', '2026-05-15'] })
      expect(halfClasses(wrapper, 15)).toEqual(['full-day-occupied'])
      expect(halfClasses(wrapper, 16)).toEqual(['half-day-arrival'])
    })
  })
}
