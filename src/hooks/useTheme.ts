import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'night' | 'day'

const STORAGE_KEY = 'mf-theme'
const EVENT = 'mf-theme-change'

const read = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'day' ? 'day' : 'night'

const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback)
  return () => window.removeEventListener(EVENT, callback)
}

let switchTimer: number | undefined

export function setTheme(theme: Theme) {
  const root = document.documentElement
  if (read() === theme) return
  // Transição de cores curta, aplicada só durante a troca (sem flash).
  root.classList.add('theme-switching')
  window.clearTimeout(switchTimer)
  root.setAttribute('data-theme', theme)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'day' ? '#F4F8FC' : '#07182F')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* modo privado: tema vale só para a sessão */
  }
  switchTimer = window.setTimeout(() => root.classList.remove('theme-switching'), 320)
  window.dispatchEvent(new Event(EVENT))
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'night' as Theme)
  const toggle = useCallback(() => setTheme(read() === 'day' ? 'night' : 'day'), [])
  return { theme, toggle }
}
