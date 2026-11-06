import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

const sharedAlias = { '#shared': `${rootDir}/shared` } as const

export default defineConfig({
  resolve: {
    alias: sharedAlias
  },
  test: {
    projects: [
      {
        resolve: {
          alias: sharedAlias
        },
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      {
        resolve: {
          alias: sharedAlias
        },
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node'
        }
      }
    ]
  }
})
