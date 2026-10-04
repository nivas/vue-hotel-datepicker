import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { classes, monthTitle, openModal, openPicker } from '../helpers'

// Visitors book from anywhere. Date-only ISO strings ('2026-05-14') must mean that calendar day in
// every browser timezone, not UTC midnight (which is the evening before in the Americas).
for (const zone of ['America/New_York', 'Pacific/Honolulu', 'Europe/Zagreb', 'Pacific/Auckland']) {
  describe(`date strings in ${zone}`, () => {
    const originalZone = process.env.TZ

    beforeEach(() => {
      process.env.TZ = zone
      vi.setSystemTime(new Date(2026, 4, 10))
    })

    afterEach(() => {
      process.env.TZ = originalZone
    })

    it('switches the timezone of the test process', () => {
      expect(Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(zone)
      expect(new Date(2026, 4, 10).getDate()).toBe(10)
    })

    for (const [name, open] of [['VueHotelDatepicker', openPicker], ['VueHotelDatepickerModal', openModal]]) {
      describe(name, () => {
        it('disables exactly the given ISO dates', async () => {
          const wrapper = await open({ disabledDates: ['2026-05-14', '2026-05-20'] })
          expect(wrapper.findAll('.vhd-calendar-left .day.forbidden').map(c => c.text())).toEqual(['14', '20'])
        })

        it('disables exactly the given slash dates', async () => {
          const wrapper = await open({ disabledDates: ['2026/05/14', '2026/05/20'] })
          expect(wrapper.findAll('.vhd-calendar-left .day.forbidden').map(c => c.text())).toEqual(['14', '20'])
        })

        it('preselects ISO startDate / endDate on the given days', async () => {
          const wrapper = await open({ startDate: '2026-06-01', endDate: '2026-06-05' })
          expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
          expect(classes(wrapper, 1)).toContain('start-date')
          expect(classes(wrapper, 5)).toContain('end-date')
        })

        it('applies ISO minDate / maxDate on the given days', async () => {
          const wrapper = await open({ minDate: '2026-06-10', maxDate: '2026-06-12' })
          expect(monthTitle(wrapper, 'left')).toBe('Jun. 2026')
          expect(classes(wrapper, 9)).toContain('disabled')
          expect(classes(wrapper, 10)).not.toContain('disabled')
          expect(classes(wrapper, 12)).not.toContain('disabled')
          expect(classes(wrapper, 13)).toContain('disabled')
        })
      })
    }
  })
}
