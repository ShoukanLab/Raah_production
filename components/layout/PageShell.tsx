'use client'

import { Nav } from './Nav'
import { BottomNav } from './BottomNav'

interface PageShellProps {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-void flex flex-col">
      <Nav />

      <main className="flex-1 overflow-y-auto pb-32">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
