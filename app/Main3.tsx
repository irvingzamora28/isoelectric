'use client'

import { useState } from 'react'
import landingDemoImage from '../public/static/images/landing-demo.jpeg'
import dashboardDemoImage from '../public/static/images/dashboard-demo.jpg'
import Image from 'next/image'
import dataLandingContent from '@/data/landingContent.json'
import type { LandingContent } from './allset/landing-content/types' // adjust path if needed
import Link from 'next/link'
import GallerySection from '@/components/GallerySection'

import { useEmailSubscription } from '@/lib/useEmailSubscription'
import FeatureIcon from '@/components/FeatureIcon'
import { HiCheckCircle } from 'react-icons/hi2'

const landingContent = dataLandingContent as LandingContent

const MAX_DISPLAY = 3

const HeroSection = () => {
  const { hero } = landingContent
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8 lg:pt-32">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl dark:text-white">
          <span dangerouslySetInnerHTML={{ __html: hero.title }} />
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 sm:text-xl dark:text-slate-200">
          {hero.description}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            className="group dark:bg-primary-900 dark:hover:bg-primary-800 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300 sm:px-10 sm:py-8 sm:text-2xl dark:hover:text-slate-200"
            href={hero.primaryCta.link}
          >
            {hero.primaryCta.text}
          </Link>
          <Link
            className="group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300 focus:outline-hidden focus-visible:ring-slate-300 focus-visible:outline-blue-600 active:bg-slate-100 active:text-slate-600 sm:px-10 sm:py-8 sm:text-2xl dark:text-slate-200"
            href={hero.secondaryCta.link}
          >
            {hero.secondaryCta.text}
          </Link>
        </div>
      </div>
    </>
  )
}

const imageMap = {
  landingDemoImage: landingDemoImage,
  dashboardDemoImage: dashboardDemoImage,
}

