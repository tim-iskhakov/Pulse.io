<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number | null
    percent?: boolean
    color?: boolean
    precision?: number
    currency?: string
    compact?: boolean
  }>(),
  {
    percent: false,
    color: false,
    precision: 2,
    currency: '$',
    compact: true
  }
)

const formattedValue = computed(() => {
  if (!props.value) {
    return null
  }

  const formatter = new Intl.NumberFormat('en-US', {
    notation: props.compact ? 'compact' : 'standard',
    compactDisplay: 'short',
    maximumFractionDigits: props.precision
  })

  if (props.percent) {
    return `${formatter.format(Math.abs(props.value))}%`
  } else if (props.currency) {
    return `${props.currency}${formatter.format(Math.abs(props.value))}`
  }

  return formatter.format(Math.abs(props.value))
})
</script>

<template>
  <span
    v-if="value"
    class="tabular-nums"
    :class="{
      'text-positive': color && Number(value.toFixed(2)) > 0,
      'text-negative': color && Number(value.toFixed(2)) < 0,
      'text-main': !color
    }"
  >
    {{ formattedValue }}
  </span>
</template>
