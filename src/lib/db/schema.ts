import {pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core'

export const $workouts = pgTable('workouts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId: text('user_id').notNull(),
    workout: text('workouts'),
})

export type WorkoutType = typeof $workouts.$inferInsert;