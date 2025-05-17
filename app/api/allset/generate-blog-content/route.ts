import { NextRequest, NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'
import { llmService } from '@/lib/llm'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function POST(request: NextRequest) {
  try {
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
    const existingPostsInfo = existingPosts
      .map((post) => `- "${post.title}" (slug: ${post.slug}) - ${post.summary}`)
      .join('\n')

    // Generate blog content using the LLM service
    const result = await llmService.generateBlogContent(title, description, existingPostsInfo)

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }

    // Clean up the content to ensure it's not wrapped in JSON
    let cleanContent = result.content

    try {
      // Check if the content looks like JSON
      if (cleanContent.trim().startsWith('{')) {
        try {
          // Try to parse as JSON
          const parsedContent = JSON.parse(cleanContent)

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
            console.log('API: Extracted content from JSON structure')
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
          // If JSON parsing fails, try regex extraction with multiple possible field names
          const fieldNames = ['blog_post', 'content', 'markdown', 'text', 'body', 'post']

          for (const field of fieldNames) {
            const pattern1 = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]+?)"(?=\\s*[,}])`)
            const pattern2 = new RegExp(`"${field}"\\s*:\\s*([\\s\\S]+?)(?=\\s*[,}])`)

            const match1 = cleanContent.match(pattern1)
            const match2 = cleanContent.match(pattern2)
            const contentMatch = match1 || match2

            if (contentMatch && contentMatch[1]) {
              cleanContent = contentMatch[1]
                .trim()
                .replace(/^"(.*)"$/g, '$1')
                .replace(/\\n/g, '\n')
              console.log(`API: Extracted content from '${field}' field using regex`)
              break
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
