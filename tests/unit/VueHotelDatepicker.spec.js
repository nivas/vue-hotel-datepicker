import { describe, expect, it } from 'vitest'
import { VueHotelDatepicker } from '../../src/index'
import { arrow, classes, clickDay, d, last, monthTitle, mountComponent, openPicker } from '../helpers'
import { sharedRules } from './shared-rules'

const input = wrapper => wrapper.find('input.vhd-input')
const selections = wrapper => (wrapper.emitted('update') || []).map(args => args[0])

describe('VueHotelDatepicker', () => {
  sharedRules({ open: openPicker, selections })

  describe('input and opening', () => {
    it('renders a closed picker with the placeholder', () => {
      const wrapper = mountComponent(VueHotelDatepicker)
      expect(wrapper.classes()).toContain('vhd-container')
      expect(input(wrapper).attributes('placeholder')).toBe('Select a date range')
      expect(input(wrapper).element.value).toBe('')
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
    })

    it('uses a custom placeholder and the mobile class', () => {
      const wrapper = mountComponent(VueHotelDatepicker, { placeholder: 'Odaberite datume', mobile: 'Mobile' })
      expect(input(wrapper).attributes('placeholder')).toBe('Odaberite datume')
      expect(wrapper.classes()).toContain('mobile')
    })

    it('opens on focus and emits beforeopen then open', async () => {
      const wrapper = mountComponent(VueHotelDatepicker)
      await input(wrapper).trigger('focus')
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(Object.keys(wrapper.emitted())).toEqual(['beforeopen', 'open'])
    })

    it('stays open on a repeated focus', async () => {
      const wrapper = mountComponent(VueHotelDatepicker)
      await input(wrapper).trigger('focus')
      await input(wrapper).trigger('focus')
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(wrapper.emitted('close')).toBeUndefined()
    })

    it('toggles on mousedown and emits open / close', async () => {
      const wrapper = mountComponent(VueHotelDatepicker)
      await input(wrapper).trigger('mousedown')
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(wrapper.emitted('open')).toHaveLength(1)
      expect(wrapper.emitted('beforeopen')).toBeUndefined()
      await input(wrapper).trigger('mousedown')
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('closes with the close icon and emits close', async () => {
      const wrapper = await openPicker()
      await wrapper.find('.vhd-calendar-header a.close').trigger('click')
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })

    it('exposes open() and close() to the parent', async () => {
      const wrapper = mountComponent(VueHotelDatepicker)
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(wrapper.emitted('open')).toHaveLength(1)
      wrapper.vm.close()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('close')).toHaveLength(1)
    })
  })

  describe('input value', () => {
    it('follows the selection', async () => {
      const wrapper = await openPicker()
      await clickDay(wrapper, 12)
      expect(input(wrapper).element.value).toBe('2026/05/12 ~ ')
      await clickDay(wrapper, 15)
      expect(input(wrapper).element.value).toBe('2026/05/12 ~ 2026/05/15')
    })

    it('uses format and separator, also in the emitted values', async () => {
      const wrapper = await openPicker({ format: 'DD.MM.YYYY', separator: '-' })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 3, 'right')
      expect(input(wrapper).element.value).toBe('12.05.2026 - 03.06.2026')
      expect(last(wrapper.emitted('update'))).toEqual([{ start: '12.05.2026', end: '03.06.2026' }])
    })

    it('shows the initial range', () => {
      const wrapper = mountComponent(VueHotelDatepicker, { startDate: d(2026, 7, 3), endDate: d(2026, 7, 8) })
      expect(input(wrapper).element.value).toBe('2026/07/03 ~ 2026/07/08')
    })

    it('shows a lone initial start date', () => {
      const wrapper = mountComponent(VueHotelDatepicker, { startDate: '2026/06/03' })
      expect(input(wrapper).element.value).toBe('2026/06/03 ~ ')
    })

    it('stays empty when the initial range conflicts with disabledDates', () => {
      const wrapper = mountComponent(VueHotelDatepicker, {
        startDate: d(2026, 5, 12),
        endDate: d(2026, 5, 18),
        disabledDates: ['2026/05/14']
      })
      expect(input(wrapper).element.value).toBe('')
    })

    it('is cleared when disabledDates invalidate the selection', async () => {
      const wrapper = await openPicker({ startDate: d(2026, 5, 12), endDate: d(2026, 5, 15) })
      await wrapper.setProps({ disabledDates: ['2026/05/13'] })
      expect(input(wrapper).element.value).toBe('')
    })
  })

  describe('header and footer', () => {
    it('shows the selected dates with from / to labels', async () => {
      const wrapper = await openPicker({ fromText: 'Od', toText: 'Do' })
      expect(wrapper.find('.vhd-calendar-header .info').text()).toBe('')
      await clickDay(wrapper, 12)
      expect(wrapper.find('.from-text').text()).toBe('Od')
      expect(wrapper.find('.to-text').exists()).toBe(false)
      await clickDay(wrapper, 15)
      expect(wrapper.find('.to-text').text()).toBe('Do')
      expect(wrapper.find('.vhd-calendar-header .info').text()).toContain('2026/05/12')
      expect(wrapper.find('.vhd-calendar-header .info').text()).toContain('2026/05/15')
    })

    it('shows reset once something is selected and confirm once the range is complete', async () => {
      const wrapper = await openPicker({ resetText: 'Poništi', confirmText: 'Potvrdi' })
      expect(wrapper.find('.reset').exists()).toBe(false)
      expect(wrapper.find('.confirm').exists()).toBe(false)
      await clickDay(wrapper, 12)
      expect(wrapper.find('.reset').text()).toBe('Poništi')
      expect(wrapper.find('.confirm').exists()).toBe(false)
      await clickDay(wrapper, 15)
      expect(wrapper.find('.confirm').text()).toBe('Potvrdi')
    })

    it('reset clears the selection and the input and emits reset', async () => {
      const wrapper = await openPicker()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.find('.reset').trigger('click')
      expect(wrapper.emitted('reset')).toHaveLength(1)
      expect(input(wrapper).element.value).toBe('')
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.in-date-range')).toHaveLength(0)
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
    })

    it('confirm emits the formatted range and closes without emitting close', async () => {
      const wrapper = await openPicker()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.find('.confirm').trigger('click')
      expect(wrapper.emitted('confirm')).toEqual([[{ start: '2026/05/12', end: '2026/05/15' }]])
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('autoClose', () => {
    it('is off by default: the picker stays open after the second date', async () => {
      const wrapper = await openPicker()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })

    it('stays open after the first date', async () => {
      const wrapper = await openPicker({ autoClose: true })
      await clickDay(wrapper, 12)
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })

    it('emits update, then confirm, and closes once the second date is selected', async () => {
      const wrapper = await openPicker({ autoClose: true })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('update')).toHaveLength(2)
      expect(wrapper.emitted('confirm')).toEqual([[{ start: '2026/05/12', end: '2026/05/15' }]])
      // emitted() also lists the native click that bubbles to the root element
      expect(Object.keys(wrapper.emitted()).filter(name => name !== 'click')).toEqual(['open', 'update', 'confirm'])
      expect(input(wrapper).element.value).toBe('2026/05/12 ~ 2026/05/15')
    })

    it('also closes when the second click is before the start date', async () => {
      const wrapper = await openPicker({ autoClose: true })
      await clickDay(wrapper, 15)
      await clickDay(wrapper, 12)
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('confirm')).toEqual([[{ start: '2026/05/12', end: '2026/05/15' }]])
    })

    it('stays open when the second click is rejected', async () => {
      const wrapper = await openPicker({ autoClose: true, minNight: 3, disabledDates: ['2026/05/20'] })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 13)
      await clickDay(wrapper, 22)
      await clickDay(wrapper, 12)
      expect(wrapper.emitted('error')).toHaveLength(2)
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      expect(wrapper.emitted('confirm')).toBeUndefined()
    })

    it('reopened on a complete range: the first click starts a new range, the second closes', async () => {
      const wrapper = await openPicker({ autoClose: true, startDate: d(2026, 5, 12), endDate: d(2026, 5, 15) })
      await clickDay(wrapper, 20)
      expect(wrapper.find('.vhd-picker').exists()).toBe(true)
      await clickDay(wrapper, 23)
      expect(wrapper.find('.vhd-picker').exists()).toBe(false)
      expect(wrapper.emitted('confirm')).toEqual([[{ start: '2026/05/20', end: '2026/05/23' }]])
    })

    it('does not emit close, like the confirm button', async () => {
      const wrapper = await openPicker({ autoClose: true })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(wrapper.emitted('close')).toBeUndefined()
    })
  })

  describe('startDate / endDate changes (calendars sharing state)', () => {
    it('follows a new range from the parent without emitting update', async () => {
      const wrapper = await openPicker()
      await wrapper.setProps({ startDate: d(2026, 5, 18), endDate: d(2026, 5, 21) })
      expect(input(wrapper).element.value).toBe('2026/05/18 ~ 2026/05/21')
      expect(classes(wrapper, 18)).toContain('start-date')
      expect(classes(wrapper, 21)).toContain('end-date')
      expect(wrapper.emitted('update')).toBeUndefined()
    })

    it('accepts strings', async () => {
      const wrapper = await openPicker()
      await wrapper.setProps({ startDate: '2026/05/18', endDate: '2026/05/21' })
      expect(input(wrapper).element.value).toBe('2026/05/18 ~ 2026/05/21')
    })

    it('drops the highlighted range when the parent clears both dates', async () => {
      const wrapper = await openPicker({ startDate: d(2026, 5, 18), endDate: d(2026, 5, 21) })
      await wrapper.setProps({ startDate: undefined, endDate: undefined })
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.end-date')).toHaveLength(0)
    })

    it('clears the input when the parent clears both dates', async () => {
      const wrapper = await openPicker({ startDate: d(2026, 5, 18), endDate: d(2026, 5, 21) })
      expect(input(wrapper).element.value).toBe('2026/05/18 ~ 2026/05/21')
      await wrapper.setProps({ startDate: undefined, endDate: undefined })
      expect(input(wrapper).element.value).toBe('')
      expect(wrapper.find('.vhd-calendar-header .info').text()).toBe('')
    })

    it('drops the end date from the input when the parent clears only the end date', async () => {
      const wrapper = await openPicker({ startDate: d(2026, 5, 18), endDate: d(2026, 5, 21) })
      await wrapper.setProps({ endDate: undefined })
      expect(input(wrapper).element.value).toBe('2026/05/18 ~ ')
    })

    it('lowers minDate to an initial start date that lies before it', async () => {
      const wrapper = await openPicker({ startDate: d(2026, 5, 5), endDate: d(2026, 5, 8) })
      expect(classes(wrapper, 5)).toContain('start-date')
      expect(classes(wrapper, 4)).toContain('disabled')
      expect(classes(wrapper, 6)).not.toContain('disabled')
    })
  })

  describe('resetMonthOnOpen', () => {
    const browseAwayAndReopen = async wrapper => {
      await arrow(wrapper, 2).trigger('click')
      wrapper.vm.close()
      await wrapper.vm.$nextTick()
      wrapper.vm.open()
      await wrapper.vm.$nextTick()
    }

    it('keeps the browsed month by default', async () => {
      const wrapper = await openPicker()
      await browseAwayAndReopen(wrapper)
      expect(monthTitle(wrapper, 'left')).toBe('Jul. 2026')
    })

    it('returns to the minDate month when enabled', async () => {
      const wrapper = await openPicker({ resetMonthOnOpen: true })
      await browseAwayAndReopen(wrapper)
      expect(monthTitle(wrapper, 'left')).toBe('May. 2026')
    })

    it('returns to the month of the selection when enabled', async () => {
      const wrapper = await openPicker({ resetMonthOnOpen: true })
      await arrow(wrapper, 1).trigger('click')
      await clickDay(wrapper, 10)
      await clickDay(wrapper, 14)
      await arrow(wrapper, 2).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Aug. 2026')
      await browseAwayAndReopen(wrapper)
      expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
    })
  })

  describe('render()', () => {
    it('re-reads minDate / maxDate after the props changed', async () => {
      const wrapper = await openPicker()
      await wrapper.setProps({ minDate: d(2026, 5, 20), maxDate: d(2026, 5, 25) })
      expect(classes(wrapper, 15)).not.toContain('disabled')
      wrapper.vm.render()
      await wrapper.vm.$nextTick()
      expect(classes(wrapper, 15)).toContain('disabled')
      expect(classes(wrapper, 20)).not.toContain('disabled')
      expect(classes(wrapper, 26)).toContain('disabled')
    })
  })
})
