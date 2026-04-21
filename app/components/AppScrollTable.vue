<script setup lang="ts">
defineProps<{
  columns: number
}>()
</script>

<template>
  <div class="w-full min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch]">
    <div
      role="table"
      :style="{ '--scroll-table-cols': columns }"
      class="scroll-table-grid grid w-max min-w-full"
    >
      <div role="rowgroup" class="contents">
        <div role="row">
          <slot name="header" />
        </div>
      </div>
      <div role="rowgroup" class="contents">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.scroll-table-grid {
  grid-template-columns:
    minmax(max-content, 1.25fr)
    repeat(calc(var(--scroll-table-cols, 4) - 1), minmax(max-content, 1fr));
}

.scroll-table-grid :deep([role='row']) {
  @apply col-[1/-1] grid grid-cols-subgrid;
}

.scroll-table-grid :deep([role='row'] > :first-child) {
  @apply sticky left-0 z-10 bg-white;
}
</style>
