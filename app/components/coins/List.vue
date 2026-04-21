<script setup lang="ts">
const coinsStore = useCoinsStore()
const { open, close } = useBinanceWebsocket()

await coinsStore.fetchCoins()

onMounted(async () => {
  open()
})

onBeforeUnmount(() => {
  close()
})
</script>

<template>
  <div>
    <AppScrollTable :columns="5">
      <template #header>
        <div class="bg-white">Coin</div>
        <div>Price</div>
        <div>Market Cap</div>
        <div>Volume 24h</div>
        <div class="sr-only">Price change 7d</div>
      </template>
      <div v-for="coin in coinsStore.items" :key="coin.id" role="row">
        <CoinsItem v-bind="coin" />
      </div>
    </AppScrollTable>
  </div>
</template>
