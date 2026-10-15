import { h, mergeProps } from 'vue'
import VueHotelDatepicker from '@/components/VueHotelDatepicker.vue'

// Demo only: the page holds many inline pickers, and an open one stays open until it is closed, so
// testing one example after another stacked the calendars on top of each other. This wrapper renders
// the real component and closes every other open picker when one opens. The package itself does not do this.
const pickers = new Set()

export function closeOpenPickers (except) {
  for (const picker of pickers) {
    if (picker !== except) picker.close()
  }
}

export default {
  name: 'VueHotelDatepicker',
  inheritAttrs: false,
  created () {
    pickers.add(this)
  },
  unmounted () {
    pickers.delete(this)
  },
  methods: {
    // the methods of the real component, for template refs (example 13)
    open () {
      this.$refs.picker.open()
    },
    close () {
      if (this.$refs.picker?.active) this.$refs.picker.close()
    }
  },
  render () {
    // mergeProps keeps the page's own @open listener next to this one
    return h(VueHotelDatepicker, mergeProps(this.$attrs, { ref: 'picker', onOpen: () => closeOpenPickers(this) }), this.$slots)
  }
}
