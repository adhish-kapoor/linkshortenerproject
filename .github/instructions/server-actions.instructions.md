---
description: This file describes the Server Actions pattern and requirements for data mutations in the project.
applyTo: '**'
---

## Server Actions Strategy

This document outlines how to handle data mutations in the Link Shortener application using Next.js Server Actions. All data modifications must be performed via Server Actions to maintain security, type safety, and proper separation of concerns.

## 1. Core Principle

**ALL data mutations in this app must be done via Server Actions.** Server Actions are called from Client Components to safely perform database operations on the server while maintaining client-side interactivity.

This ensures:
- Direct server execution without API routes
- Automatic CSRF protection
- Type-safe communication between client and server
- Centralized validation and authentication
- Simplified error handling

## 2. File Organization and Colocation

Server Action files **MUST be named `actions.ts`** and **must be colocated in the directory of the component that calls them**.

```
app/
  dashboard/
    components/
      CreateLinkForm.tsx      # Client component
      actions.ts              # Server actions for CreateLinkForm
    page.tsx
  links/
    components/
      LinkCard.tsx            # Client component
      actions.ts              # Server actions for LinkCard
```

**Benefits of colocation:**
- Clear relationship between client components and their server actions
- Easy to locate related code
- Prevents circular dependencies
- Logical file organization by feature

## 3. TypeScript Types for Server Action Parameters

**ALL data passed to Server Actions must have appropriate TypeScript types.** DO NOT use the `FormData` TypeScript type. Define explicit interfaces or types for all parameters.

```typescript
// ❌ INCORRECT - using FormData
export async function createLink(formData: FormData) {
  const url = formData.get('url')
  // ...
}

// ✅ CORRECT - using explicit types
interface CreateLinkInput {
  originalUrl: string
  title?: string
}

export async function createLink(input: CreateLinkInput) {
  const { originalUrl, title } = input
  // ...
}
```

Define types in the same file or in a shared types file:

```typescript
// app/dashboard/components/actions.ts
'use server'

import { z } from 'zod'
import { getAuth } from '@clerk/nextjs/server'
import { createLinkHelper } from '@/data/links'

interface CreateLinkInput {
  originalUrl: string
  title?: string
}

export async function createLink(input: CreateLinkInput) {
  // Implementation
}
```

## 4. Zod Validation

**ALL data MUST be validated in Server Actions via Zod.** Use Zod schemas to validate input before processing.

```typescript
// app/dashboard/components/actions.ts
'use server'

import { z } from 'zod'
import { getAuth } from '@clerk/nextjs/server'
import { createLinkHelper } from '@/data/links'

const createLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL'),
  title: z.string().optional(),
})

interface CreateLinkInput extends z.infer<typeof createLinkSchema> {}

export async function createLink(input: CreateLinkInput) {
  // Validate input
  const validatedInput = createLinkSchema.parse(input)
  
  if (!validatedInput.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { userId } = await getAuth()
  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  const result = await createLinkHelper(userId, validatedInput)
  return result
}
```

Handle validation errors gracefully:

```typescript
export async function createLink(input: CreateLinkInput) {
  try {
    const validatedInput = createLinkSchema.parse(input)
    // Continue with operation
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0].message 
      }
    }
    return { success: false, error: 'Validation failed' }
  }
}
```

## 5. Authentication Check

**ALL Server Actions MUST first check for a logged in user before continuing with any database operations.**

```typescript
'use server'

import { getAuth } from '@clerk/nextjs/server'

export async function deleteLink(linkId: string) {
  // ✅ ALWAYS check authentication first
  const { userId } = await getAuth()
  
  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  // Then proceed with validation and database operations
  if (!linkId) {
    return { success: false, error: 'Link ID is required' }
  }

  // Database operations...
}
```

## 6. No Throwing Errors

**Server Actions MUST NOT throw errors.** Always return an object with either a `success` property (for successful operations) or an `error` property (for failed operations). This ensures proper error handling and type safety on the client side.

```typescript
// ❌ INCORRECT - throwing errors
'use server'
export async function deleteLink(linkId: string) {
  if (!linkId) {
    throw new Error('Link ID is required')  // ❌ DON'T THROW
  }
  // ...
}

// ✅ CORRECT - returning error objects
'use server'
export async function deleteLink(linkId: string) {
  if (!linkId) {
    return { success: false, error: 'Link ID is required' }  // ✅ RETURN ERROR OBJECT
  }
  // ...
}
```

