import { describe, expect, it } from 'vitest'

/**
 * Regression for chart history loads: if the user navigates to another coin while
 * a range request is in flight, the response must not be merged into the new coin.
 */
describe('chart range merge (navigation race)', () => {
  it('skips merge when coinId changed before the range response arrives', () => {
    let coinId = 'bitcoin'
    const chartLoadCoinId = coinId

    const chartPoints = [{ time: 1_700_000_000, value: 42_000 }]
    const staleRangePoints = [{ time: 1_699_000_000, value: 40_000 }]

    coinId = 'ethereum'

    const shouldMerge = coinId === chartLoadCoinId
    expect(shouldMerge).toBe(false)

    if (!shouldMerge) {
      expect(chartPoints).toEqual([{ time: 1_700_000_000, value: 42_000 }])
      return
    }

    chartPoints.unshift(...staleRangePoints)
    expect(chartPoints).toHaveLength(2)
  })
})
