'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { allBlogs, Blog } from 'contentlayer/generated'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

// Component that uses useSearchParams
// Helper function to format date for the input field
function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return new Date().toISOString().split('T')[0]

  // Remove any quotes and time portion
  return dateString.replace(/["']/g, '').split('T')[0]
}

function EditPostContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Get the slug and decode it to handle spaces and special characters
  const encodedSlug = searchParams.get('slug')
  const slug = encodedSlug ? decodeURIComponent(encodedSlug) : null

  const [post, setPost] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const initializedRef = useRef(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: '',
    tags: '',
    authors: '',
    draft: false,
    summary: '',
    content: '',
    originalSlug: '', // Keep track of the original slug for the API
  })

  useEffect(() => {
    if (!slug) {
      router.push('/allset/posts')
      return
    }

    // Prevent re-initialization if already done
    if (initializedRef.current) return

    // Find the post with the matching slug
    const foundPost = allBlogs.find((p) => p.slug === slug)

    if (foundPost) {
      setPost(foundPost)

      // Initialize form data from the post
      // Format the date properly for the input field
      const formattedDate = formatDateForInput(foundPost.date)

      setFormData({
        title: foundPost.title,
        slug: foundPost.slug || '',
        date: formattedDate,
        tags: foundPost.tags?.join(', ') || '',
        authors: foundPost.authors?.join(', ') || '',
        draft: foundPost.draft || false,
        summary: foundPost.summary || '',
        content: foundPost.body.raw || '',
        originalSlug: foundPost.slug || '', // Store the original slug
      })

      // Mark as initialized
      initializedRef.current = true
    } else {
      // Redirect to posts page if post not found
      router.push('/allset/posts')
    }

    setLoading(false)
  }, [slug, router])

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  // Handle title change and auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const newSlug = value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single one

    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: newSlug,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Prepare the data
      const postData = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        authors: formData.authors
          .split(',')
          .map((author) => author.trim())
          .filter(Boolean),
      }

      // Send the request
      const response = await fetch('/api/allset/posts/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update post')
      }

      const data = await response.json()

      setSuccess('Post updated successfully!')

      // Refresh the page after a short delay if the slug changed
      if (data.slug !== formData.originalSlug) {
        setTimeout(() => {
          router.push(`/allset/posts/edit?slug=${encodeURIComponent(data.slug)}`)
        }, 1500)
      }
    } catch (error) {
      console.error('Error updating post:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while updating the post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="border-t-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-slate-300"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/30">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-400">Post not found</h2>
        <p className="mt-2 text-red-700 dark:text-red-300">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <div className="mt-4">
          <Link
            href="/allset/posts"
            className="rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
          >
            Back to Posts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Post: {post.title}</h1>
        <Link
          href="/allset/posts"
          className="rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
        >
          Back to Posts
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-red-800 dark:text-red-400">{error}</div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-green-800 dark:text-green-400">{success}</div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter post title"
              value={formData.title}
              onChange={handleTitleChange}
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="enter-post-slug"
              value={formData.slug}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="tag1, tag2, tag3"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="authors"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Authors (comma separated)
            </label>
            <input
              type="text"
              id="authors"
              name="authors"
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Author 1, Author 2"
              value={formData.authors}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="draft"
              name="draft"
              className="focus:ring-primary-500 text-primary-600 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              checked={formData.draft}
              onChange={handleCheckboxChange}
            />
            <label
              htmlFor="draft"
              className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Draft
            </label>
          </div>

          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter post summary"
              value={formData.summary}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content (Markdown)
            </label>
            <textarea
              id="content"
              name="content"
              rows={15}
              className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 font-mono shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Enter post content in Markdown format"
              value={formData.content}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href={`/blog/${encodeURIComponent(post.slug || '')}`}
              target="_blank"
              className="rounded-md bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
            >
              View Post
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

// Main page component with Suspense boundary
export default function EditPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostContent />
    </Suspense>
  )
}
