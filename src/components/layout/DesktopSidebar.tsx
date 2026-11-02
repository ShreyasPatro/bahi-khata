import { ChevronsUpDown, LogOut, Plus, Settings, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { toast } from 'sonner'
import { BahiLogo } from '@/components/layout/BahiLogo'
import { mainNav, previewNav, type NavItem } from '@/components/layout/nav'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DesktopSidebarProps {
  onAdd: () => void
}

function SidebarLink({ item, muted }: { item: NavItem; muted?: boolean }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={item.label}
      aria-label={item.label}
      className={({ isActive }) =>
        cn(
          'group flex h-(--h-control-md) items-center justify-center gap-3 rounded-xl px-0 text-body font-medium outline-none transition-colors duration-(--duration-fast) focus-visible:ring-2 focus-visible:ring-ring lg:justify-start lg:px-3',
          isActive
            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          muted && 'h-9 text-body-sm font-normal',
        )
      }
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span className="hidden lg:inline">{item.label}</span>
    </NavLink>
  )
}

/** Icon rail from the tablet breakpoint, full sidebar from the laptop breakpoint. Hidden on phones. */
export function DesktopSidebar({ onAdd }: DesktopSidebarProps) {
  return (
    <aside
      aria-label="Sidebar"
      className="fixed inset-y-0 left-0 z-30 hidden w-[4.5rem] flex-col border-r bg-sidebar p-3 md:flex lg:w-(--w-sidebar) lg:p-4"
    >
      <div className="flex h-12 items-center justify-center lg:justify-start lg:px-1">
        <span className="lg:hidden">
          <BahiLogo withWordmark={false} />
        </span>
        <span className="hidden lg:inline-flex">
          <BahiLogo />
        </span>
      </div>

      <Button
        size="lg"
        className="mt-3 w-full px-0 lg:px-5"
        onClick={onAdd}
        aria-label="Add transaction"
      >
        <Plus aria-hidden="true" />
        <span className="hidden lg:inline">Add transaction</span>
      </Button>

      <nav aria-label="Primary" className="mt-5 flex flex-col gap-1">
        {mainNav.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <p className="mb-1 hidden px-3 text-caption font-medium tracking-wide text-muted-foreground uppercase lg:block">
          Design preview
        </p>
        <nav aria-label="Design preview" className="flex flex-col gap-0.5">
          {previewNav.map((item) => (
            <SidebarLink key={item.to} item={item} muted />
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mt-3 flex items-center justify-center gap-3 rounded-xl border bg-card p-2 text-left outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring lg:justify-start"
              aria-label="Account menu"
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary-soft text-body-sm font-semibold text-primary-dark">
                  AM
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 flex-1 lg:block">
                <span className="block truncate text-body-sm font-semibold">Aarav Mehta</span>
                <span className="block truncate text-caption text-muted-foreground">
                  aarav@example.com
                </span>
              </span>
              <ChevronsUpDown
                className="hidden size-4 text-muted-foreground lg:block"
                aria-hidden="true"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>Aarav Mehta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => toast.info('Profile is not part of the design preview')}
            >
              <UserRound aria-hidden="true" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => toast.info('Settings is not part of the design preview')}
            >
              <Settings aria-hidden="true" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => toast.success('Signed out (preview only)')}>
              <LogOut aria-hidden="true" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
