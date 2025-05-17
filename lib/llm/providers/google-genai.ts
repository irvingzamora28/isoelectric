/**
 * Google Gemini provider for the LLM service
 */

import { GoogleGenAI } from '@google/genai'
import { LLMProvider, LLMResponse } from '../types'

export class GoogleGenAIProvider implements LLMProvider {
  private client: GoogleGenAI
  private model: string

  constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
    this.client = new GoogleGenAI({ apiKey })
    this.model = model
  }

  async generateContent(prompt: string): Promise<LLMResponse> {
    try {
      const result = await this.client.models.generateContent({
        model: this.model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.7,
          maxOutputTokens: 4000,
          responseMimeType: 'application/json',
        },
      })

      const content = result.text || ''

      return { content }
    } catch (error: Error | unknown) {
      console.error('Google Gemini error:', error)
      return {
        content: '',
        error:
          error instanceof Error
            ? error.message || 'An error occurred while generating content with Google Gemini'
            : 'An error occurred while generating content with Google Gemini',
      }
    }
  }
}
