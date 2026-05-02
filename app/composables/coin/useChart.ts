import {
  ColorType,
  CrosshairMode,
  LineStyle,
  LineSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type LogicalRange,
  type Time,
  type UTCTimestamp
} from 'lightweight-charts'

type CoinChartDataPoint = {
  time: UTCTimestamp
  value: number
}

type UseCoinChartParams = {
  container: Ref<HTMLDivElement | null>
  seriesKey: MaybeRef<string>
  prices?: MaybeRef<number[] | undefined>
  points?: MaybeRef<CoinChartDataPoint[] | undefined>
  isPositive?: MaybeRef<boolean | undefined>
  onNeedMoreLeft?: (oldestLoadedTime: UTCTimestamp) => void | Promise<void>
}

function pricesToLineData(prices: number[]): LineData<Time>[] {
  const stepSec = 3600
  const start = Math.floor(Date.now() / 1000) - prices.length * stepSec

  return prices.map((value, i) => ({
    time: (start + i * stepSec) as UTCTimestamp,
    value
  }))
}

function normalizeData(params: UseCoinChartParams): LineData<Time>[] {
  const points = unref(params.points)
  const prices = unref(params.prices)

  if (points?.length) {
    return points
  }

  if (prices?.length) {
    return pricesToLineData(prices)
  }

  return []
}

export function useCoinChart(params: UseCoinChartParams) {
  let chart: IChartApi | null = null
  let series: ISeriesApi<'Line'> | null = null
  let resizeObserver: ResizeObserver | null = null
  let rafId: number | null = null
  let lastRequestedOldest: UTCTimestamp | null = null
  let mountedSeriesKey: string | null = null

  const applyInitialViewport = (bars: number) => {
    if (!chart) return
    if (bars === 0) return

    const minVisible = 24
    const maxVisible = 220
    const target = Math.min(maxVisible, Math.max(minVisible, Math.floor(bars * 0.5)))

    if (bars > target) {
      chart.timeScale().setVisibleLogicalRange({
        from: bars - target,
        to: bars - 1
      })
      return
    }

    chart.timeScale().fitContent()
  }

  const onVisibleLogicalRangeChange = (range: LogicalRange | null) => {
    if (!range) return
    if (!params.onNeedMoreLeft) return

    const points = unref(params.points)
    if (!points?.length) return

    const n = points.length
    const nearOldestLoaded = range.from <= Math.min(8, n * 0.03)

    if (!nearOldestLoaded) return

    const oldestTime = points[0]?.time
    if (!oldestTime) return
    if (lastRequestedOldest === oldestTime) return

    lastRequestedOldest = oldestTime
    Promise.resolve(params.onNeedMoreLeft(oldestTime)).catch(() => {
      if (lastRequestedOldest === oldestTime) {
        lastRequestedOldest = null
      }
    })
  }

  const scheduleResize = () => {
    if (!chart || !params.container.value) return
    if (rafId) cancelAnimationFrame(rafId)

    rafId = requestAnimationFrame(() => {
      if (!chart || !params.container.value) return
      const { width, height } = params.container.value.getBoundingClientRect()
      chart.resize(width, Math.max(height, 320))
    })
  }

  const setSeriesData = () => {
    if (!series) return
    const data = normalizeData(params)
    series.setData(data)
  }

  const destroyChart = () => {
    if (chart) {
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange)
    }
    resizeObserver?.disconnect()
    resizeObserver = null
    series = null
    chart?.remove()
    chart = null
    mountedSeriesKey = null
    lastRequestedOldest = null
  }

  const mountChart = () => {
    const el = params.container.value
    const data = normalizeData(params)
    if (!el || !data.length || chart) return

    chart = createChart(el, {
      autoSize: true,
      layout: {
        attributionLogo: false,
        background: { type: ColorType.Solid, color: '#0b0f1a' },
        textColor: '#9ca3af',
        fontSize: 12
      },
      grid: {
        vertLines: { visible: true, color: 'rgba(255,255,255,0.06)', style: LineStyle.Dotted },
        horzLines: { visible: true, color: 'rgba(255,255,255,0.06)', style: LineStyle.Dotted }
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.1 }
      },
      leftPriceScale: { visible: false },
      timeScale: {
        visible: true,
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false
      },
      crosshair: { mode: CrosshairMode.Normal },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
        axisDoubleClickReset: true
      }
    })

    series = chart.addSeries(LineSeries, {
      color: unref(params.isPositive) ? '#22c55e' : '#ef4444',
      lineWidth: 3,
      crosshairMarkerVisible: true,
      pointMarkersVisible: false,
      priceLineVisible: true,
      lastValueVisible: true
    })

    series.setData(data)
    applyInitialViewport(data.length)

    chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChange)

    resizeObserver = new ResizeObserver(scheduleResize)
    resizeObserver.observe(el)

    mountedSeriesKey = String(unref(params.seriesKey))
  }

  const syncChart = () => {
    const el = params.container.value
    const data = normalizeData(params)
    const key = String(unref(params.seriesKey))

    if (!el || !data.length) {
      destroyChart()
      return
    }

    const keyChanged = mountedSeriesKey !== null && mountedSeriesKey !== key

    if (keyChanged) {
      destroyChart()
    }

    if (!chart) {
      mountChart()
      return
    }

    const oldestTime = unref(params.points)?.[0]?.time ?? null
    if (oldestTime !== lastRequestedOldest) {
      lastRequestedOldest = null
    }

    series?.applyOptions({
      color: unref(params.isPositive) ? '#22c55e' : '#ef4444'
    })
    setSeriesData()
  }

  watch(
    () =>
      [
        String(unref(params.seriesKey)),
        unref(params.prices),
        unref(params.points),
        unref(params.isPositive)
      ] as const,
    () => {
      syncChart()
    },
    { deep: true, flush: 'post' }
  )

  onMounted(() => syncChart())

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
    destroyChart()
  })
}
