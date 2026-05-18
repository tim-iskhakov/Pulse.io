import type { CoinMarket } from '../types/coinsMarkets'

/** Normalize useFetch `data` before writing the coins list store (null on error must clear rows). */
export function coinsListForStoreFromFetch(data: CoinMarket[] | null | undefined): CoinMarket[] {
  return Array.isArray(data) ? data : []
}
