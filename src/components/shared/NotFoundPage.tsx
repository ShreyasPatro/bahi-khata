import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  return (
    <PageContainer>
      <PageHeader title="404 — Page not found" />
      <EmptyState
        icon={Compass}
        title="This page does not exist"
        description="The link may be broken or the page may have moved."
        action={
          <Link to="/" className={cn(buttonVariants({ size: 'lg' }))}>
            Back to home
          </Link>
        }
      />
    </PageContainer>
  )
}
