// /api/addExercise

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";
import {eq} from "drizzle-orm";

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { sets, name, id } = body;

        if (id) {



            // Updating an existing exercise
            const exerciseToUpdate = {
                name: name,
                userId: userId,
                exercises: [{ sets: sets }],
                // Include id only for the update
                id: id
            };

            const updated = await db.update($workouts)
                .set(exerciseToUpdate)
                .where(eq($workouts.id, id))
                .execute();

            if (updated.rowCount === 0) {
                return new NextResponse("exercise not found", { status: 404 });
            }
        } else {
            // Inserting a new exercise
            const newExercise = {
                date: new Date(),
                name: name,
                userId: userId,
                exercises: [{ sets: sets }]
                // Exclude the id field here
            };

            await db.insert($workouts).values(newExercise).execute();
        }

        return new NextResponse("success");
    } catch (error) {
        console.error("Error processing request:", error);
        return new NextResponse("error", { status: 500 });
    }
}
