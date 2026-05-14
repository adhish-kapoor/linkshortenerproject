# shadcn/ui Component Standards

This document defines how to use shadcn/ui components in the Link Shortener application. **All UI elements must use shadcn/ui components**. No custom components should be created.

---

## Overview

The Link Shortener application uses **shadcn/ui** as its complete UI component library. shadcn/ui provides:
- Pre-built, accessible React components
- Full TypeScript support
- Tailwind CSS styling
- Radix UI primitives (accessible UI foundations)
- Easy customization through component copying
- Lucide React icons

**Critical Rule**: Do not create custom UI components. Always use shadcn/ui components. If a component doesn't exist, install it from shadcn/ui.

---

## Project Configuration

### Setup

The project is configured in `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

**Key Settings**:
- **Style**: `radix-nova` — Modern design system
- **RSC**: `true` — React Server Components compatible
- **Icon Library**: `lucide` — Use Lucide React for all icons
- **Aliases**: Import components from `@/components/ui`

### Component Location

All shadcn/ui components are installed in:
```
components/ui/
```

Import components using the alias:
```typescript
import { Button } from "@/components/ui/button"
```

---

## Core Components

### Button

The primary action component:

```typescript
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <>
      {/* Solid button (default) */}
      <Button>Click me</Button>

      {/* Secondary variant */}
      <Button variant="secondary">Secondary</Button>

      {/* Destructive (red) */}
      <Button variant="destructive">Delete</Button>

      {/* Outline style */}
      <Button variant="outline">Outline</Button>

      {/* Ghost (minimal) */}
      <Button variant="ghost">Ghost</Button>

      {/* Link style */}
      <Button variant="link">Link</Button>

      {/* Disabled state */}
      <Button disabled>Disabled</Button>

      {/* Loading state with size */}
      <Button size="lg">Large Button</Button>
      <Button size="sm">Small Button</Button>
      <Button size="icon">🔒</Button>
    </>
  )
}
```

**Props**:
- `variant`: `"default" | "secondary" | "destructive" | "outline" | "ghost" | "link"`
- `size`: `"default" | "sm" | "lg" | "icon"`
- `disabled`: `boolean`
- `type`: `"button" | "submit" | "reset"`

---

## Installing Components

To install a new shadcn/ui component, use:

```bash
npx shadcn-ui@latest add [component-name]
```

**Common Components to Install**:

```bash
# Form components
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea

# Layout
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu

# Feedback
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add alert

# Navigation
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add pagination
```

See [shadcn/ui Component Library](https://ui.shadcn.com/docs/components/accordion) for the full list.

---

## Common Use Cases

### Forms

Always use shadcn/ui form components:

```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LinkForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">Destination URL</Label>
        <Input 
          id="url"
          type="url" 
          placeholder="https://example.com"
        />
      </div>

      <Button type="submit">Create Link</Button>
    </form>
  )
}
```

### Cards

Use Card components for content containers:

```typescript
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LinkCard({ link }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{link.shortCode}</CardTitle>
        <CardDescription>{link.originalUrl}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Clicks: {link.clicks}</p>
      </CardContent>
    </Card>
  )
}
```

### Dialogs (Modals)

Use Dialog for modal overlays:

```typescript
"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>
            Enter the URL you want to shorten
          </DialogDescription>
        </DialogHeader>
        {/* Form content */}
      </DialogContent>
    </Dialog>
  )
}
```

### Alerts

Use Alert for notifications and messages:

```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ErrorAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to create link. Please try again.
      </AlertDescription>
    </Alert>
  )
}
```

---

## Using Icons

All icons come from **Lucide React**. Never use custom icons or image files for standard UI icons.

```typescript
import { 
  AlertCircle, 
  Check, 
  Copy, 
  Trash2,
  Link as LinkIcon,
  Settings,
  LogOut 
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function IconExamples() {
  return (
    <>
      <Button variant="ghost" size="icon">
        <Copy className="h-4 w-4" />
      </Button>

      <Button variant="destructive" size="icon">
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="flex gap-2">
        <Check className="h-5 w-5 text-green-600" />
        <AlertCircle className="h-5 w-5 text-red-600" />
      </div>
    </>
  )
}
```

**Icon Sizing**:
- `h-4 w-4` — Small (typical for buttons)
- `h-5 w-5` — Medium
- `h-6 w-6` — Large
- `h-8 w-8` — Extra large

See [Lucide Icons](https://lucide.dev) for the complete icon library.

---

## Styling Components

### Using Tailwind Utilities

Combine shadcn/ui components with Tailwind CSS for layout and spacing:

```typescript
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function MyComponent() {
  return (
    <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
      <Input placeholder="Search..." className="flex-1" />
      <Button>Search</Button>
    </div>
  )
}
```

### Component Variants

Use component variants instead of custom CSS:

```typescript
import { Button } from "@/components/ui/button"

export function Buttons() {
  return (
    <>
      {/* Different visual styles */}
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>

      {/* Different sizes */}
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </>
  )
}
```

### Conditional Styling with `clsx`

Use `clsx` for conditional Tailwind classes:

```typescript
import { clsx } from "clsx"
import { Button } from "@/components/ui/button"

interface ButtonProps {
  isLoading?: boolean
}

export function SubmitButton({ isLoading }: ButtonProps) {
  return (
    <Button
      disabled={isLoading}
      className={clsx(
        isLoading && "opacity-50"
      )}
    >
      {isLoading ? "Loading..." : "Submit"}
    </Button>
  )
}
```

---

## Best Practices

### 1. Use Component Variants

Always use built-in variants instead of creating custom components:

```typescript
// ✅ Good
<Button variant="destructive">Delete</Button>

// ❌ Bad
<div className="bg-red-600 text-white px-4 py-2 rounded">Delete</div>
```

### 2. Use Semantic HTML

shadcn/ui components use semantic HTML. Leverage this:

```typescript
// ✅ Good - uses proper semantic elements
<form>
  <Label>Email</Label>
  <Input type="email" />
  <Button type="submit">Submit</Button>
</form>

// ❌ Bad - ignores semantic structure
<div>
  <div>Email</div>
  <div>Input</div>
  <div>Submit</div>
</div>
```

### 3. Compose Components

Build complex UIs by composing shadcn/ui components:

```typescript
// ✅ Good - composed from shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LinkPreview({ link }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{link.shortCode}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{link.originalUrl}</p>
        <Button>Copy Link</Button>
      </CardContent>
    </Card>
  )
}

