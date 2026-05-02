<script setup lang="ts">
import type { CoinDetailsResponse } from '#shared/types/coinDetails'
import type { UTCTimestamp } from 'lightweight-charts'
import { useCoinChart } from '~/composables/coin/useChart'

type CoinChartResponse = {
  prices: [number, number][]
}

const route = useRoute()
const coinId = computed<string>(() => String(route.params.id || ''))
const chartContainer = ref<HTMLDivElement | null>(null)
const chartPoints = ref<{ time: UTCTimestamp; value: number }[]>([])
const isLoadingMoreChart = ref(false)
const chartHistoryBackoffUntil = ref(0)

function getFetchErrorParts(e: unknown): { status?: number; retryAfterSeconds?: number } {
  if (typeof e !== 'object' || e === null) return {}
  const err = e as { statusCode?: number; status?: number; data?: { retryAfterSeconds?: number } }
  const status = err.statusCode ?? err.status
  return {
    ...(status !== undefined ? { status } : {}),
    ...(err.data?.retryAfterSeconds !== undefined
      ? { retryAfterSeconds: err.data.retryAfterSeconds }
      : {})
  }
}

watch(coinId, () => {
  chartHistoryBackoffUntil.value = 0
})

const { data: coin } = await useAsyncData<CoinDetailsResponse | null>(
  () => `coin:${coinId.value}`,
  async () => {
    if (!coinId.value) {
      return null
    }

    return await $fetch<CoinDetailsResponse>(`/api/coins/${coinId.value}`)
  },
  {
    watch: [coinId]
  }
)

const { data: chart } = await useAsyncData<CoinChartResponse | null>(
  () => `coin-chart:${coinId.value}`,
  async () => {
    if (!coinId.value) {
      return null
    }

    return await $fetch<CoinChartResponse>(`/api/coins/${coinId.value}/chart`, {
      query: {
        vs_currency: 'usd',
        days: '7'
      }
    })
  },
  {
    watch: [coinId]
  }
)

watch(
  chart,
  (newChart) => {
    chartPoints.value =
      newChart?.prices.map(([timestampMs, value]) => ({
        time: Math.floor(timestampMs / 1000) as UTCTimestamp,
        value
      })) || []
  },
  { immediate: true }
)

const isPositive = computed(() => {
  return (coin.value?.market_data?.price_change_percentage_7d || 0) >= 0
})

const formatCurrency = (value?: number | null) => {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 1 ? 2 : 6
  }).format(value)
}

const formatPercent = (value?: number | null) => {
  if (value === null || value === undefined) return '—'
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

useCoinChart({
  container: chartContainer,
  seriesKey: coinId,
  points: chartPoints,
  isPositive,
  async onNeedMoreLeft(oldestLoadedTime) {
    if (!coinId.value || isLoadingMoreChart.value) return
    if (Date.now() < chartHistoryBackoffUntil.value) return
    isLoadingMoreChart.value = true

    try {
      const to = Math.floor(Number(oldestLoadedTime))
      const from = Math.max(to - 70 * 24 * 60 * 60, 0)

      const range = await $fetch<CoinChartResponse>(`/api/coins/${coinId.value}/chart/range`, {
        query: {
          vs_currency: 'usd',
          from,
          to
        }
      })

      const nextPoints =
        range.prices?.map(([timestampMs, value]) => ({
          time: Math.floor(timestampMs / 1000) as UTCTimestamp,
          value
        })) ?? []

      if (!nextPoints.length) return

      const merged = [...nextPoints, ...chartPoints.value]
      const uniqueByTime = new Map<number, { time: UTCTimestamp; value: number }>()
      for (const point of merged) {
        uniqueByTime.set(Number(point.time), point)
      }

      chartPoints.value = Array.from(uniqueByTime.values()).sort(
        (a, b) => Number(a.time) - Number(b.time)
      )
    } catch (err) {
      const { status, retryAfterSeconds } = getFetchErrorParts(err)
      if (status === 429) {
        const pauseSec = retryAfterSeconds ?? 60
        chartHistoryBackoffUntil.value = Date.now() + pauseSec * 1000
      }
      console.error('Failed to load chart history range', err)
      throw err
    } finally {
      isLoadingMoreChart.value = false
    }
  }
})
</script>

<template>
  <div class="px-3 py-4 md:px-6">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <NuxtLink to="/" class="text-sm text-muted">← Back</NuxtLink>
      <div class="flex w-full min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div class="w-full min-w-0 flex-1 rounded-xl border border-soft bg-base p-4">
          <div class="mb-4 flex items-center gap-3">
            <NuxtImg
              v-if="coin?.image?.small"
              :src="coin.image.small"
              :alt="coin.name"
              width="28"
              height="28"
              class="rounded-full"
            />
            <div class="text-lg font-semibold text-main">
              {{ coin?.name }}
              <span class="text-sm text-muted">{{ coin?.symbol?.toUpperCase() }}</span>
            </div>
          </div>

          <div ref="chartContainer" class="h-[280px] w-full min-w-0 sm:h-[320px] lg:h-[360px]" />
        </div>

        <div
          class="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:max-w-md lg:flex-none lg:grid-cols-1 xl:max-w-lg xl:grid-cols-2"
        >
          <div class="rounded-lg border border-soft bg-base p-4">
            <div class="text-xs text-muted">Price</div>
            <div class="mt-1 text-base font-semibold text-main">
              {{ formatCurrency(coin?.market_data?.current_price?.usd) }}
            </div>
          </div>

          <div class="rounded-lg border border-soft bg-base p-4">
            <div class="text-xs text-muted">24h Change</div>
            <div class="mt-1 text-base font-semibold text-main">
              {{ formatPercent(coin?.market_data?.price_change_percentage_24h) }}
            </div>
          </div>

          <div class="rounded-lg border border-soft bg-base p-4">
            <div class="text-xs text-muted">Market Cap</div>
            <div class="mt-1 text-base font-semibold text-main">
              {{ formatCurrency(coin?.market_data?.market_cap?.usd) }}
            </div>
          </div>

          <div class="rounded-lg border border-soft bg-base p-4">
            <div class="text-xs text-muted">24h Volume</div>
            <div class="mt-1 text-base font-semibold text-main">
              {{ formatCurrency(coin?.market_data?.total_volume?.usd) }}
            </div>
          </div>

          <div class="rounded-lg border border-soft bg-base p-4">
            <div class="text-xs text-muted">24h High</div>
            <div class="mt-1 text-base font-semibold text-main">
              {{ formatCurrency(coin?.market_data?.high_24h?.usd) }}
            </div>
          </div>

          <div class="rounded-lg border border-soft bg-base p-4">
            <div class="text-xs text-muted">24h Low</div>
            <div class="mt-1 text-base font-semibold text-main">
              {{ formatCurrency(coin?.market_data?.low_24h?.usd) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
