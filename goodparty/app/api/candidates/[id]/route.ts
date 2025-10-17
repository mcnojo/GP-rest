import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {

    const candidate = await db.query.candidates.findFirst({
        where: (c, { eq }) => eq(c.id, params.id),
    });

    if (!candidate) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(candidate);
}