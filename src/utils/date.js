const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Turns a date prop value (Date, timestamp or string) into a new Date.
 *
 * Date-only ISO strings ('2026-05-14') are read as that calendar day in the local timezone.
 * `new Date('2026-05-14')` is UTC midnight, which is still the previous day in timezones west of UTC,
 * so the picker would mark the wrong day there. Every other string is left to the Date parser.
 */
export function parseDate (value) {
  if (value instanceof Date) return new Date(value.getTime())
  if (typeof value === 'string') {
    const match = ISO_DATE_ONLY.exec(value.trim())
    if (match) {
      const [year, month, day] = match.slice(1).map(Number)
      const date = new Date(year, month - 1, day)
      // new Date(2026, 1, 31) rolls over to March; keep such input invalid, as the Date parser does
      return date.getMonth() === month - 1 && date.getDate() === day ? date : new Date(NaN)
    }
  }
  return new Date(value)
}
