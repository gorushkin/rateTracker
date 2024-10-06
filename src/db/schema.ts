import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

type UserType = 'user' | 'admin';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey().unique().notNull(),
  username: text('username').default('').notNull(),
  utcOffset: integer('utc_offset').default(0).notNull(),
  isHourlyUpdateEnabled: integer('isHourlyUpdateEnabled', {
    mode: 'boolean',
  })
    .default(false)
    .notNull(),
  isDailyUpdateEnabled: integer('isDailyUpdateEnabled', {
    mode: 'boolean',
  })
    .default(false)
    .notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  role: text('role').$type<UserType>().default('user').notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdateFn(() => sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export type UserDTO = typeof users.$inferSelect;
