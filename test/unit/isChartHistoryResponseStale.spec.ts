import { describe, expect, it } from 'vitest'
import { isChartHistoryResponseStale } from '../../app/utils/isChartHistoryResponseStale'

describe('isChartHistoryResponseStale', () => {
  it('returns false when the route coin still matches the request', () => {
    expect(isChartHistoryResponseStale('bitcoin', 'bitcoin')).toBe(false)
  })

  it('returns true when the user navigated to another coin before the response applied', () => {
    expect(isChartHistoryResponseStale('bitcoin', 'ethereum')).toBe(true)
  })
})
