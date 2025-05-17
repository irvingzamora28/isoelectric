import React from 'react'
import { useContactSubmission } from '@/lib/useContactSubmission'
import { ContactSection } from './allset/landing-content/types'

interface Main2ContactSectionProps {
  contact: ContactSection
}

const Main2ContactSection = ({ contact }: Main2ContactSectionProps) => {
  const {
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
  } = useContactSubmission(contact.fields)

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center bg-slate-900 py-24"
      style={containerHeight ? { minHeight: containerHeight } : {}}
    >
      <h2 className="mb-6 text-center text-4xl font-bold text-white">{contact.title}</h2>
      <p className="mb-10 text-center text-lg text-slate-300">{contact.description}</p>
      <div
        className="w-full max-w-xl rounded-2xl bg-slate-800/90 p-8 shadow-xl"
        style={{ position: 'relative', minHeight: containerHeight }}
      >
        <form
          ref={formRef}
          className={`w-full space-y-6 transition-opacity duration-300 ${status === 'success' ? 'pointer-events-none absolute opacity-0' : 'relative opacity-100'}`}
          onSubmit={handleSubmit}
        >
          {contact.fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label htmlFor={field.name} className="font-semibold text-slate-200">
                {field.label}
                {field.required && <span className="text-primary-400 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={field.required}
                  rows={5}
                  className="focus:border-primary-500 focus:ring-primary-300 focus:ring-opacity-50 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 transition focus:ring"
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={field.required}
                  className="focus:border-primary-500 focus:ring-primary-300 focus:ring-opacity-50 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 transition focus:ring"
                />
              )}
              {touched[field.name] && !form[field.name]?.trim() && field.required && (
                <span className="text-sm text-red-400">This field is required.</span>
              )}
            </div>
          ))}
          {status === 'error' && (
            <div className="text-center font-medium text-red-400">{message}</div>
          )}
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 mt-2 w-full rounded-lg py-3 font-semibold text-white shadow-md transition disabled:opacity-60"
            disabled={status === 'loading' || !validate()}
          >
            {status === 'loading' ? 'Sending...' : contact.submitLabel}
          </button>
        </form>
        <div
          className={`absolute top-0 left-0 w-full text-center transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          style={{ minHeight: containerHeight }}
        >
          <p className="text-primary-400 mt-8 text-2xl font-semibold">
            {message || contact.successMessage}
          </p>
        </div>
      </div>
    </section>
  )
}

export default Main2ContactSection
