/**
 * Types for the LLM service
 */

export interface LLMResponse {
  content: string
  error?: string
}

export interface LLMProvider {
  /**
   * Generate content based on a prompt
   * @param prompt The prompt to send to the LLM
   * @returns The generated content
   */
  generateContent(prompt: string): Promise<LLMResponse>
}

export interface BlogTitleSuggestion {
  title: string
  description: string
  tags: string[] // Array of tags for the blog post
}

export interface LandingContent {
  hero: {
    title: string
    description: string
    primaryCta: {
      text: string
      link: string
    }
    secondaryCta: {
      text: string
      link: string
    }
  }
  mainFeatures: Array<{
    id: number
    icon: string
    title: string
    description: string
    image: string
  }>
  featureTitle: string
  featureDescription: string
  features: Array<{
    title: string
    description: string
    icon: string
  }>
  cta: {
    title: string
    description: string
    button: {
      text: string
      link: string
    }
  }
  faqs: {
    title: string
    description: string
    questions: Array<{
      question: string
      answer: string
    }>
  }
  pricing: {
    title: string
    description: string
    plans: Array<{
      name: string
      price: string
      description: string
      features: string[]
      cta: {
        text: string
        link: string
      }
      highlighted?: boolean
    }>
  }
}
