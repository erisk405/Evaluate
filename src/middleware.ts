import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // const protectedPathsAdmin = ['/management', '/evaluation'];
  // const protectedPathsUser = ['/overview/department', '/personal_evaluation', '/history'];
  const currentPath = request.nextUrl.pathname;
  // Redirect root to overview
  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // const isProtectedRouteAdmin = protectedPathsAdmin.some(path => currentPath.startsWith(path));
  // const isProtectedRouteUser = protectedPathsUser.some(path => currentPath.startsWith(path));
  // Read token from Authorization header

  // Read token from cookies
  // const token = request.cookies.get('token')?.value; // แบบเดิมมีปัญหาตีร

  // if (!token) {
  //   return NextResponse.redirect(new URL('/sign-in', request.url));
  // }

  // Decode or validate token (e.g., with a library like jose or jwt-decode)
  // const userRole = (await decodeToken(token))?.role;

  // if (isProtectedRouteAdmin && userRole !== 'admin') {
  //   return NextResponse.redirect(new URL('/overview', request.url));
  // }

  // if (isProtectedRouteUser && userRole === 'admin') {
  //   return NextResponse.redirect(new URL('/overview', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
  ],
};
