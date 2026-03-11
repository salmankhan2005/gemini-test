import { pgTable, text, serial, timestamp, integer } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
    id: serial('id').primaryKey(),
    title: text('title').notNull().default('New Chat'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    conversationId: integer('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
    role: text('role').notNull(), // 'user' | 'assistant'
    content: text('content').notNull(),
    model: text('model'), // which AI model generated this
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
