/**
 * OpenAI provider for the LLM service
 */

import OpenAI from 'openai'
import { LLMProvider, LLMResponse } from '../types'

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI
  private model: string

  constructor(apiKey: string, model: string = 'gpt-3.5-turbo') {
    this.client = new OpenAI({ apiKey })
    this.model = model
  }

  async generateContent(prompt: string): Promise<LLMResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a professional landing page content creator.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      })

      const content = response.choices[0]?.message?.content || ''

      return { content }
    } catch (error: Error | unknown) {
      console.error('Openai error:', error)
      return {
        content: '',
        error:
          error instanceof Error
            ? error.message || 'An error occurred while generating content with Openai'
            : 'An error occurred while generating content with Openai',
      }
    }
  }
}
