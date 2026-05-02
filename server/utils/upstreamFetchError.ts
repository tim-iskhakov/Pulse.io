import { createError } from 'h3'

function readRetryAfterSeconds(error: unknown): number | undefined {
  const e = error as { response?: { headers?: { get?: (name: string) => string | null } } }
  const raw = e.response?.headers?.get?.('retry-after')
  if (!raw) return undefined
  const sec = Number(raw)
  return Number.isFinite(sec) && sec > 0 ? sec : undefined
}

function messageFromUpstreamBody(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'error' in body) {
    const err = (body as { error: unknown }).error
    if (typeof err === 'string' && err.trim()) return err
  }
  return fallback
}

export function throwUpstreamFetchError(
  error: unknown,
  fallbackMessage = 'Upstream request failed'
): never {
  const e = error as {
    status?: number
    statusCode?: number
    statusText?: string
    statusMessage?: string
    message?: string
    data?: unknown
  }

  const statusCode = e.statusCode ?? e.status ?? 502
  const original = e.data

  const baseFallback = e.message || e.statusMessage || e.statusText || fallbackMessage
  const statusMessage = messageFromUpstreamBody(original, baseFallback)

  const retryAfterHeader = readRetryAfterSeconds(error)
  const retryAfterSeconds =
    statusCode === 429 ? Math.min(retryAfterHeader ?? 60, 300) : retryAfterHeader

  throw createError({
    statusCode,
    statusMessage,
    data: {
      original,
      upstreamStatus: statusCode,
      ...(retryAfterSeconds !== undefined ? { retryAfterSeconds } : {})
    }
  })
}
