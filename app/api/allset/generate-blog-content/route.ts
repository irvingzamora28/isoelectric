import { NextRequest, NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'
import { llmService } from '@/lib/llm'
import siteMetadata from '@/data/siteMetadata'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function POST(request: NextRequest) {
  try {
    // Extract title and description from request body
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Get information about existing blog posts for internal linking
    const existingPosts = allBlogs
      .filter((post) => !post.draft)
      .map((post) => ({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        tags: post.tags,
      }))
      .slice(0, 5) // Limit to 5 posts for context

    // Format existing posts information
    const existingPostsInfo =
      existingPosts.length > 0
        ? existingPosts
            .map((post) => `- "${post.title}" (slug: ${post.slug}) - ${post.summary}`)
            .join('\n')
        : 'No existing posts yet.'

    // Always use the site's language setting
    const contentLanguage = siteMetadata.language
    console.log(`API: Generating blog content in site language: ${contentLanguage}`)

    // Generate blog content using LLM service
    const result = await llmService.generateBlogContent(
      title,
      description,
      existingPostsInfo,
      contentLanguage
    )
    console.log(result)

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }

    // Clean up the content to ensure it's not wrapped in JSON
    let cleanContent = result.content

    try {
      const trimmedContent = cleanContent.trim()

      // First, check if content is a JSON array (like in your example)
      if (trimmedContent.startsWith('[') && trimmedContent.endsWith(']')) {
        try {
          const parsedArray = JSON.parse(trimmedContent)

          // Check if it's an array with objects that have blog_post field
          if (Array.isArray(parsedArray) && parsedArray.length > 0) {
            // Case 1: Array with objects that have blog_post field
            if (parsedArray[0] && typeof parsedArray[0] === 'object' && parsedArray[0].blog_post) {
              cleanContent = parsedArray[0].blog_post
              console.log('API: Extracted content from JSON array with blog_post object')
              return NextResponse.json({
                success: true,
                content: cleanContent,
              })
            }
            // Case 2: Array with a single string
            else if (typeof parsedArray[0] === 'string') {
              cleanContent = parsedArray[0]
              console.log('API: Extracted content from JSON array with string')
              return NextResponse.json({
                success: true,
                content: cleanContent,
              })
            }
          }
        } catch (arrayError) {
          console.log('API: Failed to parse as JSON array:', arrayError)

          // If JSON parsing fails, try regex extraction for the common array format
          const arrayObjectPattern = /\[\s*{\s*"blog_post"\s*:\s*"([\s\S]+?)"\s*}\s*\]/
          const arrayObjectMatch = trimmedContent.match(arrayObjectPattern)

          if (arrayObjectMatch && arrayObjectMatch[1]) {
            cleanContent = arrayObjectMatch[1]
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '')
              .replace(/\\"([^"]*)\\"/g, '"$1"')
            console.log('API: Extracted content from array object pattern using regex')
            return NextResponse.json({
              success: true,
              content: cleanContent,
            })
          }
        }
      }

      // Check if the content looks like a JSON object
      if (trimmedContent.startsWith('{')) {
        try {
          // Try to parse as JSON
          const parsedContent = JSON.parse(trimmedContent)

          // Look for common content field names
          const contentField =
            parsedContent.blog_post ||
            parsedContent.content ||
            parsedContent.markdown ||
            parsedContent.text ||
            parsedContent.body ||
            parsedContent.post

          if (contentField) {
            cleanContent = contentField
            console.log('API: Extracted content from JSON object structure')
          } else {
            // If no known field found, check all fields for markdown-like content
            for (const key in parsedContent) {
              const value = parsedContent[key]
              if (
                typeof value === 'string' &&
                (value.includes('#') ||
                  value.includes('##') ||
                  value.includes('*') ||
                  value.includes('-'))
              ) {
                cleanContent = value
                console.log(`API: Extracted content from JSON field: ${key}`)
                break
              }
            }
          }
        } catch (jsonError) {
          console.log('API: Failed to parse as JSON object:', jsonError)

          // If JSON parsing fails, try regex extraction
          // First try to extract from array format
          const arrayPattern = /\[\s*{\s*"blog_post"\s*:\s*"([\s\S]+?)"\s*}\s*\]/
          const arrayMatch = trimmedContent.match(arrayPattern)

          if (arrayMatch && arrayMatch[1]) {
            cleanContent = arrayMatch[1]
              .trim()
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '')
              .replace(/\\\\n/g, '\n')
              .replace(/\\\\r/g, '')
              .replace(/\\"([^"]*)\\"/g, '"$1"')
            console.log('API: Extracted content from array pattern using regex')
          } else {
            // Try other field names with regex
            const fieldNames = ['blog_post', 'content', 'markdown', 'text', 'body', 'post']

            for (const field of fieldNames) {
              const pattern1 = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]+?)"(?=\\s*[,}])`)
              const pattern2 = new RegExp(`"${field}"\\s*:\\s*([\\s\\S]+?)(?=\\s*[,}])`)

              const match1 = trimmedContent.match(pattern1)
              const match2 = trimmedContent.match(pattern2)
              const contentMatch = match1 || match2

              if (contentMatch && contentMatch[1]) {
                cleanContent = contentMatch[1]
                  .trim()
                  .replace(/^"(.*)"$/g, '$1')
                  .replace(/\\n/g, '\n')
                  .replace(/\\r/g, '')
                  .replace(/\\\\n/g, '\n')
                  .replace(/\\\\r/g, '')
                  .replace(/\\"([^"]*)\\"/g, '"$1"')
                console.log(`API: Extracted content from '${field}' field using regex`)
                break
              }
            }
          }
        }
      }
    } catch (error) {
      console.log('API: Error cleaning content, using original:', error)
    }

    return NextResponse.json({
      success: true,
      content: cleanContent,
    })
  } catch (error: unknown) {
    console.error('Error generating blog content:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while generating blog content',
      },
      { status: 500 }
    )
  }
}
