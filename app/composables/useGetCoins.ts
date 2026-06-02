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

  // Nuxt seeds a new fetch key with the previous key's data while the next request runs.
  watch(page, () => {
    coinsStore.setItems([])
  })

  watch(
    [data, status],
    ([newData, s]) => {
      if (s === 'success' && Array.isArray(newData)) {
        coinsStore.setItems(newData)
      }
    },
    { immediate: true }
  )

  return { data, status, pending, error, refresh, clear }
}
