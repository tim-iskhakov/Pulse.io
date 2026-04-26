export const useGetCoins = async () => {
  const coinsStore = useCoinsStore()

  const asyncData = await useFetch<CoinMarket[]>('/api/coins', {
    key: 'coins',
    immediate: true,
    query: {
      precision: '5',
      sparkline: true
    } as CoinsMarketsQuery,
    default: () => []
  })

  const { data, status, pending, error, refresh, clear } = asyncData

  coinsStore.setItems(data.value || [])

  watch(
    data,
    (newData) => {
      coinsStore.setItems(newData || [])
    },
    { immediate: true }
  )

  return { data, status, pending, error, refresh, clear }
}
