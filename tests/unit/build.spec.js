import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

// Smoke test of the published bundles. Skipped until `npm run build:lib` has produced ./lib.
const built = existsSync('lib/vue-hotel-datepicker.mjs')

describe.skipIf(!built)('built library', () => {
  it('ES bundle exports both components and injects its own styles', async () => {
    const lib = await import('../../lib/vue-hotel-datepicker.mjs')
    expect(lib.default).toBe(lib.VueHotelDatepicker)
    expect(lib.VueHotelDatepickerModal.name).toBe('VueHotelDatepickerModal')
    expect(document.head.querySelector('style').textContent).toContain('.vhd-container')

    const wrapper = mount(lib.VueHotelDatepicker)
    wrapper.vm.open()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.vhd-calendar-left .calendar-month-title').text()).toBe('May. 2026')
    expect(wrapper.findAll('.vhd-calendar-left .day:not(.empty)')).toHaveLength(31)
    wrapper.unmount()
  })

  it('UMD bundle can be required', () => {
    const lib = createRequire(import.meta.url)('../../lib/vue-hotel-datepicker.umd.js')
    expect(lib.default).toBe(lib.VueHotelDatepicker)
    expect(lib.VueHotelDatepickerModal.name).toBe('VueHotelDatepickerModal')
  })
})
