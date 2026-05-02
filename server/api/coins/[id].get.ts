import { getRouterParam } from 'h3'
import type { CoinDetailsResponse } from '#shared/types/coinDetails'
import { throwUpstreamFetchError } from '../../utils/upstreamFetchError'

const getCoinById = defineCachedFunction(
  async (id: string) => {
    return await $fetch<CoinDetailsResponse>(`https://api.coingecko.com/api/v3/coins/${id}`)
  },
  {
    name: 'coinById',
    maxAge: 30,
    getKey: (id: string) => id
  }
)

export default defineEventHandler(async (event) => {
  const id = String(getRouterParam(event, 'id') || '').trim()

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coin id is required'
    })
  }

  try {
    return await getCoinById(id)
  } catch (error: unknown) {
    throwUpstreamFetchError(error, 'Failed to fetch coin details from CoinGecko')
  }
})
