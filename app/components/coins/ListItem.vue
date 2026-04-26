<script setup lang="ts">
import { useSparklineChart } from '~/composables/coins/useChart'
import { vHighlight } from '~/utils/highlight'

const props = defineProps<{
  id: string
  name: string
  symbol: string
  image: string
  currentPrice: number
  marketCap: number
  marketCapChange24h: number
  totalVolume: number
  priceChange24h: number
  priceChangePercentage7d?: number
  sparklineIn7d?: { price: number[] }
}>()

const chartContainer = ref<HTMLDivElement | null>(null)

useSparklineChart({
  container: chartContainer,
  prices: props.sparklineIn7d?.price,
  isPositive: (props.priceChangePercentage7d || 0) >= 0
})
</script>

<template>
  <div class="sticky left-0 z-10 px-4 py-3 text-left bg-base">
    <div class="group flex min-w-[16rem] items-center gap-3">
      <div class="overflow-hidden rounded-full border border-base bg-elevated">
        <NuxtImg :src="image" :alt="name" width="28" height="28" />
      </div>
      <div class="flex flex-col">
        <div class="text-sm font-semibold text-main transition-colors group-hover:text-primary">
          {{ name }}
        </div>
        <div class="text-subtle text-xs font-medium tracking-wide">
          {{ symbol.toUpperCase() }}
        </div>
      </div>
    </div>
  </div>
  <div class="px-4 py-3 flex items-center">
    <AppFormattedValue
      v-highlight="currentPrice"
      :value="currentPrice"
      :compact="false"
      :precision="4"
    />
  </div>
  <div class="px-4 py-3 flex items-center">
    <AppFormattedValue :value="priceChange24h" :precision="3" color />
  </div>
  <div class="px-4 py-3 flex items-center">
    <AppFormattedValue :value="marketCap" />
  </div>
  <div class="px-4 py-3 flex items-center">
    <AppFormattedValue :value="marketCapChange24h" :precision="2" color />
  </div>
  <div class="px-4 py-3 flex items-center">
    <AppFormattedValue :value="totalVolume" />
  </div>
  <div class="px-4 py-3 flex items-center">
    <div class="min-w-[8.5rem] w-full p-0">
      <div v-if="sparklineIn7d?.price?.length" ref="chartContainer" class="h-8" />
      <span v-else class="text-subtle block text-center text-xs">—</span>
    </div>
  </div>
</template>
