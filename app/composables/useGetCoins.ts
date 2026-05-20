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

  // Nuxt seeds a new `useFetch` key with the previous key's data while the next
  // request is in flight, so syncing the store from `data` alone can briefly
  // show the wrong page after pagination. Clear on pending; apply on success.
  watch(
    [data, status],
    ([newData, fetchStatus]) => {
      if (fetchStatus === 'pending') {
        coinsStore.setItems([])
        return
      }
      if (fetchStatus === 'success') {
        coinsStore.setItems(Array.isArray(newData) ? newData : [])
        return
      }
      if (fetchStatus === 'error') {
        coinsStore.setItems([])
      }
    },
    { immediate: true }
  )

  return { data, status, pending, error, refresh, clear }
}
