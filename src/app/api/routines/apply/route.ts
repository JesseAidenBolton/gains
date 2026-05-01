import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { $routineTemplates, $workouts, RoutineExercise } from "@/lib/db/schema";

interface MaxOrderResult {
    max_order: number | null;
}

const fetchMaxOrder = async (userId: string): Promise<number> => {
    const result = await db.execute(
        sql`SELECT MAX("order") AS max_order FROM ${$workouts} WHERE ${$workouts.userId} = ${userId}`
    );

    if (!result.rows?.length) {
        return 0;
    }

    const maxOrderRow = result.rows[0] as unknown as MaxOrderResult;
    return maxOrderRow.max_order ?? 0;
};

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("unauthorized", { status: 401 });
    }

    const { routineId, date } = await req.json();
    const targetDate = date ? new Date(date) : new Date();
    const id = Number(routineId);

    if (!id || Number.isNaN(targetDate.getTime())) {
        return new NextResponse("routine id and valid date are required", { status: 400 });
    }

    let routine;

    try {
        [routine] = await db
            .select()
            .from($routineTemplates)
            .where(and(eq($routineTemplates.id, id), eq($routineTemplates.userId, userId)))
            .execute();
    } catch (error) {
        if (error instanceof Error && error.message.includes("routine_templates")) {
            return new NextResponse("routine templates table is not ready. Run drizzle/0001_create_routine_templates.sql first.", {
                status: 503,
            });
        }

        throw error;
    }

    if (!routine) {
        return new NextResponse("routine not found", { status: 404 });
    }

    const exercises = [...(routine.exercises as RoutineExercise[])]
        .filter((exercise) => exercise.name)
        .sort((a, b) => a.order - b.order);

    if (!exercises.length) {
        return new NextResponse("routine has no exercises", { status: 400 });
    }

    const maxOrder = await fetchMaxOrder(userId);

    await db
        .insert($workouts)
        .values(exercises.map((exercise, index) => ({
            name: exercise.name,
            userId,
            date: targetDate,
            exercises: [{ sets: exercise.sets?.length ? exercise.sets : [{ weight: "", reps: "" }] }],
            order: maxOrder + index + 1,
        })))
        .execute();

    return NextResponse.json({ created: exercises.length });
}
