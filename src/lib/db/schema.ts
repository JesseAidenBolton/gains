import { sql } from 'drizzle-orm';
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

export interface RoutineSet {
    weight: string;
    reps: string;
}

export interface RoutineExercise {
    id: string;
    name: string;
    sets: RoutineSet[];
    order: number;
}

export const $routineTemplates = pgTable('routine_templates', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    userId: text('user_id').notNull(),
    exercises: jsonb('exercises').$type<RoutineExercise[]>().notNull().default(sql`'[]'::jsonb`),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type WorkoutType = typeof $workouts.$inferInsert;
export type RoutineTemplateType = typeof $routineTemplates.$inferInsert;
