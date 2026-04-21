import {
  ColorType,
  CrosshairMode,
  LastPriceAnimationMode,
  LineSeries,
  createChart,
  type IChartApi,
  type UTCTimestamp
} from 'lightweight-charts'

type UseSparklineChartParams = {
  container: Ref<HTMLDivElement | null>
  prices?: number[]
  isPositive: boolean
}

function pricesToLineData(prices: number[]) {
  const stepSec = 3600
  const start = Math.floor(Date.now() / 1000) - prices.length * stepSec

  return prices.map((value, i) => ({
    time: (start + i * stepSec) as UTCTimestamp,
    value
  }))
}

export function useSparklineChart({ container, prices, isPositive }: UseSparklineChartParams) {
  let chart: IChartApi | null = null

  onMounted(() => {
    const el = container.value
    if (!el || !prices?.length) return

    chart = createChart(el, {
      autoSize: true,
      layout: {
        attributionLogo: false,
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: 'transparent'
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false }
      },
      rightPriceScale: { visible: false, borderVisible: false },
      leftPriceScale: { visible: false },
      timeScale: { visible: false, borderVisible: false },
      crosshair: { mode: CrosshairMode.Hidden },
      handleScroll: false,
      handleScale: false
    })

    const series = chart.addSeries(LineSeries, {
      color: isPositive ? '#00d743' : '#ff3b30',
      lineWidth: 2,
      crosshairMarkerVisible: false,
      pointMarkersVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
      lastPriceAnimation: LastPriceAnimationMode.Disabled
    })

    series.setData(pricesToLineData(prices))
    chart.timeScale().fitContent()
  })

  onUnmounted(() => {
    chart?.remove()
    chart = null
  })
}
