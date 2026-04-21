import type { CoinMarketRaw, CoinMarket } from '#shared/types/coinsMarkets'

export const coinsMapper = (coins: CoinMarketRaw[]): CoinMarket[] => {
  return coins.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    image: coin.image,
    currentPrice: coin.current_price,
    marketCap: coin.market_cap,
    marketCapRank: coin.market_cap_rank,
    fullyDilutedValuation: coin.fully_diluted_valuation,
    totalVolume: coin.total_volume,
    high24h: coin.high_24h,
    low24h: coin.low_24h,
    priceChange24h: coin.price_change_24h,
    priceChangePercentage24h: coin.price_change_percentage_24h,
    marketCapChange24h: coin.market_cap_change_24h,
    marketCapChangePercentage24h: coin.market_cap_change_percentage_24h,
    circulatingSupply: coin.circulating_supply,
    totalSupply: coin.total_supply,
    maxSupply: coin.max_supply,
    ath: coin.ath,
    athChangePercentage: coin.ath_change_percentage,
    athDate: coin.ath_date,
    atl: coin.atl,
    atlChangePercentage: coin.atl_change_percentage,
    atlDate: coin.atl_date,
    roi: coin.roi,
    lastUpdated: coin.last_updated,
    sparklineIn7d: coin.sparkline_in_7d,
    priceChangePercentage1hInCurrency: coin.price_change_percentage_1h_in_currency,
    priceChangePercentage7dInCurrency: coin.price_change_percentage_7d_in_currency,
    priceChangePercentage14dInCurrency: coin.price_change_percentage_14d_in_currency,
    priceChangePercentage30dInCurrency: coin.price_change_percentage_30d_in_currency,
    priceChangePercentage200dInCurrency: coin.price_change_percentage_200d_in_currency,
    priceChangePercentage1yInCurrency: coin.price_change_percentage_1y_in_currency
  }))
}
