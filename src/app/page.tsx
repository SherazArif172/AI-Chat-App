'use client'

import { useAuth } from '@/lib/auth-context'
import { AuthForm } from '@/components/auth-form'
import { ChatInterface } from '@/components/chat-interface'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <AuthForm />
      </div>
    )
  }

  return <ChatInterface />
}
