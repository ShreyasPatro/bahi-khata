import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BalanceCard } from '@/components/financial/BalanceCard'
import { TransactionRow } from '@/components/financial/TransactionRow'
import { BahiLogo } from '@/components/layout/BahiLogo'
import { Surface } from '@/components/shared/Surface'
import { buttonVariants } from '@/components/ui/button'
import { BRAND } from '@/constants/design-tokens'
import { cn } from '@/lib/utils'

export function WelcomePage() {
  return (
    <div className="pt-safe pb-safe px-safe flex min-h-dvh flex-col bg-background">
      <aside
        aria-label="Design preview notice"
        className="bg-primary-soft px-4 py-1.5 text-center text-caption font-medium text-primary-dark"
      >
        Design preview · all data on screen is fictional
      </aside>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-(--page-gutter) py-4">
        <BahiLogo />
        <Link
          to="/login"
          className="rounded-lg px-3 py-2 text-body font-medium text-primary outline-none hover:bg-primary-soft focus-visible:ring-2 focus-visible:ring-ring"
        >
          Log in
        </Link>
      </header>

      <main
        id="main"
        className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-(--page-gutter) py-6 lg:grid-cols-2 lg:gap-16"
      >
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-caption font-medium text-success-ink">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Private by design
          </p>
          <h1 className="mt-4 text-display-sm font-bold tracking-tight text-balance md:text-5xl md:leading-[1.1]">
            {BRAND.tagline}
          </h1>
          <p className="mt-4 max-w-md text-body text-muted-foreground md:text-title-sm">
            Track what you spend, split with friends, keep your khata and watch investments grow —
            calmly, in one place.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/modules" className={cn(buttonVariants({ size: 'lg' }), 'sm:min-w-44')}>
              Get started
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'sm:min-w-44')}
            >
              Explore the preview
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto w-full max-w-sm space-y-3 lg:max-w-md">
          <BalanceCard
            label="Total balance"
            amount={363190.4}
            change={{ amount: 24300, period: 'this month' }}
          />
          <Surface padding="none" className="divide-y overflow-hidden">
            <TransactionRow
              category="food"
              title="Swiggy — dinner"
              subtitle="ICICI •• 1190 · 8:42 pm"
              amount={-684}
            />
            <TransactionRow
              category="salary"
              title="Freelance invoice"
              subtitle="HDFC •• 4821 · 4:30 pm"
              amount={35000}
            />
          </Surface>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-(--page-gutter) py-6 text-center text-body-sm text-muted-foreground lg:text-left">
        © Bahi · Design preview
      </footer>
    </div>
  )
}
