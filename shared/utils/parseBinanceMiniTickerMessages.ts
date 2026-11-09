import type { BinanceMiniTicker24hRow } from '../types/binanceMiniTicker'

function isMiniTickerRow(row: unknown): row is BinanceMiniTicker24hRow {
  if (!row || typeof row !== 'object') return false
  const r = row as Record<string, unknown>
  return r.e === '24hrMiniTicker' && typeof r.s === 'string' && typeof r.c === 'string'
}

/**
 * Parses Binance combined stream frames. Never throws: invalid or partial JSON
 * yields an empty list so the WebSocket handler stays resilient.
 */
export function parseBinanceMiniTickerMessages(raw: string): BinanceMiniTicker24hRow[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) {
    return []
  }

  return parsed.filter(isMiniTickerRow)
}
