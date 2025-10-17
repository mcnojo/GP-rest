import { NextResponse } from "next/server";
import { db, schema } from "../../../../lib/db";
import { sum } from "drizzle-orm";

export async function GET() {
    try {
        const [row] = await db
            .select({ total: sum(schema.candidates.fundsRaised) })
            .from(schema.candidates);

        const totalRaised = Number(row?.total ?? 0)
        return NextResponse.json(totalRaised);
    } catch (error) {
        console.error("GET /api/candidates/aggregate error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
