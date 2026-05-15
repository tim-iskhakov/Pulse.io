/**
 * After an async chart-range fetch, only merge if the user is still viewing the
 * same coin. Otherwise earlier candles from the previous coin would be mixed
 * into the new coin's series.
 */
export function shouldMergeChartRangeAfterFetch(
  requestedCoinId: string,
  activeCoinId: string
): boolean {
  return requestedCoinId === activeCoinId
}
