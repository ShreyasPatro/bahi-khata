import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { PlaceholderPage } from '@/components/shared/PlaceholderPage'

export function NotFoundPage() {
  return (
    <PlaceholderPage title="404 — Page not found" description="That page does not exist.">
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </PlaceholderPage>
  )
}
