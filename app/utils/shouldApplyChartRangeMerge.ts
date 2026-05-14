/** True if an in-flight market_chart/range response should still be merged for the current chart session. */
export function shouldApplyChartRangeMerge(sessionAtStart: number, currentSession: number) {
  return sessionAtStart === currentSession
}
