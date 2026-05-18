import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getUserLinks(userId: string) {
  return await db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8);
}

type CreateLinkResult = 
  | { success: true; data: any }
  | { success: false; error: string }

export async function createLinkHelper(
  userId: string,
  data: { originalUrl: string; title: string; description?: string }
): Promise<CreateLinkResult> {
  try {
    const shortCode = generateShortCode();
    const result = await db
      .insert(links)
      .values({
        userId,
        originalUrl: data.originalUrl,
        title: data.title,
        description: data.description,
        shortCode,
      })
      .returning();

    return { success: true, data: result[0] };
  } catch (error) {
    console.error("createLinkHelper error:", error);
    return { success: false, error: "Failed to create link" };
  }
}
