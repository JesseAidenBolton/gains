// /api/addExercise

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("unauthorised", { status: 401 });
    }

    try {
        const body = await req.json();
        const { sets, name } = body;

        // Log the received sets data
        //console.log(sets);

        /*// store each set separately
        const insertPromises = sets.map(async (set: any) => {
            await db.insert($workouts).values({
                date: new Date(),
                name: name,
                userId: userId,
                exercises: [{ sets: [set] }],
            });
        });*/

        const exercise = {
            date: new Date(), // Replace with the actual date
            name: name,
            userId: userId,
            exercises: [{ sets: sets }], // Store all sets for a particular exercise in one entry
        };


        // Wait for all insert operations to complete
        //await Promise.all(insertPromises);


        // Insert the exercise into the database
        await db.insert($workouts).values(exercise);


        console.log("Inserted into the database");

        return new NextResponse("success");
    } catch (error) {
        console.error("Error processing request:", error);
        return new NextResponse("error", { status: 500 });
    }
}
