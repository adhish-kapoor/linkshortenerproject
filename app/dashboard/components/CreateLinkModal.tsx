'use client'

import { useState } from 'react'
import { createLink } from './actions'
import { Button } from '@/components/ui/button'

interface CreateLinkModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const result = await createLink({
      originalUrl: url,
      title,
      description: description || undefined,
    })

    if (!result.success) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setSuccess(true)
    setUrl('')
    setTitle('')
    setDescription('')
    setIsLoading(false)

    setTimeout(() => {
      onClose()
      setSuccess(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Create Shortened Link</h2>
        <p className="mb-6 text-sm text-gray-500">Fill in the details below to create a new shortened link</p>

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Link created successfully!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-gray-900 mb-2">
              URL to Shorten <span className="text-red-500">*</span>
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              required
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">Enter the long URL you want to shorten</p>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Blog Post"
              required
              maxLength={255}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">Give your link a memorable name</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about where this link goes or what it's for"
              maxLength={500}
              rows={3}
              className="w-full rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
              disabled={isLoading}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">Add a description to remember this link</p>
              <p className={`text-xs font-medium ${description.length > 450 ? 'text-orange-600' : 'text-gray-400'}`}>
                {description.length}/500
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m10-10H2" />
                  </svg>
                  Creating...
                </span>
              ) : (
                'Create Link'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
