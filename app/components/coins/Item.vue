<script setup lang="ts">
import { useSparklineChart } from '~/composables/coins/useChart'

const props = defineProps<{
  id: string
  name: string
  symbol: string
  image: string
  currentPrice: number
  marketCap: number
  totalVolume: number
  priceChangePercentage24h?: number
  priceChangePercentage7d?: number
  sparklineIn7d?: { price: number[] }
}>()

const chartContainer = ref<HTMLDivElement | null>(null)

useSparklineChart({
  container: chartContainer,
  prices: props.sparklineIn7d?.price,
  isPositive: (props.priceChangePercentage24h || 0) >= 0
})
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="rounded-full border border-grey/200 overflow-hidden">
      <NuxtImg :src="image" :alt="name" width="24" height="24" />
    </div>
    <div class="font-semibold self-center text-sm">
      {{ name }}
    </div>
    <div class="font-medium self-center text-grey/50 text-xs">
      {{ symbol.toUpperCase() }}
    </div>
  </div>
  <div>${{ currentPrice.toLocaleString() }}</div>
  <div>${{ marketCap.toLocaleString() }}</div>
  <div>${{ totalVolume.toLocaleString() }}</div>
  <div class="min-w-[7.5rem] p-0 align-middle">
    <div v-if="sparklineIn7d?.price?.length" ref="chartContainer" class="h-8" />
    <span v-else class="block text-center text-xs text-grey/40">—</span>
  </div>
</template>
