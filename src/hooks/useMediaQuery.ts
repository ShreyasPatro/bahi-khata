import { useSyncExternalStore } from 'react'
import { mediaQueries } from '@/constants/design-tokens'

/** Subscribes to a CSS media query. Returns `false` where `matchMedia` is unavailable. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== 'function') return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => (typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false),
    () => false,
  )
}

/** True from the tablet breakpoint up — modals instead of bottom sheets. */
export function useIsDesktop(): boolean {
  return useMediaQuery(mediaQueries.md)
}
