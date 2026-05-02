import { getQuery, getRouterParam } from 'h3'
import { throwUpstreamFetchError } from '../../../utils/upstreamFetchError'

type CoinChartResponse = {
  prices: [number, number][]
}

const getCoinChart = defineCachedFunction(
  async (id: string, vsCurrency: string, days: string) => {
    return await $fetch<CoinChartResponse>(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        query: {
          vs_currency: vsCurrency,
          days
        }
      }
    )
  },
  {
    name: 'coinChart',
    maxAge: 60,
    getKey: (id: string, vsCurrency: string, days: string) => `${id}:${vsCurrency}:${days}`
  }
)

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '').trim()
  const q = getQuery(event)
  const vsCurrency = String(q.vs_currency || 'usd')
  const days = String(q.days || '7')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin id is required'
    })
  }

  try {
    return await getCoinChart(id, vsCurrency, days)
  } catch (error: unknown) {
    throwUpstreamFetchError(error, 'Failed to fetch coin chart from CoinGecko')
  }
})