// ❌ Bad - creates custom component instead
export function LinkPreview({ link }) {
  return (
    <div className="border rounded-lg p-6 bg-white">
      {/* Custom styling instead of using Card */}
    </div>
  )
}
```

### 4. Pass Through Props

Allow component consumers to customize styling:

```typescript
import { Button, type ButtonProps } from "@/components/ui/button"

interface MyButtonProps extends ButtonProps {
  label: string
}

export function MyButton({ label, ...props }: MyButtonProps) {
  return (
    <Button {...props}>
      {label}
    </Button>
  )
}

// Usage allows customization
<MyButton label="Click" variant="secondary" className="w-full" />
```

### 5. Install Components Before Use

Don't create components that don't exist. Install them:

```bash
# Install the component first
npx shadcn-ui@latest add select

# Then use it
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
```

### 6. Use Consistent Sizing

Maintain visual consistency with standard sizes:

```typescript
{/* Icons */}
<Icon className="h-4 w-4" />

{/* Buttons */}
<Button size="default">Standard</Button>

{/* Input fields */}
<Input placeholder="Enter text" />

{/* Spacing */}
<div className="space-y-4">
```

---

## Common Patterns

### Loading Button

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CreateButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Perform action
      await someAsyncAction()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create"}
    </Button>
  )
}
```

### Action Menu

```typescript
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

export function LinkActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Copy Link</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Form Group

```typescript
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function FormGroup({ label, id, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  )
}

// Usage
<FormGroup 
  label="Destination URL" 
  id="url" 
  type="url"
  placeholder="https://example.com"
/>
```

---

## Forbidden Practices

❌ **Do NOT**:
- Create custom UI components instead of using shadcn/ui
- Use HTML `<button>` instead of shadcn Button
- Write custom CSS for components (use Tailwind + variants)
- Import UI components from external libraries (other than Lucide icons)
- Create styled-component or CSS-in-JS solutions
- Use inline styles for component styling
- Ignore shadcn/ui accessibility features
- Create custom form components instead of using shadcn/ui form components

---

## Troubleshooting

### Component Not Found

**Error**: `Cannot find module '@/components/ui/[component]'`

**Solution**: Install the component:
```bash
npx shadcn-ui@latest add [component-name]
```

### Missing Icons

**Error**: Icon import fails

**Solution**: Check Lucide React library for icon name:
```typescript
// Correct
import { ChevronDown } from "lucide-react"

// Wrong - icon name doesn't exist
import { ChevronDown2 } from "lucide-react"
```

See [lucide.dev](https://lucide.dev) for all available icons.

### Styling Not Applied

**Error**: Tailwind classes not working

**Solution**: Ensure you're using valid Tailwind classes. shadcn/ui components accept `className` prop:
```typescript
// ✅ Correct
<Button className="w-full">Full Width</Button>

// ❌ Wrong - modifying component internal classes
<Button className="bg-blue-500">Not working</Button>
```

---

## Customizing Components

### Modifying Default Styles

Edit component files in `components/ui/` to customize default behavior:

```typescript
// components/ui/button.tsx
// Modify the default variant or size here
```

### Creating Wrapper Components

Wrap shadcn/ui components for project-specific use cases:

```typescript
import { Button, type ButtonProps } from "@/components/ui/button"

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode
}

export function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return (
    <Button variant="default" size="lg" {...props}>
      {children}
    </Button>
  )
}
```

---

## Resources

- **[shadcn/ui Documentation](https://ui.shadcn.com/docs)** — Complete component reference
- **[Lucide Icons](https://lucide.dev)** — Icon library
- **[Radix UI](https://www.radix-ui.com)** — Accessibility primitives
- **[Tailwind CSS](https://tailwindcss.com)** — Styling utilities

---

**Last Updated**: May 2026
**Next Review**: When upgrading shadcn/ui or adding new component types
