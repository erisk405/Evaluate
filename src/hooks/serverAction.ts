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

async function decodeToken(token: string): Promise<TokenPayload | null> {
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
    try {
        // Basic token check
        if (!token) {
            return NextResponse.redirect(new URL('/sign-in'));
        }

        // Redirect root to overview
        if (currentPath === '/') {
            return NextResponse.redirect(new URL('/overview'));
        }

        // Check if current path is protected
        const isProtectedRouteAdmin = isPathAccessibleForAdmin(currentPath);
        const isProtectedRouteUser = isPathAccessibleForUsers(currentPath);

        // Decode token and get user role
        const decodedToken = await decodeToken(token);
        const userRole = decodedToken?.role;

        if (!userRole) {
            return NextResponse.redirect(new URL('/sign-in'));
        }

        // Admin route protection
        if (isProtectedRouteAdmin && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/overview'));
        }

        // User route protection
        if (isProtectedRouteUser && userRole === 'admin') {
            return NextResponse.redirect(new URL('/overview'));
        }

        // If all checks pass, continue
        return NextResponse.next();
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.redirect(new URL('/sign-in'));
    }
}