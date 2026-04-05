import { afterEach, vi } from 'vitest'

afterEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
  sessionStorage.clear()
  vi.restoreAllMocks()
})
