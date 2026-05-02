<script setup lang="ts">
const PER_PAGE = 20
const TOTAL_ELEMENTS = 100
</script>

<template>
  <AppPagination :per-page="PER_PAGE" :total-elements="TOTAL_ELEMENTS">
    <CoinsList />
  </AppPagination>
</template>
