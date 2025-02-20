import React from 'react'
import { useAuth } from '@/hooks/useAuth'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-terminal-bg font-mono text-terminal-fg">
      <header className="border-b border-terminal-border p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl text-terminal-accent">task-tracker</h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-terminal-fg transition-colors hover:text-terminal-accent"
          >
            logout
          </button>
        </div>
      </header>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  )
}

export default Layout
