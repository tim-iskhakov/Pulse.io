/**
 * True when the coin route changed while a chart /range request was in flight.
 * Applying those points would mix series from different coins or wrong time windows.
 */
export function isChartHistoryResponseStale(requestCoinId: string, currentCoinId: string): boolean {
  return requestCoinId !== currentCoinId
}
