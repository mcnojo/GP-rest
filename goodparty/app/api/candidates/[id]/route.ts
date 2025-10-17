import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const candidate = await db.query.candidates.findFirst({
            where: (c, { eq }) => eq(c.id, params.id),
        });

        if (!candidate) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        return NextResponse.json(candidate);
    } catch (error) {
        console.error("GET /api/candidates/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}