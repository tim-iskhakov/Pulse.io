export const useCoinsStore = defineStore('coins', () => {
  const items = ref<CoinMarket[]>([])

  const setItems = (newItems: CoinMarket[]) => {
    items.value = newItems
  }

  const updateItems = (updatedItems: { symbol: string; price: string }[]) => {
    for (const updatedItem of updatedItems) {
      const item = items.value.find((i) => i.symbol === updatedItem.symbol)
      if (!item) continue

      if (updatedItem.price) {
        item.currentPrice = Number(updatedItem.price)
      }
    }
  }

  return { items, setItems, updateItems }
})
