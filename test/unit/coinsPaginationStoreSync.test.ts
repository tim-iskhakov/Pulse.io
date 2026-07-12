import { describe, expect, it } from 'vitest'
import { nextTick, ref, watch } from 'vue'

/**
 * Regression for Nuxt useFetch/useAsyncData behavior: when the fetch key changes,
 * the new entry is seeded with the previous key's data until the in-flight request
 * resolves. The coins store must not mirror that placeholder.
 */
describe('coins list store sync (pagination + Nuxt key carry-over)', () => {
  it('clears on page change and only applies list when status is success', async () => {
    const page = ref(1)
    const items: string[] = []
    const data = ref<string[] | null>(['coin-page-1'])
    const status = ref<'idle' | 'pending' | 'success' | 'error'>('success')

    watch(page, () => {
      items.length = 0
    })

    watch(
      () => [data.value, status.value] as const,
      ([newData, s]) => {
        if (s === 'success' && Array.isArray(newData)) {
          items.splice(0, items.length, ...newData)
        }
      },
      { immediate: true }
    )

    expect(items).toEqual(['coin-page-1'])

    page.value = 2
    data.value = ['coin-page-1']
    status.value = 'pending'
    await nextTick()

    expect(items).toEqual([])

    data.value = ['coin-page-2-a', 'coin-page-2-b']
    status.value = 'success'
    await nextTick()

    expect(items).toEqual(['coin-page-2-a', 'coin-page-2-b'])
  })
})
