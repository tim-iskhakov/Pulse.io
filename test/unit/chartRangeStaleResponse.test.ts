import { describe, expect, it } from 'vitest'
import { shouldMergeChartRangeAfterFetch } from '../../app/utils/chartRangeMergeGuard'

describe('shouldMergeChartRangeAfterFetch', () => {
  it('returns false when the user navigated to another coin before merge', () => {
    expect(shouldMergeChartRangeAfterFetch('bitcoin', 'ethereum')).toBe(false)
  })

  it('returns true when still on the coin that requested history', () => {
    expect(shouldMergeChartRangeAfterFetch('bitcoin', 'bitcoin')).toBe(true)
  })
})
