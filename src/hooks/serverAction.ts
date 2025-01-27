import { JWTPayload, jwtVerify } from "jose";
import { NextResponse } from "next/server";

interface TokenPayload extends JWTPayload {
    role?: string;
}

const isPathAccessibleForAdmin = (path: string): boolean => {
    const protectedPathsAdmin = ["/management", "/evaluation"];
    return protectedPathsAdmin.some((protectedPath) =>
        path.startsWith(protectedPath)
    );
};
const isPathAccessibleRoleMember = (path: string): boolean => {
    const protectedPathsMember = [
        "/overview/department",
    ];
    return protectedPathsMember.some((protectedPath) =>
        path.startsWith(protectedPath)
    );
};

const isPathAccessibleForUsers = (path: string): boolean => {
    const protectedPathsUser = [
        "/overview/department",
        "/personal_evaluation",
        "/history",
    ];
    return protectedPathsUser.some((protectedPath) =>
        path.startsWith(protectedPath)
    );
};
const isPathCustoms = (path: string): boolean => {
    const protectedPathsCustom = [
        "/reset-password",
    ];
    return protectedPathsCustom.some((protectedPath) =>
        path.startsWith(protectedPath)
    );
};

export async function decodeToken(token: string): Promise<TokenPayload | null> {
    const jwtSecret = process.env.jwtSecret;

    if (!jwtSecret) {
        throw new Error("JWT secret is not defined");
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(jwtSecret)
        );
        return payload as TokenPayload;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}
export async function protectedRounterAction(token: string, currentPath: string) {
    const isProduction = process.env.NODE_ENV === "production"
    const BASE_URL = isProduction ? process.env.NEXT_PUBLIC_BASE_URL : 'http://localhost:3000';

    try {
        // ตรวจสอบว่าเป็น path ที่เป็น custom path หรือไม่ (เช่น reset-password)
        const isPathCustom = isPathCustoms(currentPath);

        // Basic token check - ยกเว้นกรณี custom paths
        if (!token && !isPathCustom) {
            return NextResponse.redirect(new URL('/sign-in', BASE_URL));
        }

        // Redirect root to overview
        if (currentPath === '/') {
            return NextResponse.redirect(new URL('/overview', BASE_URL));
        }

        // Decode token
        const decodedToken = await decodeToken(token);

        // สำหรับ custom paths (reset-password)
        if (isPathCustom) {
            // ถ้ามี uid ให้เข้าถึงหน้าได้
            if (decodedToken?.uid) {
                return NextResponse.next();
            }
            // ถ้าไม่มี uid ให้ redirect ไปที่ sign-in
            return NextResponse.redirect(new URL('/sign-in', BASE_URL));
        }

        // Check if current path is protected
        const isProtectedRouteAdmin = isPathAccessibleForAdmin(currentPath);
        const isProtectedRouteUser = isPathAccessibleForUsers(currentPath);
        const isProtectedRouteMember = isPathAccessibleRoleMember(currentPath);
        const userRole = decodedToken?.role;

        if (!userRole) {
            return NextResponse.redirect(new URL('/sign-in', BASE_URL));
        }
        // Member route protection
        if (isProtectedRouteMember && userRole === 'member') {
            return NextResponse.redirect(new URL('/overview', BASE_URL));
        }
        // Admin route protection
        if (isProtectedRouteAdmin && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/overview', BASE_URL));
        }

        // User route protection
        if (isProtectedRouteUser && userRole === 'admin') {
            return NextResponse.redirect(new URL('/overview', BASE_URL));
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.redirect(new URL('/sign-in', BASE_URL));
    }
}