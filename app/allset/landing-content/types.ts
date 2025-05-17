// Types for the landing content data structure

export interface CtaButton {
  text: string
  link: string
}

export interface MainFeature {
  id: number
  icon: string
  title: string
  description: string
  image: string
}

export interface FeaturesSection {
  title: string
  description: string
  items: Feature[]
}

export interface Feature {
  title: string
  description: string
  icon: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface PricingPlan {
  name: string
  price: string
  description: string
  features: string[]
  cta: CtaButton
  highlighted?: boolean
}

export interface HeroSection {
  title: string
  description: string
  primaryCta: CtaButton
  secondaryCta: CtaButton
  image?: string
}

export interface CtaSection {
  title: string
  description: string
  button: CtaButton
  collectEmail?: boolean
}

export interface FaqsSection {
  title: string
  description: string
  questions: FaqItem[]
}

export interface PricingSection {
  title: string
  description: string
  plans: PricingPlan[]
}

export interface TestimonialSection {
  title?: string
  description?: string
  image?: string
  testimonials: Testimonial[]
}

export interface Testimonial {
  name: string
  quote: string
  image: string
  title?: string
}

export interface GalleryImage {
  src: string
  alt: string
  caption: string
}

export interface GallerySection {
  title: string
  description: string
  images: GalleryImage[]
}

export interface ServiceSection {
  title: string
  description: string
  items: Service[]
}

export interface Service {
  title: string
  description: string
  icon: string
  image: string
}

export interface Project {
  title: string
  description: string
  image: string
  category: string
  completionDate: string
}

export interface ProjectsSection {
  title: string
  description: string
  items: Project[]
}

export interface ContactField {
  name: string
  label: string
  type: string
  required: boolean
}

export interface ContactInfo {
  title: string
  phone?: {
    label: string
    number: string
    hours?: string
  }
  email?: {
    label: string
    address: string
    responseTime?: string
  }
  location?: {
    label: string
    address: string[]
  }
}

export interface EmergencyService {
  title: string
  description: string
  hotlineLabel: string
  hotlineNumber: string
}

export interface ContactSection {
  title: string
  description: string
  fields: ContactField[]
  submitLabel: string
  successMessage: string
  contactInfo?: ContactInfo
  emergencyService?: EmergencyService
}

export interface LandingContent {
  hero: HeroSection
  mainFeatures: MainFeature[]
  features: FeaturesSection
  cta: CtaSection
  gallery?: GallerySection
  faqs: FaqsSection
  pricing?: PricingSection
  testimonials?: TestimonialSection
  contact?: ContactSection
  services?: ServiceSection
  projects?: ProjectsSection
}
