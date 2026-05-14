import { describe, it, expect } from 'vitest'
import { shouldApplyChartRangeMerge } from '../../app/utils/shouldApplyChartRangeMerge'

describe('shouldApplyChartRangeMerge', () => {
  it('returns true when session is unchanged', () => {
    expect(shouldApplyChartRangeMerge(3, 3)).toBe(true)
  })

  it('returns false after session bump (coin navigation)', () => {
    expect(shouldApplyChartRangeMerge(1, 2)).toBe(false)
  })
})
