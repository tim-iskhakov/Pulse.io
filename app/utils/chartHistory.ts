export type ChartPoint = {
  time: number
  value: number
}

export function mergeChartHistoryPoints(
  existing: ChartPoint[],
  incoming: ChartPoint[]
): ChartPoint[] {
  const uniqueByTime = new Map<number, ChartPoint>()

  for (const point of [...incoming, ...existing]) {
    uniqueByTime.set(point.time, point)
  }

  return Array.from(uniqueByTime.values()).sort((a, b) => a.time - b.time)
}

export function isStaleChartHistoryRequest(requestCoinId: string, currentCoinId: string): boolean {
  return requestCoinId !== currentCoinId
}
