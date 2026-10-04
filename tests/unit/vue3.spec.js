import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import DefaultExport, { VueHotelDatepicker, VueHotelDatepickerModal } from '../../src/index'
import { classes, clickDay } from '../helpers'

// Behaviour that the Vue 2 -> Vue 3 migration could silently change.
describe('Vue 3 specifics', () => {
  it('exports both components, the inline picker as default', () => {
    expect(DefaultExport).toBe(VueHotelDatepicker)
    expect(VueHotelDatepicker.name).toBe('VueHotelDatepicker')
    expect(VueHotelDatepickerModal.name).toBe('VueHotelDatepickerModal')
  })

  it('declares every emitted event, so listeners do not fall through to the root element', () => {
    expect(VueHotelDatepicker.emits).toEqual(
      ['beforeopen', 'open', 'close', 'reset', 'confirm', 'update', 'error', 'selection-invalidated'])
    expect(VueHotelDatepickerModal.emits).toEqual(
      ['apply', 'cancel', 'reset-selection', 'update-selection', 'error', 'selection-invalidated'])
  })

  it('calls parent listeners exactly once per event', async () => {
    const onUpdate = vi.fn()
    const onReset = vi.fn()
    const onClose = vi.fn()
    const wrapper = mount(VueHotelDatepicker, { attrs: { onUpdate, onReset, onClose } })
    wrapper.vm.open()
    await nextTick()
    await clickDay(wrapper, 12)
    await wrapper.find('.reset').trigger('click')
    await wrapper.find('a.close').trigger('click')
    expect(onUpdate).toHaveBeenCalledTimes(1)
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('passes class and other attributes on to the root element', () => {
    const wrapper = mount(VueHotelDatepicker, { attrs: { class: 'booking-mask-dates', id: 'dates' } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['vhd-container', 'booking-mask-dates']))
    expect(wrapper.attributes('id')).toBe('dates')
    wrapper.unmount()
  })

  it('exposes open / close / render through a template ref', async () => {
    const wrapper = mount({
      render () {
        return h(VueHotelDatepicker, { ref: 'picker' })
      }
    })
    const picker = wrapper.vm.$refs.picker
    expect(typeof picker.render).toBe('function')
    picker.open()
    await nextTick()
    expect(wrapper.find('.vhd-picker').exists()).toBe(true)
    picker.close()
    await nextTick()
    expect(wrapper.find('.vhd-picker').exists()).toBe(false)
    wrapper.unmount()
  })

  for (const [name, component, extraProps] of [
    ['VueHotelDatepicker', VueHotelDatepicker, {}],
    ['VueHotelDatepickerModal', VueHotelDatepickerModal, { active: true }]
  ]) {
    it(`${name} reacts to disabledDates mutated in place (push), as it did on Vue 2`, async () => {
      const state = reactive({ disabledDates: [] })
      const wrapper = mount({
        render () {
          return h(component, { ref: 'picker', disabledDates: state.disabledDates, ...extraProps })
        }
      })
      if (wrapper.vm.$refs.picker.open) wrapper.vm.$refs.picker.open()
      await nextTick()
      await clickDay(wrapper, 12)
      await clickDay(wrapper, 15)

      state.disabledDates.push('2026/05/20')
      await nextTick()
      expect(classes(wrapper, 20)).toContain('forbidden')
      expect(classes(wrapper, 12)).toContain('start-date')

      state.disabledDates.push('2026/05/13')
      await nextTick()
      expect(classes(wrapper, 13)).toContain('forbidden')
      expect(wrapper.findAll('.day.start-date')).toHaveLength(0)
      wrapper.unmount()
    })
  }
})
