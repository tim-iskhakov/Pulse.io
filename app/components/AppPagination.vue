<script setup lang="ts">
const props = defineProps<{
  perPage: number
  totalElements: number
}>()

const page = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalElements / props.perPage)))

watch(totalPages, (tp) => {
  if (page.value > tp) {
    page.value = tp
  }
})

const setPage = (n: number) => {
  page.value = Math.min(Math.max(1, n), totalPages.value)
}

const next = () => setPage(page.value + 1)
const prev = () => setPage(page.value - 1)

provide('pagination', {
  page,
  perPage: props.perPage,
  totalElements: props.totalElements,
  totalPages
})
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-4">
    <div class="w-full min-w-0">
      <slot />
    </div>
    <div
      class="flex shrink-0 w-full min-w-0 flex-wrap items-center justify-center gap-3 border-t border-soft pt-4"
    >
      <slot name="summary" />
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-md border border-soft px-3 py-1.5 text-sm text-main transition-colors enabled:hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page <= 1"
          @click="prev"
        >
          Prev
        </button>
        <div class="flex items-center gap-1 text-sm text-muted">
          <span class="tabular-nums text-main">{{ page }}</span>
          <span>/</span>
          <span class="tabular-nums">{{ totalPages }}</span>
        </div>
        <button
          type="button"
          class="rounded-md border border-soft px-3 py-1.5 text-sm text-main transition-colors enabled:hover:bg-elevated disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="page >= totalPages"
          @click="next"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
