'use client'

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Image from 'next/image'
import landingDemoImage from '../public/static/images/landing-demo.jpeg'
import dataLandingContent from '@/data/landingContent.json'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { HiCheckCircle } from 'react-icons/hi2'
import { iconMap, getIconComponent } from '@/lib/utils/iconMap'
import { useEmailSubscription } from '@/lib/useEmailSubscription'
import { useState, useRef, useEffect } from 'react'
import { LandingContent } from './allset/landing-content/types'

const landingContent = dataLandingContent as LandingContent

import { ContactFormData, useContactSubmission } from '@/lib/useContactSubmission'

const ContactSection = ({ contact }) => {
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
    <div
      className="relative flex flex-col items-center justify-center py-16"
      style={containerHeight ? { minHeight: containerHeight } : {}}
    >
      <h2 className="mb-4 text-center text-3xl font-bold">{contact.title}</h2>
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        {contact.description}
      </p>
      <div
        style={{ position: 'relative', width: '100%', maxWidth: 560, minHeight: containerHeight }}
      >
        <form
          ref={formRef}
          className={`mx-auto w-full space-y-6 transition-opacity duration-300 ${status === 'success' ? 'pointer-events-none absolute opacity-0' : 'relative opacity-100'}`}
          onSubmit={handleSubmit}
        >
          {contact.fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block font-medium" htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-primary-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={field.required}
                  className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring dark:border-gray-700 dark:bg-gray-900"
                  rows={5}
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
                  className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring dark:border-gray-700 dark:bg-gray-900"
                />
              )}
            </div>
          ))}
          {status === 'error' && <div className="text-center text-red-500">{message}</div>}
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-8 py-3 text-base font-medium text-white disabled:opacity-60"
            disabled={status === 'loading' || !validate()}
          >
            {status === 'loading' ? 'Sending...' : contact.submitLabel}
          </button>
        </form>
        <div
          className={`absolute top-0 left-0 w-full text-center transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          style={{ minHeight: containerHeight }}
        >
          <p className="text-primary-600 dark:text-primary-400 mt-2 text-lg">
            {message || contact.successMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

const MAX_DISPLAY = 3

const FeatureIcon = ({ icon }) => {
  const IconComponent = getIconComponent(icon)
  if (!IconComponent) {
    console.warn(`Icon ${icon} not found in iconMap`)
    return null
  }
  return <IconComponent className="text-primary-500 h-6 w-6" />
}

const HeroSection = ({ hero }) => (
  <div className="flex flex-col-reverse items-center justify-between py-16 md:py-24 lg:flex-row">
    <div className="space-y-6 lg:w-1/2">
      <h1
        className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-6xl dark:text-slate-200"
        dangerouslySetInnerHTML={{ __html: hero.title }}
      />
      <p className="text-lg text-gray-600 md:text-xl dark:text-gray-400">{hero.description}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={hero.primaryCta.link}
          className="bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white md:px-8 md:py-4 md:text-lg"
        >
          {hero.primaryCta.text}
        </Link>
        <Link
          href={hero.secondaryCta.link}
          className="text-primary-600 bg-primary-100 hover:bg-primary-200 dark:text-primary-300 inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium md:px-8 md:py-4 md:text-lg dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {hero.secondaryCta.text}
        </Link>
      </div>
    </div>
    <div className="mb-10 lg:mb-0 lg:w-1/2">
      <div className="relative">
        <div className="w-full overflow-hidden rounded-lg shadow-xl">
          <Image
            src={landingDemoImage}
            alt="AI Landing Page Generator Demo"
            width={1024}
            height={576}
            className="h-auto w-full"
          />
        </div>
        <div className="bg-primary-500/10 absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-2xl" />
        <div className="bg-primary-500/10 absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" />
      </div>
    </div>
  </div>
)

const MainFeaturesSection = ({ mainFeatures }) => (
  <div className="py-16">
    <h2 className="mb-12 text-center text-3xl font-bold">Main Features</h2>
    <div className="grid gap-8 md:grid-cols-3">
      {mainFeatures.map((feature) => (
        <div
          key={feature.id}
          className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg dark:border-gray-700"
        >
          <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
)

const FeaturesGridSection = ({ features }) => (
  <div className="py-16">
    <h2 className="mb-12 text-center text-3xl font-bold">Everything You Need to Launch Fast</h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.items.map((feature) => (
        <div
          key={feature.title}
          className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg dark:border-gray-700"
        >
          <FeatureIcon icon={feature.icon} />
          <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
)

const PricingSection = ({ pricing }) => (
  <div className="py-16">
    <div className="text-center">
      <h2 className="text-3xl font-bold">{pricing.title}</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{pricing.description}</p>
    </div>
    <div className="mt-12 grid gap-8 lg:grid-cols-3">
      {pricing.plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-lg border ${plan.highlighted ? 'border-primary-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'} p-8`}
        >
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{plan.description}</p>
          <div className="mt-4 text-4xl font-bold">{plan.price}</div>
          <ul className="mt-8 space-y-4">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <HiCheckCircle className="text-primary-500 h-5 w-5" />
                <span className="ml-3">{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href={plan.cta.link}
            className={`mt-8 block w-full rounded-lg px-6 py-3 text-center font-medium ${plan.highlighted ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'}`}
          >
            {plan.cta.text}
          </Link>
        </div>
      ))}
    </div>
  </div>
)

