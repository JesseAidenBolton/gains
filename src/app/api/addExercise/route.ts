// /api/addExercise

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";
import {eq, sql} from "drizzle-orm";

interface MaxOrderResult {
    max_order: number | null;
}

const fetchMaxOrder = async (userId: string): Promise<number> => {
    try {
        const result = await db.execute(
            sql`SELECT MAX("order") AS max_order FROM ${$workouts} WHERE ${$workouts.userId} = ${userId}`
        );

        // Check if rows are present and extract the max_order value
        if (result.rows && result.rows.length > 0) {
            const maxOrderRow = result.rows[0] as MaxOrderResult;
            return maxOrderRow.max_order !== null ? maxOrderRow.max_order : 0;
        }

        return 0;
    } catch (error) {
        console.error("Error fetching max order:", error);
        return 0;
    }
};




export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("unauthorized", { status: 401 });
    }


    try {
        const body = await req.json();
        const { sets, name, id, date } = body; // Add 'date' to the destructured fields

        if (id) {



            // Updating an existing exercise
            const exerciseToUpdate = {
                name: name,
                userId: userId,
                exercises: [{ sets: sets }],
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

            const maxOrder = await fetchMaxOrder(userId);
            const newOrder = maxOrder + 1;

            // Inserting a new exercise
            const exerciseDate = date ? new Date(date) : new Date(); // Use the provided date or default to the current date
            //console.log(exerciseDate)
            const newExercise = {
                date: exerciseDate,
                name: name,
                userId: userId,
                exercises: [{ sets: sets }],
                order: newOrder
            };

            await db.insert($workouts).values(newExercise).execute();
        }

        return new NextResponse("success");
    } catch (error) {
        console.error("Error processing request:", error);
        return new NextResponse("error", { status: 500 });
    }
}
