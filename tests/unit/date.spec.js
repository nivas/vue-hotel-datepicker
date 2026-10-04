import { describe, expect, it } from 'vitest'
import { parseDate } from '../../src/utils/date'

describe('parseDate', () => {
  it('reads a date-only ISO string as a local calendar day', () => {
    expect(parseDate('2026-05-14')).toEqual(new Date(2026, 4, 14))
    expect(parseDate(' 2026-12-31 ')).toEqual(new Date(2026, 11, 31))
  })

  it('leaves other strings to the Date parser', () => {
    expect(parseDate('2026/05/14')).toEqual(new Date(2026, 4, 14))
    expect(parseDate('2026-05-14T10:30:00Z')).toEqual(new Date(Date.UTC(2026, 4, 14, 10, 30)))
  })

  it('copies Date objects and accepts timestamps', () => {
    const source = new Date(2026, 4, 14, 13, 45)
    const copy = parseDate(source)
    expect(copy).toEqual(source)
    expect(copy).not.toBe(source)
    expect(parseDate(source.getTime())).toEqual(source)
  })

  it('returns an invalid date for unparsable or impossible input', () => {
    expect(Number.isNaN(parseDate('not a date').getTime())).toBe(true)
    expect(Number.isNaN(parseDate('2026-02-31').getTime())).toBe(true)
    expect(Number.isNaN(parseDate('2026-13-01').getTime())).toBe(true)
  })
})
