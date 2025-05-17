import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateFrontmatter } from '@/lib/utils/frontmatter'

// For static export, we need to handle this differently
export const dynamic = 'error'

interface PostData {
  title: string
  slug: string
  date: string
  tags?: string[]
  authors?: string[]
  draft?: boolean
  summary: string
  content: string
  originalSlug: string // The original slug to identify which file to update
}

export async function POST(request: NextRequest) {
  try {
    const postData = (await request.json()) as PostData

    // Validate required fields
    if (
      !postData.title ||
      !postData.slug ||
      !postData.date ||
      !postData.summary ||
      !postData.originalSlug
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find the original file
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    const files = await fs.readdir(blogDir)

    // Look for the file that matches the original slug
    let originalFilePath: string | null = null
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        // Check if the filename contains the slug
        if (file.includes(postData.originalSlug)) {
          originalFilePath = path.join(blogDir, file)
          break
        }
      }
    }

    if (!originalFilePath) {
      return NextResponse.json(
        { success: false, message: 'Original post not found' },
        { status: 404 }
      )
    }

    // Determine the new file path if slug has changed
    let newFilePath = originalFilePath
    if (postData.slug !== postData.originalSlug) {
      // Create a new filename based on the new slug
      const fileExtension = path.extname(originalFilePath)
      newFilePath = path.join(blogDir, `${postData.slug}${fileExtension}`)

      // Check if a file with the new slug already exists
      try {
        await fs.access(newFilePath)
        // If we get here, the file exists
        return NextResponse.json(
          { success: false, message: 'A post with this slug already exists' },
          { status: 400 }
        )
      } catch (error) {
        // File doesn't exist, which is what we want
      }
    }

    // Generate frontmatter using our utility function
    const frontmatterContent = generateFrontmatter(postData)

    // Combine frontmatter with content
    const frontmatter = [
      frontmatterContent,
      '',
      postData.content || '# Updated Post\n\nThis post has been updated.',
    ].join('\\n')

    // If the slug has changed, we need to create a new file and delete the old one
    if (postData.slug !== postData.originalSlug) {
      // Write the new file
      await fs.writeFile(newFilePath, frontmatter.replace(/\\n/g, '\n'))

      // Delete the old file
      await fs.unlink(originalFilePath)
    } else {
      // Just update the existing file
      await fs.writeFile(originalFilePath, frontmatter.replace(/\\n/g, '\n'))
    }

    return NextResponse.json({
      success: true,
      slug: postData.slug,
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