const CtaSection = ({ cta }) => {
  const [email, setEmail] = useState('')

  const { subscribe, status, message } = useEmailSubscription()

  return (
    <div className="bg-primary-50 rounded-2xl px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-800/50">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold dark:text-white">{cta.title}</h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-slate-800">{cta.description}</p>
        {cta.collectEmail ? (
          <form
            className="flex flex-col items-center justify-center gap-4"
            onSubmit={async (e) => {
              e.preventDefault()
              await subscribe(email)
              if (status === 'success') setEmail('')
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 rounded-md border border-gray-300 px-4 py-2 text-base focus:ring"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 rounded-md px-8 py-2 text-base font-medium text-white disabled:opacity-60"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting...' : cta.button.text}
              </button>
            </div>
            <div className="mt-2 flex h-6 w-full items-center justify-center">
              {message && (
                <span className="text-primary-600 dark:text-primary-400 text-sm">{message}</span>
              )}
            </div>
          </form>
        ) : (
          <Link
            href={cta.button.link}
            className="bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-md border border-transparent px-8 py-4 text-base font-medium text-white"
          >
            {cta.button.text}
          </Link>
        )}
      </div>
    </div>
  )
}

const BlogPostsSection = ({ posts }) => (
  <div className="py-16">
    <h2 className="mb-12 text-center text-3xl font-bold">Latest Updates</h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {!posts.length && 'No posts found.'}
      {posts.slice(0, MAX_DISPLAY).map((post) => {
        const { slug, date, title, summary, tags } = post
        return (
          <article
            key={slug}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
          >
            <div className="flex-1 p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
              <h2 className="mb-2 text-xl font-bold">
                <Link
                  href={`/blog/${slug}`}
                  className="hover:text-primary-500 dark:hover:text-primary-400 text-slate-800 dark:text-gray-100"
                >
                  {title}
                </Link>
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{summary}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
              </div>
            </div>
          </article>
        )
      })}
    </div>
    {posts.length > MAX_DISPLAY && (
      <div className="mt-8 flex justify-center">
        <Link
          href="/blog"
          className="hover:border-primary-500 dark:hover:border-primary-500 inline-flex items-center rounded-md border border-gray-200 px-6 py-3 dark:border-gray-700"
        >
          All Posts &rarr;
        </Link>
      </div>
    )}
  </div>
)

export default function Home() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const { hero, mainFeatures, features, cta, pricing, contact } = landingContent

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-10/12 xl:px-0">
      <HeroSection hero={hero} />
      <MainFeaturesSection mainFeatures={mainFeatures} />
      <FeaturesGridSection features={features} />
      <PricingSection pricing={pricing} />
      <CtaSection cta={cta} />
      <BlogPostsSection posts={posts} />
      {contact && <ContactSection contact={contact} />}
    </div>
  )
}
