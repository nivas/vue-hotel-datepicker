import { mount } from '@vue/test-utils'
import { VueHotelDatepicker, VueHotelDatepickerModal } from '../src/index'

export const TODAY = new Date(2026, 4, 10)

/** Local-midnight date, month is 1-based: d(2026, 5, 12) */
export const d = (year, month, day) => new Date(year, month - 1, day)

export const fmt = date => {
  if (!date) return null
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}/${mm}/${dd}`
}

const mounted = []

export function mountComponent (component, props = {}) {
  const wrapper = mount(component, { props })
  mounted.push(wrapper)
  return wrapper
}

export function unmountAll () {
  while (mounted.length) mounted.pop().unmount()
}

/** Inline picker, already opened. */
export async function openPicker (props = {}) {
  const wrapper = mountComponent(VueHotelDatepicker, props)
  wrapper.vm.open()
  await wrapper.vm.$nextTick()
  return wrapper
}

/** Modal picker, mounted inactive and then activated by the parent, the way it is used in an app. */
export async function openModal (props = {}) {
  const wrapper = mountComponent(VueHotelDatepickerModal, props)
  await wrapper.setProps({ active: true })
  return wrapper
}

const all = (wrapper, selector) => {
  const found = wrapper.findAll(selector)
  return found.wrappers || found
}

const panel = side => `.vhd-calendar-${side}`

/** Day cell showing day-of-month `n` in the left (default) or right month. */
export function day (wrapper, n, side = 'left') {
  const cell = all(wrapper, `${panel(side)} .day`).find(c => c.text() === String(n))
  if (!cell) throw new Error(`day ${n} not found in ${side} month`)
  return cell
}

export async function clickDay (wrapper, n, side = 'left') {
  await day(wrapper, n, side).trigger('click')
}

export const classes = (wrapper, n, side = 'left') => day(wrapper, n, side).classes()

/** Month as rendered: array of weeks, each an array of 7 strings ('' for an empty cell). */
export function grid (wrapper, side = 'left') {
  return all(wrapper, `${panel(side)} .week`).map(week => all(week, '.day').map(c => c.text()))
}

export const monthTitle = (wrapper, side = 'left') => wrapper.find(`${panel(side)} .calendar-month-title`).text()

export const weekHeader = (wrapper, side = 'left') => all(wrapper, `${panel(side)} .calendar-week-item`).map(c => c.text())

/** Navigation arrows: -2/-1/+1 live in the left month header, +2 in the right one. */
export function arrow (wrapper, offset) {
  const selector = {
    '-2': `${panel('left')} .previous-arrow.offset-2`,
    '-1': `${panel('left')} .previous-arrow.offset-1`,
    1: `${panel('left')} .next-arrow.offset-1`,
    2: `${panel('right')} .next-arrow`
  }[offset]
  return wrapper.find(selector)
}

export const last = list => list && list[list.length - 1]
