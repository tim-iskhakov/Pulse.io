import { coinsListForStoreFromFetch } from '#shared/utils/coinsListForStore'

export const useGetCoins = async (page: Ref<number>, perPage: number) => {
  const coinsStore = useCoinsStore()

  const asyncData = await useFetch<CoinMarket[] | null>('/api/coins', {
    key: computed(() => `coins:${page.value}:${perPage}`),
    immediate: true,
    query: computed(
      () =>
        ({
          precision: '5',
          sparkline: true,
          page: page.value,
          per_page: perPage
        }) as CoinsMarketsQuery
    ),
    default: () => null
  })

  const { data, status, pending, error, refresh, clear } = asyncData

  watch(
    data,
    (newData) => {
      // On fetch error, Nuxt resets `data` to `default()` (null). If we only wrote when
      // `data` was an array, the Pinia store would keep the previous page's rows while
      // pagination already shows the new page — wrong coins with no successful response.
      coinsStore.setItems(coinsListForStoreFromFetch(newData))
    },
    { immediate: true }
  )

  return { data, status, pending, error, refresh, clear }
}
