// app/api/auth/check/route.ts
import { protectedRounterAction } from "@/hooks/serverAction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, currentPath } = body;

        const result = await protectedRounterAction(token, currentPath);

        if (result instanceof NextResponse && result.headers.get("Location")) {
            return NextResponse.json({
                redirect: result.headers.get("Location")
            });
        }

        // ถ้าผ่านการตรวจสอบ
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Authorization failed" },
            { status: 401 }
        );
    }
}