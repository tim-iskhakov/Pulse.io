type HighlightElement = HTMLElement & {
  highlightTimeoutId?: ReturnType<typeof setTimeout>
  highlightCleanupTimeoutId?: ReturnType<typeof setTimeout>
}

const HIGHLIGHT_DURATION = 500
const HIGHLIGHT_COLOR_CLASSES = ['bg-positive/50', 'bg-negative/50']
const HIGHLIGHT_TRANSITION_CLASSES = ['transition-colors', `duration-[${HIGHLIGHT_DURATION}ms]`]

export const vHighlight = {
  updated: (el: HighlightElement, binding: { value: number; oldValue: number }) => {
    if (binding.value === binding.oldValue) return

    if (el.highlightTimeoutId) {
      clearTimeout(el.highlightTimeoutId)
      el.highlightTimeoutId = undefined
    }

    if (el.highlightCleanupTimeoutId) {
      clearTimeout(el.highlightCleanupTimeoutId)
      el.highlightCleanupTimeoutId = undefined
    }

    el.classList.remove(...HIGHLIGHT_COLOR_CLASSES, ...HIGHLIGHT_TRANSITION_CLASSES)

    const highlightClass = binding.value > binding.oldValue ? 'bg-positive/50' : 'bg-negative/50'
    el.classList.add(...HIGHLIGHT_TRANSITION_CLASSES, highlightClass)

    el.highlightTimeoutId = setTimeout(() => {
      el.classList.remove(...HIGHLIGHT_COLOR_CLASSES)
      el.highlightTimeoutId = undefined

      el.highlightCleanupTimeoutId = setTimeout(() => {
        el.classList.remove(...HIGHLIGHT_TRANSITION_CLASSES)
        el.highlightCleanupTimeoutId = undefined
      }, HIGHLIGHT_DURATION)
    }, 1000)
  }
}
