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

type DocWithVT = Document & { startViewTransition?: (cb: () => void) => unknown }

const apply = (theme: Theme) => {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'day' ? '#F4F8FC' : '#07182F')
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* modo privado: tema vale só para a sessão */
  }
  window.dispatchEvent(new Event(EVENT))
}

/**
 * Troca de tema. V2: crossfade de ~240 ms pela View Transitions API (feito pelo compositor), em vez
 * de transicionar cores em todos os elementos — o clique ficou ~3× mais rápido (INP) em CPU lenta.
 * Sem suporte ou com reduced-motion, a troca é instantânea (sem flash).
 */
export function setTheme(theme: Theme) {
  if (read() === theme) return
  const doc = document as DocWithVT
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (doc.startViewTransition && !reduced) doc.startViewTransition(() => apply(theme))
  else apply(theme)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => 'night' as Theme)
  const toggle = useCallback(() => setTheme(read() === 'day' ? 'night' : 'day'), [])
  return { theme, toggle }
}
