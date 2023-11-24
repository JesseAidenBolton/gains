import {pgTable, serial, text, timestamp, jsonb, integer} from 'drizzle-orm/pg-core';

interface Set {
    weight: string;
    reps: string;
}
interface Exercise {
    id: number;
    name: string;
    sets: Set[];
    userId: string;
    date: Date;
    exercises: { name: string; sets: Set[]; }[];
}

export const $workouts = pgTable('workouts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    date: timestamp('date').notNull(),
    userId: text('user_id').notNull(),
    exercises: jsonb<string>('exercises'),
    order: integer('order')
});

export type WorkoutType = typeof $workouts.$inferInsert;
