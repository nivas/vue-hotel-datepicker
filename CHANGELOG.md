# Changelog

Releases of `@nivashr/vue-hotel-datepicker`. The 2.x line (Vue 2) lives on the [`v2`](https://github.com/nivas/vue-hotel-datepicker/tree/v2) branch and is published under the npm dist-tag `vue2`.

## 3.1.0

New features are opt-in. All props, events and CSS selectors of 3.0.0 still exist and mean the same thing, so site CSS keeps working. Two defaults change: the date-click rule and the look of `message` (see below).

### Added

- `prices` prop: content under the day number, keyed by ISO date (`{ '2026-01-25': 89 }`). Values are shown as given, so the parent formats them (currency, rounding). With prices the day cells grow from 40 to 54px (`vhd-has-day-content` on the picker, `vhd-day-price` on the default price element).
- `day` slot (`date`, `isoDate`, `price`) for custom content under the day number, e.g. highlighting the cheapest nights.
- `legend` prop and `legend` slot: labelled swatches under the calendar, drawn in the calendar's own day styles. Types: `available`, `arrival`, `departure`, `occupied`, `checkout`, `checkin`; any other type becomes the class `vhd-legend-<type>`.
- `showHalfDays` prop (default `false`): before any click, the first day of an occupied block is shown as check-out only (`half-day-checkout`), the first free day after it as arrival only (`half-day-arrival`), and the rest as filled (`full-day-occupied`). Computed from `disabledDates` alone.
- Demo examples 19–21 and Modal 4.

### Changed (new defaults)

- **Clicking a free day behind a disabled date starts a new selection there.** In 3.0.0 and 2.x nothing happened, and the guest was stuck until they pressed Reset. While the end date is being picked, these days are now dimmed (`selectable-restart`) and a click moves the start date to them. This cannot be switched off. Days that break `minNight` / `maxNight` work as before: the click is rejected and `error` is emitted.
- **`message` is a neutral footnote in both components.** It is now small grey text under the calendar and legend. In the modal it used to be a pink alert box, and in the inline picker it had no styling. The selector is still `.vhd-calendar-message`, so a site that wants the old look can restyle it there.

## 3.0.0

First Vue 3 release (Vite build, Vitest suite, Node 20.19+ / 22.12+). Props, events, markup and class names are the same as 2.3.x.

- `autoClose` prop: finish on the second date without the confirm / apply button.
- Fixed (also in 2.3.9): date-only ISO strings (`'2026-05-14'`) were parsed as UTC midnight, which showed them one day early west of UTC. The inline input text stayed stale after the parent cleared the dates. A modal mounted with `active` already `true` ignored `startDate` / `minDate` when choosing the month.
