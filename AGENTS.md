# Link Shortener Project - Agent Instructions

This document defines coding standards and conventions for AI agents working on this project. All code must adhere to these standards for consistency and maintainability.

---

## Project Overview

**Link Shortener** is a modern web application built with:
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Framework**: React 19 with shadcn/ui
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Clerk
- **Icons**: Lucide React

---

## Quick Reference

### Technology Stack
- Node.js runtime
- TypeScript (strict mode)
- ESLint for code quality
- Next.js 16 with App Router (not Pages Router)
- PostgreSQL with Drizzle ORM
- Tailwind CSS for styling

### Key Commands
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
```

---

## Critical Rules

### 0. **ALWAYS Read Documentation First**
- **Before writing ANY code**, read the relevant `.md` file in the `/docs` directory
- Read [docs/authentication.md](docs/authentication.md) before implementing authentication features
- Read [docs/shadcn-ui.md](docs/shadcn-ui.md) before using UI components
- This is non-negotiable — documentation defines standards and patterns
- Failure to follow this will result in code that doesn't meet project standards

### 1. **TypeScript Strict Mode**
- All code must compile with `strict: true`
- No `any` types (use `unknown` when appropriate)
- Always define explicit types for functions and data structures

### 2. **Next.js App Router Only**
- Use App Router (`app/` directory), NOT Pages Router
- Server Components are the default; use `'use client'` only when necessary
- Server-side data fetching in Server Components

### 3. **Server Components by Default**
- Prefer Server Components for data fetching and rendering
- Keep Client Components small and focused
- Pass minimal data to Client Components

### 4. **No Custom CSS**
- Styling is Tailwind CSS only
- No CSS modules, inline styles, or CSS-in-JS libraries
- Use `clsx` for conditional styles

### 5. **Authentication Required**
- All API routes must authenticate with Clerk
- Check authentication before performing operations
- Return `401` for unauthenticated requests

### 6. **Database Operations**
- Use Drizzle ORM exclusively
- All queries must be type-safe
- Follow schema naming conventions (snake_case in database)

### 7. **Error Handling**
- Always use try/catch for async operations
- Return appropriate HTTP status codes
- Never expose sensitive information in error messages

---

## Detailed Guides

**⚠️ MANDATORY: READ DOCUMENTATION BEFORE WRITING CODE ⚠️**

Each aspect of development has detailed documentation in the `/docs` directory. **You MUST read the relevant guide BEFORE implementing any features.** This is non-negotiable and critical to code quality.

**ALWAYS refer to the relevant .md file BEFORE generating any code:**

- **[Authentication (docs/authentication.md)](docs/authentication.md)** — Clerk setup, protected routes, user authentication flows, sign-in/sign-up modals, and authorization patterns
- **[shadcn/ui Components (docs/shadcn-ui.md)](docs/shadcn-ui.md)** — Component standards, installation, usage patterns, icons with Lucide React, and forbidden practices

If the documentation isn't followed, code will be rejected and require rewrites. Always prioritize reading docs over making assumptions.

---

## Development Workflow

### 1. **Planning**
- **CRITICAL: Read the relevant documentation in `/docs` FIRST** — before any planning or coding
- Understand the feature requirements
- Plan file structure and component hierarchy
- Review existing code patterns in the codebase

### 2. **Implementation**
- Create components/modules following the standards
- Write TypeScript with strict types
- Use Tailwind CSS for styling
- Handle errors appropriately

### 3. **Testing**
- Test TypeScript compilation: `npm run build`
- Lint code: `npm run lint`
- Test in browser (dev server: `npm run dev`)
- Test on mobile viewport

### 4. **Git Workflow**
- Create feature branch: `git checkout -b feature/description`
- Commit regularly with conventional commit messages
- Push branch and create Pull Request

---

## Code Examples

### Server Component with Data Fetching
```typescript
// app/dashboard/page.tsx
import { getAuth } from '@clerk/nextjs/server'
import { db } from '@/db'

export default async function DashboardPage() {
  const { userId } = await getAuth()
  
  if (!userId) {
    return <div>Not authenticated</div>
  }

  const links = await db.query.links.findMany({
    where: (links, { eq }) => eq(links.userId, userId),
  })

  return (
    <div className="space-y-4 p-6">
      {links.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  )
}
```

### Client Component with Interactivity
```typescript
// components/LinkForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface LinkFormProps {
  onSubmit: (data: CreateLinkData) => Promise<void>
}

export function LinkForm({ onSubmit }: LinkFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({ url })
      setUrl('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        className="w-full px-4 py-2 border rounded-lg"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Link'}
      </Button>
    </form>
  )
}
```

### API Route with Error Handling
```typescript
// app/api/links/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { db } from '@/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getAuth(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const link = await db.insert(links).values({
      originalUrl: url,
      userId,
      shortCode: generateShortCode(),
    }).returning()

    return NextResponse.json(link[0], { status: 201 })
  } catch (error) {
    console.error('POST /api/links error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

---

## Common Pitfalls to Avoid

1. **Using `any` type** — Always be explicit with types
2. **Client Components by default** — Use Server Components unless interactivity needed
3. **Custom CSS** — Use Tailwind utilities only
4. **Unhandled promises** — Always use try/catch or `.catch()`
5. **Skipping authentication** — Check auth on all protected endpoints
6. **Long prop drilling** — Use composition or context for deeply nested data
7. **Direct CSS imports** — Globals only in `app/layout.tsx`
8. **Missing error boundaries** — Wrap page/feature sections in error.tsx
9. **N+1 queries** — Use SQL joins, not multiple queries
10. **No types for API responses** — Define response types explicitly

---

## Breaking Changes in This Next.js Version

This project uses **Next.js 16.2.4** which has breaking changes from earlier versions. Important notes:

- **App Router**: All routing happens in `app/` directory
- **Server Components**: Default behavior; use `'use client'` explicitly for interactivity
- **No `pages/` directory**: Use `app/` instead
- **Automatic trailing slashes**: Configure in `next.config.ts` if needed
- **Image Optimization**: Use `next/image` Image component

Always check the Next.js docs in `node_modules/next/dist/docs/` for API details.

---

## Questions or Clarifications?

When in doubt:
1. **ALWAYS check the relevant guide in `docs/` FIRST** — documentation has the answers
2. Review similar existing code in the codebase
3. Test TypeScript compilation: `npm run build`
4. Lint to catch errors: `npm run lint`

**Remember**: Reading the `/docs` directory files BEFORE writing code is non-negotiable. This is the single most important rule for maintaining code quality and consistency.

---

**Last Updated**: May 2026
