import { describe, expect, it } from 'vitest'
import { isStaleChartHistoryRequest, mergeChartHistoryPoints } from '../../app/utils/chartHistory'

describe('mergeChartHistoryPoints', () => {
  it('merges older points ahead of existing data and deduplicates by time', () => {
    const existing = [
      { time: 200, value: 2 },
      { time: 300, value: 3 }
    ]
    const incoming = [
      { time: 100, value: 1 },
      { time: 200, value: 9 }
    ]

    expect(mergeChartHistoryPoints(existing, incoming)).toEqual([
      { time: 100, value: 1 },
      { time: 200, value: 2 },
      { time: 300, value: 3 }
    ])
  })
})

describe('isStaleChartHistoryRequest', () => {
  it('returns true when navigation changed the active coin during fetch', () => {
    expect(isStaleChartHistoryRequest('bitcoin', 'ethereum')).toBe(true)
  })

  it('returns false when the active coin is unchanged', () => {
    expect(isStaleChartHistoryRequest('bitcoin', 'bitcoin')).toBe(false)
  })
})
