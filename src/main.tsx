import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { ConfigErrorScreen } from '@/app/ConfigErrorScreen'
import { envIssues } from '@/lib/env'

const root = createRoot(document.getElementById('root')!)

if (envIssues.length > 0) {
  // Stop before anything imports the Supabase client, which would throw on bad config.
  root.render(
    <StrictMode>
      <ConfigErrorScreen issues={envIssues} />
    </StrictMode>,
  )
} else {
  void import('@/app/App').then(({ App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
