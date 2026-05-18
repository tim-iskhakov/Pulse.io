/** CoinGecko markets: per_page max 250; reject NaN/invalid so upstream never sees bad query params. */
export function normalizeMarketsPagination(
  perPageRaw: unknown,
  pageRaw: unknown
): { per_page: number; page: number } {
  const rawPerPage = Number(perPageRaw ?? 20)
  const per_page = Number.isFinite(rawPerPage)
    ? Math.min(250, Math.max(1, Math.floor(rawPerPage)))
    : 20

  const rawPage = pageRaw === undefined || pageRaw === '' ? 1 : Number(pageRaw)
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1

  return { per_page, page }
}
