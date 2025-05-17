import { useState, useRef, useEffect, useCallback } from 'react'

export type ContactStatus = 'idle' | 'loading' | 'success' | 'error'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export function useContactSubmission(fields: Array<{ name: string; required?: boolean }>) {
  const [form, setForm] = useState<ContactFormData>(() => ({ name: '', email: '', message: '' }))
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<ContactStatus>('idle')
  const [message, setMessage] = useState<string>('')
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (formRef.current && !containerHeight) {
      setContainerHeight(formRef.current.offsetHeight)
    }
  }, [formRef, containerHeight])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
      setMessage('')
    },
    []
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched((prev) => ({ ...prev, [event.target.name]: true }))
    },
    []
  )

  const validate = useCallback(() => {
    return fields.every((f) => !f.required || form[f.name]?.trim())
  }, [fields, form])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setTouched(Object.fromEntries(fields.map((f) => [f.name, true])))
      if (!validate()) return
      setStatus('loading')
      setMessage('')
      try {
        const res = await fetch('/api/allset/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        const data = await res.json()
        if (res.ok) {
          setStatus('success')
          setMessage('Thank you for reaching out!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Something went wrong.')
        }
      } catch {
        setStatus('error')
        setMessage('Network error. Try again later.')
      }
    },
    [fields, form, validate]
  )

  return {
    form,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    status,
    message,
    formRef,
    containerHeight,
  }
}
