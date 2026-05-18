'use client'

import { useState } from 'react'
import { CreateLinkModal } from './CreateLinkModal'
import { Button } from '@/components/ui/button'

interface Link {
  id: string
  title: string | null
  originalUrl: string
  description: string | null
  shortCode: string
}

interface DashboardContentProps {
  userLinks: Link[]
}

export function DashboardContent({ userLinks }: DashboardContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Links</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            Create Link
          </Button>
        </div>

        {userLinks.length === 0 ? (
          <div className="rounded-lg border border-gray-200 p-6 text-center text-gray-500">
            <p>No links yet. Create your first shortened link!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="font-semibold text-foreground">
                    {link.title ?? 'Untitled'}
                  </div>
                  <div className="mt-1 truncate text-sm text-muted-foreground">
                    {link.originalUrl}
                  </div>
                  {link.description && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {link.description}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <div className="rounded-md bg-blue-100 px-3 py-1 text-sm font-mono text-blue-900">
                    {link.shortCode}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
