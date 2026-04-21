export const useBinanceWebsocket = () => {
  const { updateItems } = useCoinsStore()

  const { status, send, open, close } = useWebSocket<string>(
    `${BINANCE_SPOT_WS_URL}/${BINANCE_MINI_TICKER_ARR_STREAM}`,
    {
      autoReconnect: true,
      immediate: false,
      onMessage(_ws, event) {
        const formatedData = webSocketMapper(JSON.parse(event.data))
        updateItems(formatedData)
      }
    }
  )

  return { status, send, open, close }
}
