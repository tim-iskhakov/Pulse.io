import { describe, expect, it } from 'vitest'
import { normalizeMarketsPagination } from '../../server/utils/normalizeMarketsPagination'

describe('normalizeMarketsPagination', () => {
  it('defaults page to 1 and per_page to 20 when missing', () => {
    expect(normalizeMarketsPagination(undefined, undefined)).toEqual({ per_page: 20, page: 1 })
  })

  it('clamps per_page to CoinGecko max 250', () => {
    expect(normalizeMarketsPagination(9999, 1)).toEqual({ per_page: 250, page: 1 })
  })

  it('falls back when page or per_page are not finite', () => {
    expect(normalizeMarketsPagination('x', 'y')).toEqual({ per_page: 20, page: 1 })
    expect(normalizeMarketsPagination(10, '0')).toEqual({ per_page: 10, page: 1 })
  })

  it('floors valid numeric strings', () => {
    expect(normalizeMarketsPagination('25', '3')).toEqual({ per_page: 25, page: 3 })
  })
})
