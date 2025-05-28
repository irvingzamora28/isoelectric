'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dataLandingContent from '@/data/landingContent.json'
import { LandingContent } from './allset/landing-content/types'
import { useEmailSubscription } from '@/lib/useEmailSubscription'
import { useContactSubmission } from '@/lib/useContactSubmission'
import { FaIndustry, FaTools, FaBolt, FaChartLine, FaShieldAlt, FaClock } from 'react-icons/fa'
import { FiAward, FiZap, FiSettings, FiDollarSign, FiCalendar, FiPhone } from 'react-icons/fi'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  Variants,
} from 'framer-motion'

const landingContent = dataLandingContent as LandingContent

// Map of icons for services section
const serviceIconMap = {
  FaIndustry,
  FaTools,
  FaBolt,
  FaChartLine,
}

// Map of icons for features section
const featureIconMap = {
  FiAward,
  FiZap,
  FiSettings,
  FiDollarSign,
  FiCalendar,
  FiPhone,
  FaShieldAlt,
  FaClock,
  FaBolt,
}

// Animation variants for reuse
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
}

const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// Component to handle testimonial profile images with fallback
const TestimonialProfileImage = ({
  image,
  defaultImage,
  name,
}: {
  image?: string
  defaultImage: string
  name: string
}) => {
  const [imageSrc, setImageSrc] = useState<string>(image || defaultImage)
  const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false)

  // Reset image source if the image prop changes
  useEffect(() => {
    setImageSrc(image || defaultImage)
    setImageLoadFailed(false)
  }, [image, defaultImage])

  return imageLoadFailed ? (
    <Image src={defaultImage} alt={name} fill className="object-cover" />
  ) : (
    <Image
      src={imageSrc}
      alt={name}
      fill
      className="object-cover"
      onError={() => {
        if (imageSrc !== defaultImage) {
          setImageSrc(defaultImage)
          setImageLoadFailed(true)
        }
      }}
    />
  )
}

