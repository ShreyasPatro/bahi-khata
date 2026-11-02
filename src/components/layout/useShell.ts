import { useOutletContext } from 'react-router-dom'

export interface ShellContext {
  openQuickAdd: () => void
}

/** Access shell-level actions (e.g. opening quick entry) from any page rendered inside AppShell. */
export function useShell(): ShellContext {
  return useOutletContext<ShellContext>()
}
