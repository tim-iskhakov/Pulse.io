import { getQuery, getRouterParam } from 'h3'
import { throwUpstreamFetchError } from '../../../../utils/upstreamFetchError'

type CoinChartRangeResponse = {
  prices: [number, number][]
}

const getCoinChartRange = defineCachedFunction(
  async (id: string, vsCurrency: string, from: number, to: number) => {
    return await $fetch<CoinChartRangeResponse>(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range`,
      {
        query: {
          vs_currency: vsCurrency,
          from,
          to
        },
        retry: 2,
        retryDelay: 400,
        retryStatusCodes: [408, 409, 425, 500, 502, 503, 504],
        timeout: 10_000
      }
    )
  },
  {
    name: 'coinChartRange',
    maxAge: 900,
    getKey: (id: string, vsCurrency: string, from: number, to: number) =>
      `${id}:${vsCurrency}:${from}:${to}`
  }
)

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '').trim()
  const q = getQuery(event)
  const vsCurrency = String(q.vs_currency || 'usd')
  const from = Number(q.from)
  const to = Number(q.to)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin id is required'
    })
  }

  if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid range params: expected numeric from < to'
    })
  }

  try {
    return await getCoinChartRange(id, vsCurrency, from, to)
  } catch (error: unknown) {
    throwUpstreamFetchError(error, 'Failed to fetch coin chart range from CoinGecko')
  }
})