const HeroSection = () => {
  const { hero } = landingContent
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  // Default hero image path - we know this exists in the project
  const defaultHeroImage = '/static/images/hero.jpg'

  // Use state to track if the primary image failed to load
  const [imageSrc, setImageSrc] = useState<string>(hero.image || defaultHeroImage)
  const [imageLoadFailed, setImageLoadFailed] = useState<boolean>(false)

  // Effect to reset image source if hero.image changes
  useEffect(() => {
    setImageSrc(hero.image || defaultHeroImage)
    setImageLoadFailed(false)
  }, [hero.image])

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">
      {/* Full-screen background image with overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative h-full w-full">
          {!imageLoadFailed ? (
            <Image
              src={imageSrc}
              alt={hero.title || 'Hero Image'}
              fill
              priority
              className="object-cover"
              onError={() => {
                // Only switch to default if we're not already using it
                if (imageSrc !== defaultHeroImage) {
                  console.log('Primary image failed to load, switching to default')
                  setImageSrc(defaultHeroImage)
                  setImageLoadFailed(true)
                }
              }}
            />
          ) : (
            <Image
              src={defaultHeroImage}
              alt={hero.title || 'Hero Image'}
              fill
              priority
              className="object-cover"
            />
          )}
          <motion.div
            className="absolute inset-0 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          ></motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        ref={ref}
        className="relative z-10 container mx-auto mt-[-5vh] px-4 text-white"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="mx-auto max-w-4xl">
          <motion.h1
            className="mb-6 text-5xl leading-tight font-bold md:text-7xl"
            variants={fadeInUp}
          >
            <motion.span
              className="text-primary-400"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              {hero.title.split(' ')[0]}
            </motion.span>{' '}
            {hero.title.split(' ').slice(1).join(' ')}
          </motion.h1>
          <motion.p className="mb-10 max-w-2xl text-xl text-white md:text-2xl" variants={fadeInUp}>
            {hero.description}
          </motion.p>
          <motion.div className="flex flex-col gap-4 sm:flex-row" variants={fadeInUp}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={hero.primaryCta.link}
                className="bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl"
              >
                {hero.primaryCta.text}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={hero.secondaryCta.link}
                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-transparent px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white/20"
              >
                {hero.secondaryCta.text}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1.5,
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
          repeatDelay: 0.2,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  )
}

const ServicesSection = () => {
  const { services } = landingContent
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  if (!services || services.items.length === 0) return null

  return (
    <section id="services" className="bg-white py-24 dark:bg-gray-900">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="mb-16 text-center" variants={fadeInUp}>
          <motion.h2
            className="mb-4 text-4xl font-bold text-gray-900 dark:text-white"
            variants={fadeInUp}
          >
            {services.title}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400"
            variants={fadeInUp}
          >
            {services.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.items.map((service, index) => {
            const IconComponent = serviceIconMap[service.icon as keyof typeof serviceIconMap]

            return (
              <motion.div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-8 shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                variants={scaleIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400 mb-4 inline-flex rounded-full p-4"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </motion.div>
                <motion.h3
                  className="mb-3 text-xl font-bold text-gray-900 dark:text-white"
                  variants={fadeIn}
                >
                  {service.title}
                </motion.h3>
                <motion.p className="mb-4 text-gray-600 dark:text-gray-400" variants={fadeIn}>
                  {service.description}
                </motion.p>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <Link
                    href={`#service-${index}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
                  >
                    Learn more
                    <motion.svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                        repeatDelay: 1,
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </motion.svg>
                  </Link>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}

const MainFeaturesSection = () => {
  const { mainFeatures } = landingContent
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="mb-16 text-center" variants={fadeInUp}>
          <motion.h2 className="mb-4 text-3xl font-bold md:text-4xl" variants={fadeInUp}>
            {mainFeatures.title}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
            variants={fadeInUp}
          >
            {mainFeatures.description}
          </motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-12 lg:grid-cols-3" variants={staggerContainer}>
          {mainFeatures.items.map((feature, index) => {
            const IconComponent = featureIconMap[feature.icon] || FaBolt

            return (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center"
                variants={scaleIn}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <motion.div
                  className="bg-primary-500 dark:bg-primary-600 mb-6 rounded-full p-5"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
                >
                  <IconComponent className="text-3xl text-white" />
                </motion.div>
                <motion.h3 className="mb-4 text-2xl font-bold" variants={fadeIn}>
                  {feature.title}
                </motion.h3>
                <motion.p className="text-gray-600 dark:text-gray-400" variants={fadeIn}>
                  {feature.description}
                </motion.p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}

const ProjectsSection = () => {
  const { projects } = landingContent

  if (!projects || !projects.items || projects.items.length === 0) return null

  return (
    <section className="bg-gray-100 py-24 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">{projects.title}</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            {projects.description}
          </p>
        </div>

        {/* Featured Project - First project gets special treatment */}
        {projects.items.length > 0 && (
          <div className="mb-20">
            <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="relative h-[70vh] w-full">
                <Image
                  src={projects.items[0].image || '/static/images/services/project1.jpg'}
                  alt={projects.items[0].title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              </div>

              <div className="absolute right-0 bottom-0 left-0 p-8 text-white md:p-12">
                <div className="max-w-3xl">
                  <div className="bg-primary-500 mb-4 inline-block rounded-full px-4 py-1 text-sm font-medium text-white">
                    {projects.items[0].category}
                  </div>
                  <h3 className="mb-4 text-3xl font-bold md:text-4xl">{projects.items[0].title}</h3>
                  <p className="mb-6 max-w-2xl text-lg text-gray-200">
                    {projects.items[0].description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">
                      Completed: {projects.items[0].completionDate}
                    </div>
                    <Link
                      href="#project-details"
                      className="inline-flex items-center rounded-lg bg-white/10 px-5 py-2 text-white transition-colors hover:bg-white/20"
                    >
                      View Project Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Projects */}
        {projects.items.length > 1 && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {projects.items.slice(1).map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-xl">
                <div className="relative h-96">
                  <Image
                    src={project.image || '/static/images/services/project3.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="absolute right-0 bottom-0 left-0 p-8 text-white">
                  <div className="bg-primary-500 mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium text-white">
                    {project.category}
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{project.title}</h3>
                  <p className="mb-4 text-gray-200">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Completed: {project.completionDate}</div>
                    <Link
                      href={`#project-${index + 1}`}
                      className="inline-flex items-center font-medium text-white/80 hover:text-white hover:underline"
                    >
                      View Details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const FeaturesGridSection = () => {
  const { features } = landingContent
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800" id="features">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="mb-16 text-center" variants={fadeInUp}>
          <motion.h2 className="mb-4 text-3xl font-bold md:text-4xl" variants={fadeInUp}>
            {features.title}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
            variants={fadeInUp}
          >
            {features.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
        >
          {features.items.map((feature, index) => {
            const IconComponent = featureIconMap[feature.icon] || FiSettings

            return (
              <motion.div
                key={index}
                className="rounded-xl bg-white p-8 shadow-md transition-all hover:shadow-lg dark:bg-gray-700"
                variants={scaleIn}
                whileHover={{
                  y: -8,
                  boxShadow:
                    '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="inline-block"
                >
                  <IconComponent className="text-primary-500 mb-4 text-3xl" />
                </motion.div>
                <motion.h3 className="mb-3 text-xl font-bold" variants={fadeIn}>
                  {feature.title}
                </motion.h3>
                <motion.p className="text-gray-600 dark:text-gray-400" variants={fadeIn}>
                  {feature.description}
                </motion.p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>
    </section>
  )
}

const TestimonialsSection = () => {
  const { testimonials } = landingContent
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  // Default testimonials background image
  const defaultBgImage = '/static/images/hero.jpg'

  // Use state to track if the primary image failed to load
  const [bgImageSrc, setBgImageSrc] = useState<string>(testimonials?.image || defaultBgImage)
  const [bgImageLoadFailed, setBgImageLoadFailed] = useState<boolean>(false)

  // Effect to reset image source if testimonials.image changes
  useEffect(() => {
    setBgImageSrc(testimonials?.image || defaultBgImage)
    setBgImageLoadFailed(false)
  }, [testimonials?.image])

  if (!testimonials || !testimonials.testimonials.length) return null

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background with overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative h-full w-full">
          {!bgImageLoadFailed ? (
            <Image
              src={bgImageSrc}
              alt="Testimonials Background"
              fill
              className="object-cover"
              onError={() => {
                // Only switch to default if we're not already using it
                if (bgImageSrc !== defaultBgImage) {
                  console.log('Testimonial background image failed to load, switching to default')
                  setBgImageSrc(defaultBgImage)
                  setBgImageLoadFailed(true)
                }
              }}
            />
          ) : (
            <Image
              src={defaultBgImage}
              alt="Testimonials Background"
              fill
              className="object-cover"
            />
          )}
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          ></motion.div>
        </div>
      </motion.div>

      <motion.div
        ref={ref}
        className="relative z-10 container mx-auto px-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="mb-16 text-center" variants={fadeInUp}>
          <motion.h2 className="mb-4 text-3xl font-bold text-white md:text-5xl" variants={fadeInUp}>
            {testimonials.title}
          </motion.h2>
          <motion.p className="mx-auto max-w-3xl text-xl text-gray-300" variants={fadeInUp}>
            {testimonials.description}
          </motion.p>
        </motion.div>

        <motion.div className="mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {testimonials.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="hover:border-primary-500 group flex h-full flex-col rounded-xl border border-white/10 bg-white/10 p-8 backdrop-blur-sm transition-all hover:bg-white/15"
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                {/* Quote icon */}
                <motion.div
                  className="text-primary-400 mb-6"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: 'spring' }}
                >
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 opacity-80"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </motion.svg>
                </motion.div>

                <motion.p className="flex-grow text-lg text-gray-200 italic" variants={fadeIn}>
                  "{testimonial.quote}"
                </motion.p>

                <motion.div className="mt-auto flex items-start pt-8" variants={fadeIn}>
                  <motion.div className="flex-shrink-0" whileHover={{ scale: 1.1 }}>
                    <motion.div
                      className="ring-primary-500 group-hover:ring-primary-500 relative mr-4 h-16 w-16 overflow-hidden rounded-full ring-2 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    >
                      {/* Use a separate component for each testimonial profile image to manage its own state */}
                      <TestimonialProfileImage
                        image={testimonial.image}
                        defaultImage={`/static/images/testimonial${(index % 3) + 1}.jpg`}
                        name={testimonial.name}
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="min-w-0 flex-grow"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.h4 className="truncate font-bold text-white" variants={fadeIn}>
                      {testimonial.name}
                    </motion.h4>
                    <motion.p className="truncate text-sm text-gray-300" variants={fadeIn}>
                      {testimonial.title}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

const FaqSection = () => {
  const { faqs } = landingContent
  const [openIndex, setOpenIndex] = useState(-1)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  if (!faqs || !faqs.questions || faqs.questions.length === 0) return null

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800">
      <motion.div
        ref={ref}
        className="container mx-auto px-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="mb-16 text-center" variants={fadeInUp}>
          <motion.h2 className="mb-4 text-3xl font-bold md:text-4xl" variants={fadeInUp}>
            {faqs.title}
          </motion.h2>
          <motion.p
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
            variants={fadeInUp}
          >
            {faqs.description}
          </motion.p>
        </motion.div>

        <motion.div className="mx-auto max-w-3xl" variants={staggerContainer}>
          {faqs.questions.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
              variants={fadeInUp}
              custom={index}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              <motion.button
                className="flex w-full items-center justify-between bg-white p-5 text-left hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800"
                onClick={() => toggleQuestion(index)}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span className="text-lg font-medium">{faq.question}</motion.span>
                <motion.span
                  className="text-primary-500 text-2xl"
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                >
                  {openIndex === index ? '−' : '+'}
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="border-t border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <motion.p
                      className="text-gray-600 dark:text-gray-400"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {faq.answer}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

const CtaSection = () => {
  const { cta } = landingContent
  const [email, setEmail] = useState('')
  const { subscribe, status, message } = useEmailSubscription()

  if (!cta) return null

  return (
    <section id="cta" className="bg-primary-600 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{cta.title}</h2>
          <p className="mb-8 text-xl text-white/80">{cta.description}</p>

          {cta.collectEmail ? (
            <form
              className="mx-auto max-w-lg"
              onSubmit={async (e) => {
                e.preventDefault()
                await subscribe(email)
                if (status === 'success') setEmail('')
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="focus:ring-primary-300 flex-1 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:outline-none"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  className="text-primary-600 rounded-lg bg-white px-6 py-3 font-medium transition-colors hover:bg-gray-100 disabled:opacity-70"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Submitting...' : cta.button.text}
                </button>
              </div>
              {message && <div className="mt-3 text-center text-white/90">{message}</div>}
            </form>
          ) : (
            <Link
              href={cta.button.link}
              className="text-primary-600 inline-block rounded-lg bg-white px-8 py-4 text-lg font-medium transition-colors hover:bg-gray-100"
            >
              {cta.button.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

const ContactSection = () => {
  const { contact } = landingContent

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
  } = useContactSubmission(contact?.fields ?? [])

  if (!contact) return null

  // Check if contact info exists
  const hasContactInfo =
    !!contact.contactInfo &&
    (!!contact.contactInfo.phone || !!contact.contactInfo.email || !!contact.contactInfo.location)

  // Check if emergency service exists
  const hasEmergencyService = contact.emergencyService

  // Determine column layout based on what sections are available
  const formColSpan = !hasContactInfo && !hasEmergencyService ? 'lg:col-span-5' : 'lg:col-span-3'

  return (
    <section id="contact" className="bg-gray-100 py-24 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">{contact.title}</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
            {contact.description}
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
            {/* Left side - Contact info and emergency service */}
            {(hasContactInfo || hasEmergencyService) && (
              <div className="space-y-8 lg:col-span-2">
                {/* Contact info card */}
                {hasContactInfo && (
                  <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <h3 className="mb-6 text-2xl font-bold">{contact.contactInfo?.title}</h3>

                    <div className="space-y-6">
                      {contact.contactInfo?.phone && (
                        <div className="flex items-start">
                          <div className="bg-primary-100 dark:bg-primary-900/30 mr-4 rounded-full p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="mb-1 text-lg font-medium">
                              {contact.contactInfo?.phone.label}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {contact.contactInfo?.phone.number}
                            </p>
                            {contact.contactInfo?.phone.hours && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                                {contact.contactInfo?.phone.hours}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {contact.contactInfo?.email && (
                        <div className="flex items-start">
                          <div className="bg-primary-100 dark:bg-primary-900/30 mr-4 rounded-full p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="mb-1 text-lg font-medium">
                              {contact.contactInfo?.email.label}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              {contact.contactInfo?.email.address}
                            </p>
                            {contact.contactInfo?.email.responseTime && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                                {contact.contactInfo?.email.responseTime}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {contact.contactInfo?.location && (
                        <div className="flex items-start">
                          <div className="bg-primary-100 dark:bg-primary-900/30 mr-4 rounded-full p-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="mb-1 text-lg font-medium">
                              {contact.contactInfo?.location.label}
                            </h4>
                            {contact.contactInfo?.location.address.map((line, index) => (
                              <p key={index} className="text-gray-600 dark:text-gray-400">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency service card */}
                {hasEmergencyService && (
                  <div className="bg-primary-600 relative overflow-hidden rounded-xl p-8 text-white shadow-lg">
                    <div className="bg-primary-500 absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full opacity-50"></div>
                    <div className="bg-primary-700 absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 rounded-full opacity-50"></div>

                    <div className="relative z-10">
                      <div className="mb-4 flex items-center">
                        <FaBolt className="mr-3 text-3xl" />
                        <h3 className="text-2xl font-bold">{contact.emergencyService?.title}</h3>
                      </div>

                      <p className="mb-6 text-white/90">{contact.emergencyService?.description}</p>

                      <div className="rounded-lg bg-white/20 p-4 backdrop-blur-sm">
                        <p className="mb-1 text-xl font-bold">
                          {contact.emergencyService?.hotlineLabel}
                        </p>
                        <p className="text-2xl font-bold">
                          {contact.emergencyService?.hotlineNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right side - Contact form */}
            <div className={formColSpan}>
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <h3 className="mb-6 text-2xl font-bold">{contact.title}</h3>

                <div style={{ position: 'relative', width: '100%', minHeight: containerHeight }}>
                  <form
                    ref={formRef}
                    className={`w-full space-y-6 transition-opacity duration-300 ${
                      status === 'success'
                        ? 'pointer-events-none absolute opacity-0'
                        : 'relative opacity-100'
                    }`}
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {contact.fields.slice(0, 4).map((field) => (
                        <div key={field.name}>
                          <label className="mb-2 block font-medium" htmlFor={field.name}>
                            {field.label}
                            {field.required && <span className="text-primary-500 ml-1">*</span>}
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            value={form[field.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required={field.required}
                            className="focus:ring-primary-300 focus:border-primary-300 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      ))}
                    </div>

                    {contact.fields.slice(4).map((field) => (
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
                            className="focus:ring-primary-300 focus:border-primary-300 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                            className="focus:ring-primary-300 focus:border-primary-300 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        )}
                      </div>
                    ))}

                    {status === 'error' && (
                      <div className="text-center text-red-500">{message}</div>
                    )}

                    <button
                      type="submit"
                      className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors disabled:opacity-70"
                      disabled={status === 'loading' || !validate()}
                    >
                      {status === 'loading' ? (
                        <>
                          <svg
                            className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        contact.submitLabel
                      )}
                    </button>
                  </form>

                  <div
                    className={`absolute top-0 left-0 w-full text-center transition-opacity duration-300 ${
                      status === 'success' ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    style={{ minHeight: containerHeight }}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="mb-4 rounded-full bg-green-100 p-4 text-green-600 dark:bg-green-900 dark:text-green-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <h3 className="mb-2 text-2xl font-bold">Thank You!</h3>
                      <p className="max-w-md text-gray-600 dark:text-gray-400">
                        {contact.successMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const Main4 = () => {
  return (
    <div className="bg-white dark:bg-gray-900">
      <HeroSection />
      {landingContent.services && <ServicesSection />}
      {landingContent.projects && <ProjectsSection />}
      {landingContent.mainFeatures?.items?.length > 0 && <MainFeaturesSection />}
      {landingContent.features?.items?.length > 0 && <FeaturesGridSection />}
      {landingContent.testimonials && landingContent.testimonials.testimonials.length > 0 && (
        <TestimonialsSection />
      )}
      {landingContent.cta && <CtaSection />}
      {landingContent.faqs?.questions?.length > 0 && <FaqSection />}
      {landingContent.contact && <ContactSection />}
    </div>
  )
}

export default Main4
