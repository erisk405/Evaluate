import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiUrl } from './app/data/data-option';

export async function middleware(request: NextRequest) {
  const protectedPathsAdmin = ['/management', '/evaluation'];
  const protectedPathsUser = ['/overview/department', '/personal_evaluation', '/history'];
  const currentPath = request.nextUrl.pathname;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

  const isProtectedRouteAdmin = protectedPathsAdmin.some((path) => currentPath.startsWith(path));
  const isProtectedRouteUser = protectedPathsUser.some((path) => currentPath.startsWith(path));

  try {
    // Log cookies being forwarded
    const cookies = request.headers.get('cookie') || '';
    console.log("Middleware: Cookies being sent to API:", cookies);

    const response = await axios.get(`${apiUrl}/protected`, {
      withCredentials: true, // Ensure cookies are sent
      headers: { Cookie: cookies },
    });

    const userRole = response.data.role;
    if (isProtectedRouteAdmin && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
    if (isProtectedRouteUser && userRole === 'admin') {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
  } catch (error: unknown) {
    console.error('Error in middleware:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

// กำหนด paths ที่จะเรียกใช้ middleware
export const config = {
  matcher: [
    '/overview/:path*',
    '/management/:path*',
    '/evaluation/:path*',
    '/overview/department/:path*',
    '/personal_evaluation/:path*',
    '/history/:path*',
    '/'
  ], // matcher ที่ต้องการตรวจสอบ
};
