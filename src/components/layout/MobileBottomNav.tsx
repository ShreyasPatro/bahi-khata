import { Ellipsis, Plus } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  bottomNavLeft,
  bottomNavRight,
  moreNav,
  previewNav,
  type NavItem,
} from '@/components/layout/nav'
import { BottomSheet } from '@/components/shared/BottomSheet'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  onAdd: () => void
}

const itemClass =
  'flex min-h-(--h-control-lg) flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-caption font-medium outline-none transition-colors duration-(--duration-fast) focus-visible:ring-2 focus-visible:ring-ring'

function TabLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(itemClass, isActive ? 'text-primary' : 'text-muted-foreground active:text-foreground')
      }
    >
      <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
      {item.label}
    </NavLink>
  )
}

/** Phone-only bottom navigation with a centre Add action and a "More" sheet. Safe-area aware. */
export function MobileBottomNav({ onAdd }: MobileBottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const { pathname } = useLocation()
  const moreActive = moreNav.some((item) => pathname.startsWith(item.to))

  return (
    <>
      <nav
        aria-label="Primary"
        className="pb-safe px-safe fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 shadow-nav backdrop-blur md:hidden"
      >
        <div className="mx-auto flex h-(--h-bottom-nav) max-w-md items-center px-2">
          {bottomNavLeft.map((item) => (
            <TabLink key={item.to} item={item} />
          ))}
          <div className="flex flex-1 justify-center">
            <button
              type="button"
              onClick={onAdd}
              aria-label="Add transaction"
              className="-mt-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-overlay outline-none ring-4 ring-background transition-transform duration-(--duration-fast) active:scale-95 focus-visible:ring-primary-soft"
            >
              <Plus className="size-7" aria-hidden="true" />
            </button>
          </div>
          {bottomNavRight.map((item) => (
            <TabLink key={item.to} item={item} />
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            aria-haspopup="dialog"
            className={cn(
              itemClass,
              moreActive ? 'text-primary' : 'text-muted-foreground active:text-foreground',
            )}
          >
            <Ellipsis className="size-6" strokeWidth={1.75} aria-hidden="true" />
            More
          </button>
        </div>
      </nav>

      <BottomSheet open={moreOpen} onOpenChange={setMoreOpen} title="More">
        <nav aria-label="More" className="grid gap-1 pb-2">
          {[...moreNav, ...previewNav].map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMoreOpen(false)}
                className="flex min-h-(--h-control-lg) items-center gap-3 rounded-xl px-3 text-body font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-soft text-primary-dark">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </BottomSheet>
    </>
  )
}
