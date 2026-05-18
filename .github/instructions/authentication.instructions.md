---
description: Read this file for all authentication standards and requirements for the Link Shortener application. This document defines how to implement authentication using Clerk, including protected routes, API route protection, and best practices.
---
# Authentication Documentation

This document defines all authentication standards and requirements for the Link Shortener application. All authentication must be handled exclusively through **Clerk** — no other auth methods are permitted.

---

## Overview

The Link Shortener application uses **Clerk** for complete authentication management. Clerk handles:
- User registration and sign-up
- User login and sign-in
- Session management
- User data and metadata
- Role-based access control (future)
- Social authentication (if enabled)

**Critical Rule**: All authentication logic must use Clerk. No custom auth implementations, JWT handling, or alternative auth methods are allowed.

---

## Setup and Configuration

### Clerk Provider

The root layout (`app/layout.tsx`) must wrap the entire application with `ClerkProvider`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Environment Variables

Required `.env.local` variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

These must be configured before development. Never commit these values — they should only exist in `.env.local`.

---

## Authentication UI Components

Clerk provides pre-built components that must always be used for authentication. These components automatically launch as modals and handle all authentication flows.

### SignInButton

Use `SignInButton` for user login. Always renders as a modal:

```typescript
import { SignInButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div>
      <SignInButton />
    </div>
  );
}
```

**Properties**:
- Launches modal overlay on click
- Handles sign-in form
- Redirects to authenticated route on success
- Customizable with `mode` prop

### SignUpButton

Use `SignUpButton` for new user registration. Always renders as a modal:

```typescript
import { SignUpButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div>
      <SignUpButton />
    </div>
  );
}
```

**Properties**:
- Launches modal overlay on click
- Handles registration form
- Social sign-up options (if enabled)
- Redirects to authenticated route on success

### UserButton

Use `UserButton` to display current user and provide sign-out:

```typescript
import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
```

**Properties**:
- `afterSignOutUrl`: URL to redirect after sign-out (required)
- Shows user avatar and profile menu
- Includes sign-out functionality

### Conditional Rendering with `<Show>`

Use Clerk's `Show` component to conditionally render based on auth status:

```typescript
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      <Show when="signed-out">
        {/* Only visible when user is NOT signed in */}
        <SignInButton />
        <SignUpButton />
      </Show>

      <Show when="signed-in">
        {/* Only visible when user IS signed in */}
        <UserButton afterSignOutUrl="/" />
      </Show>
    </header>
  );
}
```

---

## Protected Routes

### Dashboard Route (Protected)

The `/dashboard` route must be accessible only to authenticated users. Implement protection using Server Components:

**File**: `app/dashboard/page.tsx`

```typescript
import { getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await getAuth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

**Key Points**:
- Use `getAuth()` from `@clerk/nextjs/server` (server-only)
- Check `userId` — if null, user is not authenticated
- Redirect unauthenticated users to homepage with `redirect()`
- Always use Server Components for protection

### API Route Protection

API routes must validate authentication before processing requests:

**File**: `app/api/protected-route/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Process authenticated request
  return NextResponse.json({ success: true });
}
```

---

## Homepage Redirect

When an authenticated user accesses the homepage (`/`), redirect them to `/dashboard`.

**File**: `app/page.tsx`

```typescript
import { getAuth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await getAuth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-4">Link Shortener</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create and manage short links in seconds
      </p>
      {/* Public homepage content for logged-out users */}
    </div>
  );
}
```

---

## Accessing User Information

### In Server Components

Use `getAuth()` to get user ID in Server Components:

```typescript
import { getAuth } from "@clerk/nextjs/server";

export default async function MyComponent() {
  const { userId, sessionId } = await getAuth();

  if (!userId) return <div>Not authenticated</div>;

  return <div>User: {userId}</div>;
}
```

### In Client Components

Use `useAuth()` hook in Client Components:

```typescript
"use client";

import { useAuth } from "@clerk/nextjs";

