'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BlogTitleSuggestion } from '@/lib/llm/types'

interface BlogTitleGeneratorProps {
  onTitleSelected?: (title: string, description: string) => void
}

export default function BlogTitleGenerator({ onTitleSelected }: BlogTitleGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generationMessage, setGenerationMessage] = useState('')
  const [titleSuggestions, setTitleSuggestions] = useState<BlogTitleSuggestion[]>([])
  const router = useRouter()

  const handleGenerate = async () => {
    setError('')
    setGenerationMessage('')
    setIsGenerating(true)
    setTitleSuggestions([])

    try {
      const response = await fetch('/api/allset/generate-blog-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate blog titles')
      }

      const data = await response.json()

      if (data.success) {
        setGenerationMessage('Blog title suggestions generated successfully!')
        setTitleSuggestions(data.titles)
      } else {
        throw new Error(data.message || 'Failed to generate blog titles')
      }
    } catch (err: unknown) {
      console.error('Error generating blog titles:', err)
      setError(
        err instanceof Error ? err.message : 'An error occurred while generating blog titles'
      )
    } finally {
      setIsGenerating(false)
    }
  }

  // Track which title is currently being generated
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState('')

  const handleTitleSelect = (title: string, description: string, tags: string[]) => {
    if (onTitleSelected) {
      onTitleSelected(title, description)
    } else {
      // Navigate to new post page with title, description, and tags as query params
      const params = new URLSearchParams({
        title,
        summary: description,
        tags: tags.join(','), // Convert tags array to comma-separated string
      })
      router.push(`/allset/posts/new?${params.toString()}`)
    }
  }

  const handleGenerateContent = async (title: string, description: string, tags: string[]) => {
    setSelectedTitle(title)
    setIsGeneratingContent(true)
    setError('')

    try {
      // Show generating message
      setGenerationMessage('Creating blog post with AI content...')

      const response = await fetch('/api/allset/generate-blog-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate blog content')
      }

      const data = await response.json()

      if (data.success) {
        // Parse the content if it's in JSON format
        const content = data.content

        // No need to clean JSON here - it's already cleaned in the API endpoint

        // For small content (< 2000 chars), pass directly in URL to avoid storage issues
        if (content.length < 2000) {
          console.log('Content is small, passing directly in URL')
          const params = new URLSearchParams({
            title: title,
            summary: description,
            tags: tags.join(','), // Include tags
            content: content, // Pass small content directly
          })
          router.push(`/allset/posts/new?${params.toString()}`)
          return
        }

        // For larger content, use storage methods
        try {
          // Try to store in sessionStorage first, then localStorage as fallback
          let storageSuccessful = false

          try {
            console.log('Storing content in sessionStorage, length:', content.length)
            sessionStorage.setItem('generatedBlogContent', content)
            storageSuccessful = true
          } catch (storageError) {
            console.log('SessionStorage failed, trying localStorage')
            try {
              localStorage.setItem('generatedBlogContent', content)
              storageSuccessful = true
            } catch (localStorageError) {
              console.error('Both storage methods failed:', localStorageError)
              throw new Error('Could not store content in browser storage')
            }
          }

          if (storageSuccessful) {
            // Only pass the title and summary in URL parameters
            const params = new URLSearchParams({
              title: title,
              summary: description,
              tags: tags.join(','), // Include tags
              hasContent: 'true', // Flag to indicate content is available in storage
            })

            // Navigate to the new post page
            router.push(`/allset/posts/new?${params.toString()}`)
          }
        } catch (storageError) {
          // Handle storage errors
          console.error('Failed to store content:', storageError)
          throw new Error(
            'The generated content is too large to transfer. Please try again with a shorter title.'
          )
        }
      } else {
        throw new Error(data.message || 'Failed to generate blog content')
      }
    } catch (err: unknown) {
      console.error('Error generating blog content:', err)
      setError(
        err instanceof Error ? err.message : 'An error occurred while generating blog content'
      )
      setIsGeneratingContent(false) // Only reset if there's an error
    }
  }

  // No longer needed as we navigate directly from handleGenerateContent

  return (
    <div className="mb-6 rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold">SEO Blog Title Generator</h2>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Generate SEO-optimized blog title suggestions based on your landing page content.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-red-800 dark:text-red-400">{error}</div>
          </div>
        </div>
      )}

      {generationMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-green-800 dark:text-green-400">
              {generationMessage}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Generating...
            </>
          ) : (
            'Generate Blog Title Suggestions'
          )}
        </button>
      </div>

      {titleSuggestions.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">Suggested Blog Titles:</h3>
          <ul className="space-y-4">
            {titleSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="rounded-md border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <h4 className="mb-1 text-base font-medium">{suggestion.title}</h4>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  {suggestion.description}
                </p>
                <div className="mb-3 flex flex-wrap gap-1">
                  {suggestion.tags &&
                    suggestion.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      handleTitleSelect(
                        suggestion.title,
                        suggestion.description,
                        suggestion.tags || []
                      )
                    }
                    className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 rounded-md px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  >
                    Use Title Only
                  </button>
                  <button
                    onClick={() =>
                      handleGenerateContent(
                        suggestion.title,
                        suggestion.description,
                        suggestion.tags || []
                      )
                    }
                    disabled={isGeneratingContent && selectedTitle === suggestion.title}
                    className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-3 py-1 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                  >
                    {isGeneratingContent && selectedTitle === suggestion.title ? (
                      <>
                        <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        Creating Post...
                      </>
                    ) : (
                      'Create Post with AI'
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
