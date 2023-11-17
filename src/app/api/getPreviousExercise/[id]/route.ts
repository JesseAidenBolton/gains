// pages/api/getPreviousExercise/[name].js

import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";
import {and, desc, eq, lt} from "drizzle-orm";
import { NextResponse } from "next/server";




export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)

    const id = request.url.slice(request.url.lastIndexOf('/') + 1);

    //console.log(`id is ${id}`);

    try {

        // Parse the ID to a number (make sure to validate it)
        const exerciseId = parseInt(id as string, 10);
        if (isNaN(exerciseId)) {
            return new NextResponse("invalid ID", { status: 404 });
        }

        // Fetch the exercise details to id the userId and date
        const currentExercise = await db
            .select()
            .from($workouts)
            .where(eq($workouts.id, exerciseId))
            .execute();

        if (!currentExercise.length) {
            return new NextResponse("exercise not found", { status: 404 });
        }

        const { userId, date: currentDate } = currentExercise[0];

        //console.log(`current: ${JSON.stringify(currentExercise, null, 2)}`)

        // Fetch the most recent exercise for the same user before the current exercise's date
        const previousExercise = await db
            .select()
            .from($workouts)
            .where(and(
                eq($workouts.userId, userId),
                eq($workouts.name, currentExercise[0].name),
                lt($workouts.date, currentDate), // lt is "less than"
            ))
            .orderBy(desc($workouts.date)) // Order by date in descending order
            .limit(1) // Get only the most recent record
            .execute();


        // If there's no previous exercise, return a 404
        if (!previousExercise.length) {
            return new NextResponse(" Previous exercise not found", { status: 404 });
        }

        // Return the previous exercise data
        //console.log(`previous: ${JSON.stringify(previousExercise[0], null, 2)}`)
        return Response.json(previousExercise[0].exercises)
        //return new NextResponse("ok", { status: 200 });
        //return res.status(200).json(previousExercise[0]);
    } catch (error) {
        console.error("Error fetching previous exercise:", error);
        return new NextResponse(" Internal server error", { status: 500 });

    }

}
