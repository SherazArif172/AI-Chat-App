'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/?error=auth_error')
          return
        }

        if (data.session) {
          router.push('/')
        } else {
          router.push('/?error=no_session')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/?error=callback_error')
      }
    }

    const handleUrlFragment = () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        
        if (params.get('access_token')) {
          handleAuthCallback()
        }
      } else {
        handleAuthCallback()
      }
    }

    handleUrlFragment()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Confirming your email...</p>
      </div>
    </div>
  )
}
