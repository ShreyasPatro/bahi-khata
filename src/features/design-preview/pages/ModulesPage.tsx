import { BookOpen, Check, PieChart, Repeat, TrendingUp, Users, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { BahiLogo } from '@/components/layout/BahiLogo'
import { PrimaryButton } from '@/components/shared/PrimaryButton'
import { cn } from '@/lib/utils'

interface ModuleOption {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

const modules: ModuleOption[] = [
  {
    id: 'khata',
    title: 'Khata',
    description: 'Track money lent, borrowed and kept on credit.',
    icon: BookOpen,
  },
  {
    id: 'split',
    title: 'Split',
    description: 'Share expenses with friends, flatmates and trips.',
    icon: Users,
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'See mutual funds, stocks, gold and deposits together.',
    icon: TrendingUp,
  },
  {
    id: 'recurring',
    title: 'Recurring',
    description: 'Never miss a bill, SIP or subscription.',
    icon: Repeat,
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Clear monthly reports on spending and savings.',
    icon: PieChart,
  },
]

export function ModulesPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<string[]>(['khata', 'split'])
  const [loading, setLoading] = useState(false)

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))

  const onContinue = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setLoading(false)
    toast.success(`${selected.length} ${selected.length === 1 ? 'module' : 'modules'} selected`, {
      description: 'Design preview — nothing was saved.',
    })
    navigate('/')
  }

  return (
    <div className="pt-safe px-safe flex min-h-dvh flex-col bg-background">
      <aside
        aria-label="Design preview notice"
        className="bg-primary-soft px-4 py-1.5 text-center text-caption font-medium text-primary-dark"
      >
        Design preview · all data on screen is fictional
      </aside>
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-(--page-gutter) py-4">
        <BahiLogo />
        <Link
          to="/welcome"
          className="rounded-lg px-3 py-2 text-body font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back
        </Link>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-(--page-gutter) pb-32 md:pb-10">
        <p className="text-body-sm font-medium text-primary">Step 2 of 3</p>
        <h1 className="mt-1 text-headline font-bold tracking-tight md:text-display-sm">
          What would you like to manage?
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          Pick what matters now. You can turn modules on or off any time.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Modules">
          {modules.map((module) => {
            const isOn = selected.includes(module.id)
            const Icon = module.icon
            return (
              <li key={module.id}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isOn}
                  onClick={() => toggle(module.id)}
                  className={cn(
                    'flex min-h-28 w-full items-start gap-3 rounded-2xl border bg-card p-4 text-left shadow-card outline-none transition-all duration-(--duration-base) ease-soft focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]',
                    isOn
                      ? 'border-primary bg-primary-soft/50 ring-1 ring-primary'
                      : 'hover:shadow-raised',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-xl',
                      isOn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary-soft text-primary-dark',
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-title-sm font-semibold">{module.title}</span>
                    <span className="mt-0.5 block text-body-sm text-muted-foreground">
                      {module.description}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full border',
                      isOn
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card',
                    )}
                  >
                    {isOn && <Check className="size-3.5" />}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </main>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-10 border-t bg-card/95 backdrop-blur md:static md:border-0 md:bg-transparent">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-(--page-gutter) py-3 md:pb-10">
          <p className="hidden text-body-sm text-muted-foreground sm:block" aria-live="polite">
            {selected.length} selected
          </p>
          <PrimaryButton
            className="w-full sm:w-auto sm:min-w-48"
            disabled={selected.length === 0}
            loading={loading}
            loadingText="Setting up…"
            onClick={onContinue}
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}
