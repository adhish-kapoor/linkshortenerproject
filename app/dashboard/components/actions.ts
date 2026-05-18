'use server'

import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { createLinkHelper } from '@/data/links'
import { revalidatePath } from 'next/cache'

const createLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
})

interface CreateLinkInput extends z.infer<typeof createLinkSchema> {}

type CreateLinkResult = 
  | { success: true; data: any }
  | { success: false; error: string; status?: number }

export async function createLink(input: CreateLinkInput): Promise<CreateLinkResult> {
  const { userId } = await auth()

  if (!userId) {
    return { success: false, error: 'Unauthorized', status: 401 }
  }

  try {
    const validatedInput = createLinkSchema.parse(input)
    const result = await createLinkHelper(userId, validatedInput)

    if (result.success) {
      revalidatePath('/dashboard')
      return result
    }

    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'An error occurred' }
  }
}
