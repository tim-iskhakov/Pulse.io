import { getQuery } from 'h3'
import type { CoinMarketRaw } from '#shared/types/coinsMarkets'
import { coinsMapper } from '../utils/coinsMapper'

type CoinsQuery = {
  vs_currency: string
  order: string
  per_page: number
  sparkline: boolean
  page?: number
  price_change_percentage?: PriceChangePercentage
  precision?: Precision
}

type PriceChangePercentage = '1h' | '24h' | '7d' | '14d' | '30d' | '200d' | '1y'
type Precision =
  | 'full'
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'

const validPriceChangePercentages = new Set<PriceChangePercentage>([
  '1h',
  '24h',
  '7d',
  '14d',
  '30d',
  '200d',
  '1y'
])

const validPrecisions = new Set<Precision>([
  'full',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18'
])

const getTopCoins = defineCachedFunction(
  async (query: CoinsQuery) => {
    const data: CoinMarketRaw[] = await $fetch('https://api.coingecko.com/api/v3/coins/markets', {
      query
    })
    return coinsMapper(data)
  },
  {
    name: 'topCoins',
    maxAge: 30,
    getKey: (query: CoinsQuery) =>
      `${query.vs_currency}:${query.order}:${query.per_page}:${query.sparkline}:${query.page || ''}:${query.price_change_percentage || '7d'}:${query.precision || ''}`
  }
)

export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const parsedPriceChangePercentage = String(q.price_change_percentage || '7d')
  const parsedPrecision = String(q.precision || '2')

  const query: CoinsQuery = {
    vs_currency: String(q.vs_currency || 'usd'),
    order: String(q.order || 'market_cap_desc'),
    per_page: Number(q.per_page || 20),
    page: q.page ? Number(q.page) : 1,
    sparkline: q.sparkline === 'true' || q.sparkline === true
  }

  if (validPriceChangePercentages.has(parsedPriceChangePercentage as PriceChangePercentage)) {
    query.price_change_percentage = parsedPriceChangePercentage as PriceChangePercentage
  }

  if (validPrecisions.has(parsedPrecision as Precision)) {
    query.precision = parsedPrecision as Precision
  }

  return await getTopCoins(query)
})