export function MyClientComponent() {
  const { userId, isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;

  return <div>User: {userId}</div>;
}
```

### Getting Full User Data

To access complete user information (email, first name, etc.):

**Server Component**:
```typescript
import { currentUser } from "@clerk/nextjs/server";

export default async function MyComponent() {
  const user = await currentUser();

  if (!user) return <div>Not authenticated</div>;

  return <div>Email: {user.emailAddresses[0].emailAddress}</div>;
}
```

**Client Component**:
```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export function MyComponent() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return <div>Email: {user.emailAddresses[0].emailAddress}</div>;
}
```

---

## Best Practices

### 1. Always Protect Sensitive Routes

Use `getAuth()` in Server Components to protect routes:

```typescript
const { userId } = await getAuth();
if (!userId) redirect("/");
```

### 2. Use Server Components for Auth Checks

Prefer Server Components for authentication logic — they run on the server and are more secure:

```typescript
// Preferred: Server Component
export default async function ProtectedPage() {
  const { userId } = await getAuth();
  if (!userId) redirect("/");
  // ...
}

// Avoid: Client-side-only protection
"use client";
export default function Page() {
  // Client-side checks can be bypassed
}
```

### 3. Always Provide `afterSignOutUrl`

Configure where users redirect after signing out:

```typescript
<UserButton afterSignOutUrl="/" />
```

### 4. Modal Sign-In/Sign-Up

SignInButton and SignUpButton always use modals. Never create custom authentication forms.

### 5. Don't Store Sensitive Data Locally

Never store passwords, tokens, or sensitive information. Clerk handles all session management automatically.

### 6. Consistent User State

Use Clerk's built-in components and hooks for consistency. Don't implement custom user state management for auth.

---

## Common Patterns

### Protected Navigation

Link to `/dashboard` only for authenticated users:

```typescript
import { Show } from "@clerk/nextjs";
import Link from "next/link";

export function Navigation() {
  return (
    <Show when="signed-in">
      <Link href="/dashboard" className="btn">
        Dashboard
      </Link>
    </Show>
  );
}
```

### Auth-Dependent Content

Show different content based on auth status:

```typescript
import { Show } from "@clerk/nextjs";

export function Hero() {
  return (
    <>
      <Show when="signed-out">
        <p>Sign in to create and manage short links</p>
      </Show>

      <Show when="signed-in">
        <p>Welcome back! You can manage all your links here</p>
      </Show>
    </>
  );
}
```

### API with User Context

Use `userId` from `getAuth()` to associate data with users:

```typescript
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { url } = await request.json();

  const link = await db.insert(links).values({
    userId,
    originalUrl: url,
  });

  return NextResponse.json(link);
}
```

---

## Forbidden Practices

❌ **Do NOT**:
- Create custom authentication systems
- Manually manage JWT tokens
- Store user credentials in the database
- Bypass Clerk for any authentication
- Use alternative auth libraries (Auth0, NextAuth, etc.)
- Implement custom session handling
- Store passwords anywhere
- Use client-side-only auth checks for protected routes

---

## Troubleshooting

### Clerk Provider Not Initialized

**Error**: Components fail to render or auth hooks don't work

**Solution**: Ensure `ClerkProvider` wraps entire app in `app/layout.tsx`

### Protected Route Not Working

**Error**: Unauthenticated users can access protected routes

**Solution**: Use `getAuth()` in Server Component and call `redirect()` when `userId` is null

### SignInButton/SignUpButton Not Modal

**Error**: Buttons behave differently than expected

**Solution**: These components always use modals by default. Verify Clerk configuration is correct in `next.config.ts` or environment variables.

### User Data Not Available

**Error**: `useAuth()` returns undefined for user

**Solution**: Use `useUser()` instead for full user data, and check `isLoaded` before accessing properties

---

## Related Documentation

- [Clerk Next.js Documentation](https://clerk.com/docs/references/nextjs/overview)
- [Protected Routes Guide](./protected-routes.md) (if exists)
- [Database Schema](./database.md) for user-related fields

---

**Last Updated**: May 2026
**Next Review**: When adding new auth features or updating Clerk versions
