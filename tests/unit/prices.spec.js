import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { classes, clickDay, day, last, openModal, openPicker, price } from '../helpers'

const prices = {
  '2026-05-12': 89,
  '2026-05-13': '95 €',
  '2026-05-14': 0,
  '2026-05-15': null,
  '2026-05-16': '',
  '2026-06-02': 120
}

for (const [name, open, selectionEvent] of [
  ['VueHotelDatepicker', openPicker, 'update'],
  ['VueHotelDatepickerModal', openModal, 'update-selection']
]) {
  describe(`${name} day prices`, () => {
    it('renders no price elements and no marker class without prices', async () => {
      const wrapper = await open()
      expect(wrapper.findAll('.vhd-day-price')).toHaveLength(0)
      expect(wrapper.find('.vhd-has-day-content').exists()).toBe(false)
    })

    it('shows the price of a day under its number, in both months', async () => {
      const wrapper = await open({ prices })
      expect(price(wrapper, 12)).toBe('89')
      expect(price(wrapper, 13)).toBe('95 €')
      expect(price(wrapper, 2, 'right')).toBe('120')
      expect(day(wrapper, 12).find('span').text()).toBe('12')
    })

    it('shows a price of 0 but nothing for null, empty or missing entries', async () => {
      const wrapper = await open({ prices })
      expect(price(wrapper, 14)).toBe('0')
      expect(price(wrapper, 15)).toBeUndefined()
      expect(price(wrapper, 16)).toBeUndefined()
      expect(price(wrapper, 17)).toBeUndefined()
      expect(wrapper.findAll('.vhd-day-price')).toHaveLength(4)
    })

    it('marks the picker so the cells can grow', async () => {
      const wrapper = await open({ prices })
      expect(wrapper.find('.vhd-has-day-content').exists()).toBe(true)
    })

    it('keys are ISO dates, whatever the display format is', async () => {
      const wrapper = await open({ prices, format: 'DD.MM.YYYY' })
      expect(price(wrapper, 12)).toBe('89')
    })

    it('follows a changed prices prop', async () => {
      const wrapper = await open({ prices })
      await wrapper.setProps({ prices: { '2026-05-20': 150 } })
      expect(price(wrapper, 12)).toBeUndefined()
      expect(price(wrapper, 20)).toBe('150')
      await wrapper.setProps({ prices: {} })
      expect(wrapper.findAll('.vhd-day-price')).toHaveLength(0)
      expect(wrapper.find('.vhd-has-day-content').exists()).toBe(false)
    })

    it('keeps showing prices on disabled days and leaves the day classes alone', async () => {
      const wrapper = await open({ prices: { '2026-05-05': 70, '2026-05-14': 99 }, disabledDates: ['2026-05-14'] })
      expect(price(wrapper, 5)).toBe('70')
      expect(classes(wrapper, 5)).toContain('disabled')
      expect(price(wrapper, 14)).toBe('99')
      expect(classes(wrapper, 14)).toContain('forbidden')
    })

    it('a click on the price selects the day', async () => {
      const wrapper = await open({ prices })
      await day(wrapper, 12).find('.vhd-day-price').trigger('click')
      await clickDay(wrapper, 13)
      expect(wrapper.emitted(selectionEvent)).toHaveLength(2)
      expect(classes(wrapper, 12)).toContain('start-date')
      expect(classes(wrapper, 13)).toContain('end-date')
      expect(last(wrapper.emitted(selectionEvent))[0].end).toBeTruthy()
    })

    describe('day slot', () => {
      it('replaces the default price and receives the date and its price', async () => {
        const seen = []
        const wrapper = await open({ prices }, {
          day: props => {
            seen.push(props)
            return props.price === undefined ? null : h('em', { class: 'custom-price' }, `from ${props.price}`)
          }
        })
        expect(wrapper.findAll('.vhd-day-price')).toHaveLength(0)
        expect(day(wrapper, 12).find('.custom-price').text()).toBe('from 89')
        expect(day(wrapper, 17).find('.custom-price').exists()).toBe(false)
        const may12 = seen.find(p => p.isoDate === '2026-05-12')
        expect(may12.date).toEqual(new Date(2026, 4, 12))
        expect(may12.price).toBe(89)
      })

      it('is not called for empty cells', async () => {
        const slot = vi.fn(() => null)
        await open({}, { day: slot })
        expect(slot.mock.calls.every(([props]) => props.date instanceof Date)).toBe(true)
        // May 2026 (31 days) + June 2026 (30 days)
        expect(new Set(slot.mock.calls.map(([props]) => props.isoDate)).size).toBe(61)
      })

      it('marks the picker as having day content even without prices', async () => {
        const wrapper = await open({}, { day: () => h('i', 'x') })
        expect(wrapper.find('.vhd-has-day-content').exists()).toBe(true)
      })
    })
  })
}

describe('day prices in a timezone west of UTC', () => {
  const zone = process.env.TZ
  afterEach(() => { process.env.TZ = zone })

  it('land on the day named by the key', async () => {
    process.env.TZ = 'America/New_York'
    vi.setSystemTime(new Date(2026, 4, 10))
    for (const open of [openPicker, openModal]) {
      const wrapper = await open({ prices: { '2026-05-12': 89 } })
      expect(price(wrapper, 12)).toBe('89')
      expect(price(wrapper, 11)).toBeUndefined()
    }
  })
})
