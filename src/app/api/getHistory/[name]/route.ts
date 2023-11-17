// pages/api/exercises/history/[exerciseName].ts

import { db } from '@/lib/db';
import { $workouts } from '@/lib/db/schema';
import {asc, eq} from 'drizzle-orm';
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request)  {
    const exerciseName = decodeURIComponent(request.url.slice(request.url.lastIndexOf('/') + 1));

    if (!exerciseName) {
        return new NextResponse("Invalid exercise name", { status: 400 });
    }

    try {
        const history = await db
            .select()
            .from($workouts)
            .where(eq($workouts.name, exerciseName))
            .orderBy(asc($workouts.date))
            .execute();

        return new NextResponse(JSON.stringify(history), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error('Error fetching exercise history:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
