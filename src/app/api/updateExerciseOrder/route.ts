import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("unauthorized", { status: 401 });
    }

    try {
        const { newOrder } = await req.json(); // newOrder is expected to be an array of exercise IDs in the desired order

        // Loop through the newOrder array and update each exercise with its new order
        for (let i = 0; i < newOrder.length; i++) {
            const exerciseId = newOrder[i];
            const order = i + 1; // Adding 1 because order should start from 1

            await db.update($workouts)
                .set({ order: order })
                .where(eq($workouts.id, exerciseId))
                .execute();
        }

        return new NextResponse("success", { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return new NextResponse("error", { status: 500 });
    }
}
