<script setup lang="ts">
const coinsStore = useCoinsStore()
const { open, close } = useBinanceWebsocket()

await useGetCoins()

const headers = [
  'Coin',
  'Price',
  'Price Change 24h',
  'Market Cap',
  'MC Change 24h',
  'Volume 24h',
  'Last 7d'
]

onMounted(async () => {
  open()
})

onBeforeUnmount(() => {
  close()
})
</script>

<template>
  <div class="px-3 md:px-6">
    <div class="max-h-[calc(100vh-10rem)] overflow-auto rounded-lg">
      <div class="grid min-w-full grid-cols-[190px_repeat(5,200px)_2fr] whitespace-nowrap">
        <div class="sticky top-0 z-20 col-span-full grid grid-cols-subgrid border-b border-soft">
          <div
            v-for="(header, index) in headers"
            :key="header"
            class="px-4 bg-base py-3 text-left text-sm font-medium text-muted"
            :class="index === 0 ? 'sticky left-0 z-30' : ''"
          >
            {{ header }}
          </div>
        </div>

        <NuxtLink
          v-for="coin in coinsStore.items"
          :key="coin.id"
          :to="`/coins/${coin.id}`"
          class="row col-span-full grid grid-cols-subgrid border-b border-soft transition-colors"
        >
          <CoinsListItem
            :id="coin.id"
            :name="coin.name"
            :symbol="coin.symbol"
            :image="coin.image"
            :current-price="coin.currentPrice"
            :market-cap="coin.marketCap"
            :market-cap-change24h="coin.marketCapChange24h"
            :total-volume="coin.totalVolume"
            :price-change24h="coin.priceChange24h"
            :price-change-percentage7d="coin.priceChangePercentage7dInCurrency"
            :sparkline-in7d="coin.sparklineIn7d"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  &:hover {
    & > * {
      @apply bg-elevated;
    }
  }
}
</style>
