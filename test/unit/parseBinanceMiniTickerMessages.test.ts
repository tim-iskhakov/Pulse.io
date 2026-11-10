import { describe, expect, it } from 'vitest'
import { parseBinanceMiniTickerMessages } from '#shared/utils/parseBinanceMiniTickerMessages'

function row(overrides: Partial<{ s: string; c: string }> = {}) {
  return {
    e: '24hrMiniTicker',
    E: 1,
    s: 'BTCUSDT',
    c: '1',
    o: '1',
    h: '1',
    l: '1',
    v: '1',
    q: '1',
    ...overrides
  }
}

describe('parseBinanceMiniTickerMessages', () => {
  it('returns empty array on invalid JSON', () => {
    expect(parseBinanceMiniTickerMessages('not json')).toEqual([])
  })

  it('returns empty array when root is not an array', () => {
    expect(parseBinanceMiniTickerMessages(JSON.stringify(row()))).toEqual([])
  })

  it('filters to 24hr mini ticker rows with symbol and price', () => {
    const payload = [row(), { e: 'other', s: 'X', c: '1' }, row({ s: 'ETHUSDT', c: '2' })]
    const out = parseBinanceMiniTickerMessages(JSON.stringify(payload))
    expect(out).toHaveLength(2)
    expect(out[0]?.s).toBe('BTCUSDT')
    expect(out[1]?.s).toBe('ETHUSDT')
  })
})
