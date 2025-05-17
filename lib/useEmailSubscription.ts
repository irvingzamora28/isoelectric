import { useState } from 'react'

export type SubscriptionStatus = 'idle' | 'loading' | 'success' | 'error'

export function useEmailSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>('idle')
  const [message, setMessage] = useState<string>('')

  async function subscribe(email: string) {
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing!')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Try again later.')
    }
  }

  return { subscribe, status, message, setMessage }
}
