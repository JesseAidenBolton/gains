import { db } from "@/lib/db";
import { $workouts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { exerciseId } = await req.json();
    console.log(`DELETE ${exerciseId}`)
    await db.delete($workouts).where(eq($workouts.id, parseInt(exerciseId)));
    return new NextResponse("ok", { status: 200 });
}