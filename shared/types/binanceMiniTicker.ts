export const BINANCE_SPOT_WS_URL = 'wss://stream.binance.com:9443/ws' as const
export const BINANCE_MINI_TICKER_ARR_STREAM = '!miniTicker@arr' as const

export interface BinanceMiniTicker24hRow {
  e: '24hrMiniTicker'
  E: number // Event time (ms)
  s: string // Symbol, e.g. `BTCUSDT`
  c: string // Close price
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
}
