import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { $routineTemplates, RoutineExercise } from "@/lib/db/schema";

const unauthorized = () => new NextResponse("unauthorized", { status: 401 });

const routineTableMissing = (error: unknown) =>
    error instanceof Error && error.message.includes("routine_templates");

const missingRoutineTableResponse = () =>
    new NextResponse("routine templates table is not ready. Run drizzle/0001_create_routine_templates.sql first.", {
        status: 503,
    });

const normalizeExercises = (exercises: RoutineExercise[] = []) =>
    exercises
        .map((exercise, index) => ({
            id: exercise.id || crypto.randomUUID(),
            name: exercise.name,
            sets: exercise.sets?.length ? exercise.sets : [{ weight: "", reps: "" }],
            order: index + 1,
        }))
        .filter((exercise) => exercise.name);

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return unauthorized();
    }

    try {
        const routines = await db
            .select()
            .from($routineTemplates)
            .where(eq($routineTemplates.userId, userId))
            .orderBy(asc($routineTemplates.createdAt))
            .execute();

        return NextResponse.json(routines);
    } catch (error) {
        if (routineTableMissing(error)) {
            return missingRoutineTableResponse();
        }

        throw error;
    }
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return unauthorized();
    }

    const { name, exercises } = await req.json();
    const routineName = String(name || "").trim();

    if (!routineName) {
        return new NextResponse("routine name is required", { status: 400 });
    }

    try {
        const [routine] = await db
            .insert($routineTemplates)
            .values({
                name: routineName,
                userId,
                exercises: normalizeExercises(exercises),
            })
            .returning()
            .execute();

        return NextResponse.json(routine, { status: 201 });
    } catch (error) {
        if (routineTableMissing(error)) {
            return missingRoutineTableResponse();
        }

        throw error;
    }
}

export async function PUT(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return unauthorized();
    }

    const { id, name, exercises } = await req.json();
    const routineId = Number(id);

    if (!routineId) {
        return new NextResponse("routine id is required", { status: 400 });
    }

    try {
        const [routine] = await db
            .update($routineTemplates)
            .set({
                ...(name ? { name: String(name).trim() } : {}),
                ...(Array.isArray(exercises) ? { exercises: normalizeExercises(exercises) } : {}),
                updatedAt: new Date(),
            })
            .where(and(eq($routineTemplates.id, routineId), eq($routineTemplates.userId, userId)))
            .returning()
            .execute();

        if (!routine) {
            return new NextResponse("routine not found", { status: 404 });
        }

        return NextResponse.json(routine);
    } catch (error) {
        if (routineTableMissing(error)) {
            return missingRoutineTableResponse();
        }

        throw error;
    }
}

export async function DELETE(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return unauthorized();
    }

    const { id } = await req.json();
    const routineId = Number(id);

    if (!routineId) {
        return new NextResponse("routine id is required", { status: 400 });
    }

    try {
        await db
            .delete($routineTemplates)
            .where(and(eq($routineTemplates.id, routineId), eq($routineTemplates.userId, userId)))
            .execute();

        return new NextResponse("ok");
    } catch (error) {
        if (routineTableMissing(error)) {
            return missingRoutineTableResponse();
        }

        throw error;
    }
}
