import { afterEach, beforeEach, vi } from 'vitest'
import { TODAY, unmountAll } from './helpers'

// "Today" is frozen to Sunday 2026-05-10 so calendar grids, the default minDate and the
// `today` class are deterministic. May 2026 starts on a Friday, June 2026 on a Monday.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'], now: TODAY })
  // the components log on rejected/invalid input; keep test output clean, specs assert on the spies
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  unmountAll()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
