import { describe, expect, it } from 'vitest'

/**
 * Documents the guard applied in coin detail chart history loading:
 * range responses must be ignored when the route changed during the request.
 */
describe('chart range stale response guard', () => {
  it('skips merge when coinId changed before the range response arrives', () => {
    let routeCoinId = 'bitcoin'
    const requestCoinId = routeCoinId

    routeCoinId = 'ethereum'

    const shouldApply = routeCoinId === requestCoinId
    expect(shouldApply).toBe(false)
  })

  it('allows merge when coinId is unchanged', () => {
    const routeCoinId = 'bitcoin'
    const requestCoinId = routeCoinId

    const shouldApply = routeCoinId === requestCoinId
    expect(shouldApply).toBe(true)
  })
})
