import { describe, expect, it } from 'vitest'
import { VueHotelDatepickerModal } from '../../src/index'
import { arrow, classes, clickDay, d, fmt, last, monthTitle, mountComponent, openModal } from '../helpers'
import { sharedRules } from './shared-rules'

const selections = wrapper => (wrapper.emitted('update-selection') || [])
  .map(([{ start, end }]) => ({ start: fmt(start), end: fmt(end) }))

describe('VueHotelDatepickerModal', () => {
  sharedRules({ open: openModal, selections })

  describe('visibility', () => {
    it('renders nothing while inactive', () => {
      const wrapper = mountComponent(VueHotelDatepickerModal)
      expect(wrapper.find('.date-range-picker-modal').exists()).toBe(false)
    })

    it('renders when active is set', async () => {
      const wrapper = mountComponent(VueHotelDatepickerModal)
      await wrapper.setProps({ active: true })
      expect(wrapper.find('.date-range-picker-modal').exists()).toBe(true)
      expect(monthTitle(wrapper, 'left')).toBe('May. 2026')
    })

    it('opens on the month of the start date when it is mounted already active', async () => {
      const wrapper = mountComponent(VueHotelDatepickerModal, { active: true, startDate: d(2026, 7, 3), endDate: d(2026, 7, 8) })
      await wrapper.vm.$nextTick()
      expect(monthTitle(wrapper, 'left')).toBe('Jul. 2026')
      expect(classes(wrapper, 3)).toContain('start-date')
    })

    it('opens on the month of minDate when it is mounted already active', async () => {
      const wrapper = mountComponent(VueHotelDatepickerModal, { active: true, minDate: d(2026, 8, 20) })
      await wrapper.vm.$nextTick()
      expect(monthTitle(wrapper, 'left')).toBe('Aug. 2026')
    })

    it('never closes itself: the parent owns `active`', async () => {
      const wrapper = await openModal()
      await wrapper.find('a.cancel').trigger('click')
      expect(wrapper.find('.date-range-picker-modal').exists()).toBe(true)
    })
  })

  describe('cancel', () => {
    it('is emitted by the cancel button', async () => {
      const wrapper = await openModal({ cancelText: 'Odustani' })
      expect(wrapper.find('a.cancel').text()).toBe('Odustani')
      await wrapper.find('a.cancel').trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('is emitted by the close icon', async () => {
      const wrapper = await openModal()
      await wrapper.find('.date-range-picker-modal-header a.close').trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('is emitted by a click on the overlay', async () => {
      const wrapper = await openModal()
      await wrapper.find('.date-range-picker-modal').trigger('click')
      expect(wrapper.emitted('cancel')).toHaveLength(1)
    })

    it('is not emitted by a click inside the dialog', async () => {
      const wrapper = await openModal()
      await wrapper.find('.date-range-picker-modal-container').trigger('click')
      await wrapper.find('.calendar-month-title').trigger('click')
      expect(wrapper.emitted('cancel')).toBeUndefined()
    })

    it('ignores overlay clicks with closeOnOverlayClick=false', async () => {
      const wrapper = await openModal({ closeOnOverlayClick: false })
      await wrapper.find('.date-range-picker-modal').trigger('click')
      expect(wrapper.emitted('cancel')).toBeUndefined()
    })
  })

  describe('apply', () => {
    it('is flagged disabled until the range is complete', async () => {
      const wrapper = await openModal({ applyText: 'Primijeni' })
      expect(wrapper.find('a.apply').text()).toBe('Primijeni')
      expect(wrapper.find('a.apply').classes()).toContain('disabled')
      await clickDay(wrapper, 12)
      expect(wrapper.find('a.apply').classes()).toContain('disabled')
      await clickDay(wrapper, 15)
      expect(wrapper.find('a.apply').classes()).not.toContain('disabled')
    })

    it('emits an error instead of apply while the range is incomplete', async () => {
      const wrapper = await openModal()
      await clickDay(wrapper, 12)
      await wrapper.find('a.apply').trigger('click')
      expect(wrapper.emitted('apply')).toBeUndefined()
      expect(wrapper.emitted('error')).toEqual([['Please select a valid start and end date.']])
    })

    it('emits Date objects plus formatted strings', async () => {
      const wrapper = await openModal({ format: 'DD.MM.YYYY' })
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      await wrapper.find('a.apply').trigger('click')
      expect(wrapper.emitted('apply')).toEqual([[{
        start: d(2026, 5, 12),
        end: d(2026, 5, 15),
        startFormatted: '12.05.2026',
        endFormatted: '15.05.2026'
      }]])
    })

    it('applies an untouched initial range', async () => {
      const wrapper = await openModal({ startDate: d(2026, 6, 3), endDate: d(2026, 6, 5) })
      await wrapper.find('a.apply').trigger('click')
      expect(last(wrapper.emitted('apply'))[0].startFormatted).toBe('2026/06/03')
      expect(last(wrapper.emitted('apply'))[0].endFormatted).toBe('2026/06/05')
    })
  })

  describe('update-selection', () => {
    it('emits Date objects, end is null until the range is complete', async () => {
      const wrapper = await openModal()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(wrapper.emitted('update-selection')).toEqual([
        [{ start: d(2026, 5, 12), end: null }],
        [{ start: d(2026, 5, 12), end: d(2026, 5, 15) }]
      ])
    })
  })

  describe('reset', () => {
    it('appears with a selection, clears it and emits reset-selection', async () => {
      const wrapper = await openModal({ resetText: 'Poništi' })
      expect(wrapper.find('a.reset').exists()).toBe(false)
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)
      expect(wrapper.find('a.reset').text()).toBe('Poništi')
      await wrapper.find('a.reset').trigger('click')
      expect(wrapper.emitted('reset-selection')).toHaveLength(1)
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(wrapper.findAll('.day.in-date-range')).toHaveLength(0)
      expect(wrapper.find('a.apply').classes()).toContain('disabled')
    })
  })

  describe('info panel', () => {
    it('shows from / separator / to as the selection progresses', async () => {
      const wrapper = await openModal({ fromText: 'Od', toText: 'Do', separator: '→', format: 'DD.MM.YYYY' })
      expect(wrapper.find('.info .from').exists()).toBe(false)
      await clickDay(wrapper, 12)
      expect(wrapper.find('.info .from .text').text()).toBe('Od')
      expect(wrapper.find('.info .from .date').text()).toBe('12.05.2026')
      expect(wrapper.find('.info .from-to-arrow').exists()).toBe(false)
      expect(wrapper.find('.info .to').exists()).toBe(false)
      await clickDay(wrapper, 15)
      expect(wrapper.find('.info .from-to-arrow').text()).toBe('→')
      expect(wrapper.find('.info .to .text').text()).toBe('Do')
      expect(wrapper.find('.info .to .date').text()).toBe('15.05.2026')
    })
  })

  describe('syncing with props', () => {
    it('discards an unapplied selection and restores the props when reopened', async () => {
      const wrapper = await openModal({ startDate: d(2026, 5, 12), endDate: d(2026, 5, 15) })
      await clickDay(wrapper, 20)
      await clickDay(wrapper, 22)
      await wrapper.setProps({ active: false })
      await wrapper.setProps({ active: true })
      expect(classes(wrapper, 12)).toContain('start-date')
      expect(classes(wrapper, 15)).toContain('end-date')
      expect(classes(wrapper, 20)).not.toContain('start-date')
    })

    it('follows startDate / endDate changes while open', async () => {
      const wrapper = await openModal()
      await wrapper.setProps({ startDate: d(2026, 5, 18), endDate: d(2026, 5, 21) })
      expect(classes(wrapper, 18)).toContain('start-date')
      expect(classes(wrapper, 21)).toContain('end-date')
    })

    it('follows minDate / maxDate changes while open', async () => {
      const wrapper = await openModal()
      await wrapper.setProps({ minDate: d(2026, 5, 20), maxDate: d(2026, 5, 25) })
      expect(classes(wrapper, 15)).toContain('disabled')
      expect(classes(wrapper, 20)).not.toContain('disabled')
      expect(classes(wrapper, 26)).toContain('disabled')
    })

    it('rejects an initial range that starts before minDate (unlike the inline picker)', async () => {
      const wrapper = await openModal({ startDate: d(2026, 5, 5), endDate: d(2026, 5, 8) })
      expect(console.warn).toHaveBeenCalled()
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      expect(classes(wrapper, 6)).toContain('disabled')
    })

    it('rejects an initial range that ends after maxDate', async () => {
      const wrapper = await openModal({ startDate: d(2026, 5, 12), endDate: d(2026, 5, 25), maxDate: d(2026, 5, 20) })
      expect(console.warn).toHaveBeenCalled()
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
    })
  })

  describe('resetMonthOnOpen', () => {
    const browseAwayAndReopen = async wrapper => {
      await arrow(wrapper, 2).trigger('click')
      expect(monthTitle(wrapper, 'left')).toBe('Jul. 2026')
      await wrapper.setProps({ active: false })
      await wrapper.setProps({ active: true })
    }

    it('keeps the browsed month by default', async () => {
      const wrapper = await openModal()
      await browseAwayAndReopen(wrapper)
      expect(monthTitle(wrapper, 'left')).toBe('Jul. 2026')
    })

    it('returns to the minDate month when enabled', async () => {
      const wrapper = await openModal({ resetMonthOnOpen: true })
      await browseAwayAndReopen(wrapper)
      expect(monthTitle(wrapper, 'left')).toBe('May. 2026')
    })

    it('returns to the month of the start date when enabled', async () => {
      const wrapper = await openModal({ resetMonthOnOpen: true, startDate: d(2026, 6, 10), endDate: d(2026, 6, 14) })
      expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
      await arrow(wrapper, 2).trigger('click')
      await wrapper.setProps({ active: false })
      await wrapper.setProps({ active: true })
      expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
    })
  })
})
