import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    // Decode the slug to handle spaces and special characters
    const decodedSlug = decodeURIComponent(slug)

    if (!decodedSlug) {
      return NextResponse.json(
        { success: false, message: 'Post slug is required' },
        { status: 400 }
      )
    }

    // Find the post file path
    const blogDir = path.join(process.cwd(), 'data', 'blog')
    const files = await fs.readdir(blogDir)

    // Look for the file that contains the post with the given slug
    let postFilePath: string | null = null
    for (const file of files) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const filePath = path.join(blogDir, file)
        const content = await fs.readFile(filePath, 'utf-8')

        // Check if the file contains the slug
        // This is a simple check - in a real app, you might want to parse the frontmatter properly
        if (
          content.includes(`slug: ${decodedSlug}`) ||
          content.includes(`slug: "${decodedSlug}"`) ||
          content.includes(`slug: '${decodedSlug}'`) ||
          file === `${decodedSlug}.mdx` ||
          file === `${decodedSlug}.md` ||
          file === `${decodedSlug.replace(/ /g, '-')}.mdx` ||
          file === `${decodedSlug.replace(/ /g, '-')}.md`
        ) {
          postFilePath = filePath
          break
        }
      }
    }

    if (!postFilePath) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 })
    }

    // Delete the file
    await fs.unlink(postFilePath)

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'An error occurred while deleting the post',
      },
      { status: 500 }
    )
  }
}