## 7. Database Operations via Helper Functions

**Database operations must be done via helper functions located in the `/data` directory.** Server Actions should NOT directly use Drizzle queries.

Helper functions in `/data/` wrap Drizzle queries and handle all database logic:

```typescript
// data/links.ts
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function createLinkHelper(
  userId: string,
  data: { originalUrl: string; title?: string }
) {
  try {
    const result = await db.insert(links).values({
      userId,
      originalUrl: data.originalUrl,
      title: data.title,
      shortCode: generateShortCode(),
    }).returning()

    return { success: true, data: result[0] }
  } catch (error) {
    console.error('createLinkHelper error:', error)
    return { success: false, error: 'Failed to create link' }
  }
}

export async function deleteLinkHelper(userId: string, linkId: string) {
  try {
    const link = await db.query.links.findFirst({
      where: (links, { eq, and }) =>
        and(eq(links.id, linkId), eq(links.userId, userId))
    })

    if (!link) {
      return { success: false, error: 'Link not found' }
    }

    await db.delete(links).where(eq(links.id, linkId))
    return { success: true }
  } catch (error) {
    console.error('deleteLinkHelper error:', error)
    return { success: false, error: 'Failed to delete link' }
  }
}

function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8)
}
```

Server Actions call these helpers:

```typescript
// app/dashboard/components/actions.ts
'use server'

import { z } from 'zod'
import { getAuth } from '@clerk/nextjs/server'
import { createLinkHelper, deleteLinkHelper } from '@/data/links'
import { revalidatePath } from 'next/cache'

const createLinkSchema = z.object({
  originalUrl: z.string().url('Invalid URL'),
  title: z.string().optional(),
})

interface CreateLinkInput extends z.infer<typeof createLinkSchema> {}

export async function createLink(input: CreateLinkInput) {
  const { userId } = await getAuth()
  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  try {
    const validatedInput = createLinkSchema.parse(input)
    const result = await createLinkHelper(userId, validatedInput)
    
    if (result.success) {
      revalidatePath('/dashboard')
    }
    
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'An error occurred' }
  }
}

export async function deleteLink(linkId: string) {
  const { userId } = await getAuth()
  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  try {
    const result = await deleteLinkHelper(userId, linkId)
    
    if (result.success) {
      revalidatePath('/dashboard')
    }
    
    return result
  } catch (error) {
    return { success: false, error: 'An error occurred' }
  }
}
```

## 8. Calling Server Actions from Client Components

Server Actions are imported and called from Client Components like regular async functions.

```typescript
// app/dashboard/components/CreateLinkForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createLink } from './actions'

export function CreateLinkForm() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await createLink({
      originalUrl: url,
    })

    if (!result.success) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    setUrl('')
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to shorten"
        type="url"
        required
        className="w-full px-4 py-2 border rounded-lg"
        disabled={isLoading}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Link'}
      </Button>
    </form>
  )
}
```

## 9. Return Values and Error Handling

Use consistent return types from Server Actions:

```typescript
type ServerActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; status?: number }

export async function createLink(input: CreateLinkInput): Promise<ServerActionResult<Link>> {
  const { userId } = await getAuth()
  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  try {
    const validatedInput = createLinkSchema.parse(input)
    const result = await createLinkHelper(userId, validatedInput)
    return result
  } catch (error) {
    console.error('createLink error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'An unexpected error occurred', status: 500 }
  }
}
```

## 10. Cache Revalidation

After successful mutations, revalidate affected pages:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createLinkHelper } from '@/data/links'

export async function createLink(input: CreateLinkInput) {
  const { userId } = await getAuth()
  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  try {
    const result = await createLinkHelper(userId, input)
    
    if (result.success) {
      revalidatePath('/dashboard')
      revalidatePath('/links')
    }
    
    return result
  } catch (error) {
    return { success: false, error: 'An error occurred' }
  }
}
```

## 11. File Structure Summary

```
app/
  actions/
    (shared server actions if needed)
  dashboard/
    components/
      CreateLinkForm.tsx
      actions.ts          # ← Server actions for dashboard components
    page.tsx
  links/
    components/
      LinkCard.tsx
      actions.ts          # ← Server actions for links components
    page.tsx

data/
  links.ts                # ← Database helper functions
  users.ts                # ← Database helper functions
  auth.ts                 # ← Database helper functions

components/
  ui/                     # ← UI components (no server actions here)
```

---

**Last Updated**: May 2026
