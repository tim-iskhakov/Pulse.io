export const COINS_MARKETS_ORDERS = [
  'market_cap_asc',
  'market_cap_desc',
  'volume_asc',
  'volume_desc',
  'id_asc',
  'id_desc'
] as const

export interface CoinsMarketsQuery {
  vs_currency?: string
  order?: (typeof COINS_MARKETS_ORDERS)[number]
  per_page?: number
  page?: number
  sparkline?: boolean
}

export interface CoinMarketRaw {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  roi: {
    currency: string
    percentage: number
    times?: number
  }
  last_updated: string
  sparkline_in_7d: { price: number[] }
  price_change_percentage_1h_in_currency?: number
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_14d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
  price_change_percentage_200d_in_currency?: number
  price_change_percentage_1y_in_currency?: number
}

export interface CoinMarket {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapRank: number
  fullyDilutedValuation: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChange24h: number
  priceChangePercentage24h: number
  marketCapChange24h: number
  marketCapChangePercentage24h: number
  circulatingSupply: number
  totalSupply: number
  maxSupply: number
  ath: number
  athChangePercentage: number
  athDate: string
  atl: number
  atlChangePercentage: number
  atlDate: string
  roi: {
    currency: string
    percentage: number
    times?: number
  }
  lastUpdated: string
  sparklineIn7d?: { price: number[] }
  priceChangePercentage1hInCurrency?: number
  priceChangePercentage7dInCurrency?: number
  priceChangePercentage14dInCurrency?: number
  priceChangePercentage30dInCurrency?: number
  priceChangePercentage200dInCurrency?: number
  priceChangePercentage1yInCurrency?: number
}

export type CoinMarketsListResponse = CoinMarket[]
