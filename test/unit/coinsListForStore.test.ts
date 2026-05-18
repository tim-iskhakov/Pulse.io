import { describe, expect, it } from 'vitest'
import type { CoinMarket } from '../../shared/types/coinsMarkets'
import { coinsListForStoreFromFetch } from '../../shared/utils/coinsListForStore'

describe('coinsListForStoreFromFetch', () => {
  it('returns empty array when fetch data is null or not an array', () => {
    expect(coinsListForStoreFromFetch(null)).toEqual([])
    expect(coinsListForStoreFromFetch(undefined)).toEqual([])
  })

  it('passes through a valid list', () => {
    const row = { id: 'bitcoin' } as CoinMarket
    expect(coinsListForStoreFromFetch([row])).toEqual([row])
  })
})
