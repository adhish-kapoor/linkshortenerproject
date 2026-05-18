import { pgTable, text, varchar, integer, timestamp, uuid, index, uniqueIndex } from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    originalUrl: text('original_url').notNull(),
    shortCode: varchar('short_code', { length: 20 }).notNull(),
    title: varchar('title', { length: 255 }),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('links_user_id_idx').on(table.userId),
    shortCodeIdx: uniqueIndex('links_short_code_idx').on(table.shortCode),
  }),
)
