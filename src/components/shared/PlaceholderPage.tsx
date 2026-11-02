import type { ReactNode } from 'react'

interface PlaceholderPageProps {
  title: string
  description: string
  children?: ReactNode
}

export function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <section className="space-y-3">
      <h1 className="text-headline font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {children}
    </section>
  )
}
