import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");


    if (!userId || !startDate || !endDate) {
        return new NextResponse(JSON.stringify({ message: "Missing query parameters" }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    try {
        const dateObjectStart = new Date(startDate);
        const dateObjectEnd = new Date(endDate);

        const exercises = await db.select().from($workouts)
            .where(and(
                eq($workouts.userId, userId),
                gte($workouts.date, dateObjectStart),
                lte($workouts.date, dateObjectEnd)))
            .execute();

        return new NextResponse(JSON.stringify(exercises), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching exercises:", error);
        return new NextResponse(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
