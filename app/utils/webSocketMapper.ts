export const webSocketMapper = (
  messages: BinanceMiniTicker24hRow[]
): { symbol: string; price: string }[] => {
  return messages
    .filter((message) => message.s.endsWith('USDT'))
    .map((message) => ({
      symbol: message.s.replace('USDT', '').toLowerCase(),
      price: message.c
    }))
}
