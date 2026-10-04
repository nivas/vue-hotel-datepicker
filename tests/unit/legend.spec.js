import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { openModal, openPicker } from '../helpers'

const legend = [
  { type: 'available', label: 'Dostupno' },
  { type: 'arrival', label: 'Dolazak' },
  { type: 'departure', label: 'Odlazak' },
  { type: 'occupied', label: 'Zauzeto' }
]

for (const [name, open] of [['VueHotelDatepicker', openPicker], ['VueHotelDatepickerModal', openModal]]) {
  describe(`${name} legend`, () => {
    it('is not rendered by default', async () => {
      const wrapper = await open()
      expect(wrapper.find('.vhd-calendar-legend').exists()).toBe(false)
    })

    it('renders one labelled swatch per item, in the given order', async () => {
      const wrapper = await open({ legend })
      const items = wrapper.findAll('.vhd-calendar-legend .vhd-legend-item')
      expect(items.map(item => item.text())).toEqual(['Dostupno', 'Dolazak', 'Odlazak', 'Zauzeto'])
      expect(items.map(item => item.find('.vhd-legend-swatch').classes().find(c => c.startsWith('vhd-legend-') && c !== 'vhd-legend-swatch')))
        .toEqual(['vhd-legend-available', 'vhd-legend-arrival', 'vhd-legend-departure', 'vhd-legend-occupied'])
    })

    it('draws the swatches as half days with useDiagonalStartEnd', async () => {
      const plain = await open({ legend })
      expect(plain.findAll('.vhd-legend-swatch.diagonal')).toHaveLength(0)
      const diagonal = await open({ legend, useDiagonalStartEnd: true })
      expect(diagonal.findAll('.vhd-legend-swatch.diagonal')).toHaveLength(4)
    })

    it('supports the checkout-only type and passes unknown types through as a class', async () => {
      const wrapper = await open({ legend: [{ type: 'checkout', label: 'Check-out only' }, { type: 'best-price', label: 'Best price' }] })
      expect(wrapper.find('.vhd-legend-checkout').exists()).toBe(true)
      expect(wrapper.find('.vhd-legend-best-price').exists()).toBe(true)
    })

    it('sits above the message', async () => {
      const wrapper = await open({ legend, message: '* Lowest price per person' })
      const html = wrapper.html()
      expect(html.indexOf('vhd-calendar-legend')).toBeGreaterThan(-1)
      expect(html.indexOf('vhd-calendar-legend')).toBeLessThan(html.indexOf('vhd-calendar-message'))
    })

    it('follows a changed legend prop', async () => {
      const wrapper = await open({ legend })
      await wrapper.setProps({ legend: [] })
      expect(wrapper.find('.vhd-calendar-legend').exists()).toBe(false)
    })

    it('can be replaced with the legend slot', async () => {
      const wrapper = await open({}, { legend: () => h('p', { class: 'custom-legend' }, 'my legend') })
      expect(wrapper.find('.vhd-calendar-legend .custom-legend').text()).toBe('my legend')
      expect(wrapper.findAll('.vhd-legend-item')).toHaveLength(0)
    })
  })
}
