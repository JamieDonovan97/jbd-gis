// Registers jest-dom matchers (toBeInTheDocument, etc.) on Vitest's expect,
// and pulls in their type augmentation for the typecheck.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount React trees between tests so the DOM does not accumulate across them.
afterEach(() => {
  cleanup()
})