const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState(landingContent.mainFeatures[0])

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="bg-primary-100 relative overflow-hidden pt-20 pb-28 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0">
          <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
            <div
              className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal"
              role="tablist"
              aria-orientation="vertical"
            >
              {landingContent.mainFeatures.map((feature) => {
                return (
                  <div
                    key={feature.title}
                    className={`group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6 ${
                      selectedFeature.title === feature.title
                        ? 'bg-primary-600 lg:bg-primary-600/10 lg:ring-primary-600/10 lg:ring-1 lg:ring-inset'
                        : 'hover:bg-primary-600/10 lg:hover:bg-primary-600/5'
                    }`}
                  >
                    <h3>
                      <button
                        className={`font-display text-lg focus:outline-none md:text-2xl ${
                          selectedFeature.title === feature.title
                            ? 'text-slate-100 lg:text-white'
                            : 'text-slate-100 hover:text-white lg:text-white'
                        }`}
                        role="tab"
                        aria-selected={selectedFeature.title === feature.title}
                        tabIndex={selectedFeature.title === feature.title ? 0 : -1}
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <span className="absolute inset-0 rounded-full text-white lg:rounded-l-xl lg:rounded-r-none"></span>
                        {feature.title}
                      </button>
                    </h3>
                    <p
                      className={`mt-2 hidden text-sm md:text-base lg:block ${selectedFeature.title === feature.title ? 'text-white' : 'text-white group-hover:text-white'}`}
                    >
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="lg:col-span-7">
            <div>
              <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                <Image
                  alt={selectedFeature.title}
                  fetchPriority="high"
                  width="2174"
                  height="1464"
                  decoding="async"
                  className="w-full"
                  style={{ color: 'transparent' }}
                  sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                  src={imageMap[selectedFeature.image]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SecondaryFeaturesSection = () => {
  const { features } = landingContent

  if (!features || features.items.length === 0) return null

  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {features.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-slate-200">
            {features.description}
          </p>
        </div>
        <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
          {features.items.map((feature) => {
            return (
              <div key={feature.title}>
                <div className="mx-auto max-w-2xl">
                  <div className="w-9">
                    <FeatureIcon icon={feature.icon} />
                  </div>
                  <h3 className="text-primary-600 dark:text-primary-200 mt-6 text-xl font-medium">
                    {feature.title}
                  </h3>
                  <p className="font-display mt-2 text-lg text-slate-900 dark:text-slate-200">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="hidden lg:mt-20 lg:block">
        <div
          className="mx-auto grid max-w-7xl grid-cols-3 gap-x-8 px-4 sm:px-6 lg:px-8"
          role="tablist"
          aria-orientation="horizontal"
        >
          {features.items.map((feature) => {
            return (
              <div key={feature.title}>
                <div className="relative my-6 opacity-90 hover:opacity-100">
                  <div className="w-9">
                    <FeatureIcon icon={feature.icon} />
                  </div>
                  <h3 className="text-primary-600 dark:text-primary-200 mt-3 text-xl font-medium">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-lg text-slate-900 dark:text-slate-200">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const CallToActionSection = () => {
  const { cta } = landingContent
  const [email, setEmail] = useState('')

  const { subscribe, status, message } = useEmailSubscription()

  return (
    <section id="cta" className="relative overflow-hidden bg-gray-900 py-32 dark:bg-gray-500">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl dark:text-slate-900">
            {cta.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white dark:text-slate-900">
            {cta.description}
          </p>
          <div className="mt-8 flex justify-center">
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
                    className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 rounded-md border border-gray-300 bg-slate-50 px-4 py-2 text-base focus:ring dark:border-gray-600 dark:text-gray-800"
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
                    <span className="text-primary-600 dark:text-primary-400 text-sm">
                      {message}
                    </span>
                  )}
                </div>
              </form>
            ) : (
              <Link
                href={cta.button.link}
                className="bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white md:px-8 md:py-4 md:text-lg"
              >
                {cta.button.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

const TestimonialsSection = () => {
  const testimonials = landingContent.testimonials
  if (!testimonials) return null

  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="bg-slate-50 py-20 sm:py-32 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {testimonials.title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-white">
            {testimonials.description}
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
          {testimonials.testimonials.map((testimonial, index) => (
            <li key={index} className="rounded-2xl dark:bg-gray-800">
              <ul className="flex flex-col gap-y-6 sm:gap-y-8">
                <li>
                  <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 dark:bg-gray-800">
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900 dark:text-white">
                        {testimonial.quote}
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {testimonial.title}
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-full bg-slate-50 dark:bg-gray-800">
                        <Image
                          alt=""
                          loading="lazy"
                          width="56"
                          height="56"
                          decoding="async"
                          data-nimg="1"
                          className="h-14 w-14 object-cover"
                          style={{ color: 'transparent' }}
                          src={testimonial.image}
                        />
                      </div>
                    </figcaption>
                  </figure>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const FaqSection = () => {
  const { faqs } = landingContent
  const faqStyle = {
    color: 'transparent',
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32 dark:bg-gray-800"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl dark:text-white"
          >
            {faqs.title}
          </h2>
          <p
            className="mt-4 text-lg tracking-tight text-slate-700 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: faqs.description }}
          />
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {faqs.questions.map((faq, index) => (
            <li key={index}>
              <ul className="flex flex-col gap-y-8">
                <li>
                  <h3 className="font-display text-lg/7 text-slate-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{faq.answer}</p>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const PricingSection = () => {
  const pricing = landingContent.pricing ?? null
  if (!pricing) return null

  return (
    <section id="pricing" aria-label="Pricing" className="bg-slate-900 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            <span className="relative whitespace-nowrap">
              <svg
                aria-hidden="true"
                viewBox="0 0 281 40"
                preserveAspectRatio="none"
                className="fill-primary-400 absolute top-1/2 left-0 h-[1em] w-full"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
                ></path>
              </svg>
              <span className="relative">{pricing.title}</span>
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">{pricing.description}</p>
        </div>
        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          {pricing.plans.map((plan, index) => (
            <section
              key={index}
              className={`flex flex-col rounded-3xl px-6 sm:px-8 lg:py-8 ${plan.highlighted ? 'bg-primary-600' : 'bg-slate-900'}`}
            >
              <h3 className="font-display mt-5 text-lg text-white">{plan.name}</h3>
              <p
                className={`mt-2 text-base ${plan.highlighted ? 'text-slate-100' : 'text-slate-400'}`}
              >
                {plan.description}
              </p>
              <p
                className={`font-display order-first text-5xl font-light tracking-tight text-white ${plan.highlighted ? 'text-slate-400' : 'text-slate-400'}`}
              >
                {plan.price}
              </p>
              <ul
                className={`order-last mt-10 flex flex-col gap-y-3 text-sm ${plan.highlighted ? 'text-slate-100' : 'text-slate-200'}`}
              >
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex">
                    <HiCheckCircle
                      className={`h-5 w-5 flex-none ${plan.highlighted ? 'text-slate-100' : 'text-slate-400'}`}
                      aria-hidden="true"
                    />
                    <span className="ml-4">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                className={`group text-md mt-8 inline-flex items-center justify-center rounded-full px-4 py-2 ring-1 ring-slate-700 hover:ring-slate-500 focus:outline-hidden focus-visible:outline-white active:text-slate-400 active:ring-slate-700 ${plan.highlighted ? 'bg-slate-100 text-slate-600' : 'bg-primary-600 text-slate-100'}`}
                color="white"
                aria-label={`Get started with the ${plan.name} plan for ${plan.price}`}
                href={plan.cta.link}
              >
                {plan.cta.text}
              </Link>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

import Main3ContactSection from './Main3ContactSection'

const Main3 = () => {
  return (
    <div>
      <main>
        {landingContent.hero && <HeroSection />}
        {landingContent.mainFeatures?.length > 0 && <FeaturesSection />}
        {landingContent.features?.items?.length > 0 && <SecondaryFeaturesSection />}
        {landingContent.cta && <CallToActionSection />}
        {landingContent.gallery && (
          <GallerySection gallery={landingContent.gallery} variant="dark" />
        )}
        {landingContent.testimonials && <TestimonialsSection />}
        {landingContent.pricing && <PricingSection />}
        {landingContent.faqs?.questions?.length > 0 && <FaqSection />}
        {landingContent.contact && <Main3ContactSection contact={landingContent.contact} />}
      </main>
    </div>
  )
}

export default Main3
