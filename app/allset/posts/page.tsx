'use client'

import { useState } from 'react'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs, Blog } from 'contentlayer/generated'
import Link from 'next/link'
import BlogTitleGenerator from './components/BlogTitleGenerator'
// Using a simple date formatter function instead of date-fns to avoid dependency issues
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Define the type for the core content
type CoreContent = ReturnType<typeof allCoreContent<Blog>>[0]

export default function PostsPage() {
  // Get all blog posts and sort them by date
  const [posts, setPosts] = useState<CoreContent[]>(() => allCoreContent(sortPosts(allBlogs)))
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [deleteSuccess, setDeleteSuccess] = useState('')
  const [postToDelete, setPostToDelete] = useState<string | null>(null)

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!postToDelete) return

    setIsDeleting(true)
    setDeleteError('')
    setDeleteSuccess('')

    try {
      const response = await fetch('/api/allset/posts/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: postToDelete }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to delete post')
      }

      // Remove the deleted post from the list
      setPosts(posts.filter((post) => post.slug !== postToDelete))
      setDeleteSuccess(`Post deleted successfully!`)
      setPostToDelete(null)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess('')
      }, 3000)
    } catch (error) {
      console.error('Error deleting post:', error)
      setDeleteError(
        error instanceof Error ? error.message : 'An error occurred while deleting the post'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Posts</h1>

      {deleteError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-red-800 dark:text-red-400">{deleteError}</div>
          </div>
        </div>
      )}

      {deleteSuccess && (
        <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
          <div className="flex">
            <div className="text-sm font-medium text-green-800 dark:text-green-400">
              {deleteSuccess}
            </div>
          </div>
        </div>
      )}

      {/* Blog Title Generator */}
      <BlogTitleGenerator />

      <div className="rounded-lg bg-slate-100 p-6 shadow-md dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Posts</h2>
          <Link
            href="/allset/posts/new"
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Add New Post
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-slate-100 dark:divide-gray-700 dark:bg-gray-800">
              {posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No posts found
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.path}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-800 dark:text-white">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {post.authors && post.authors.length > 0
                          ? post.authors.join(', ')
                          : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {post.date ? formatDate(post.date) : 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                          post.draft !== true
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}
                      >
                        {post.draft !== true ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <Link
                        href={`/allset/posts/edit?slug=${encodeURIComponent(post.slug || '')}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Edit
                      </Link>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                      <Link
                        href={`/blog/${encodeURIComponent(post.slug || '')}`}
                        target="_blank"
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                      <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                      <button
                        onClick={() => setPostToDelete(post.slug || '')}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {postToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-90"></div>
            </div>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle dark:bg-gray-800">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Delete Post
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this post? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:col-start-2 sm:text-sm"
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  type="button"
                  className="focus:ring-primary-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:col-start-1 sm:mt-0 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  onClick={() => setPostToDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
