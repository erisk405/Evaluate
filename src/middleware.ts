import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiUrl } from './app/data/data-option';

export async function middleware(request: NextRequest) {
  const protectedPathsAdmin = ['/management', '/evaluation'];
  const protectedPathsUser = ['/overview/department', '/personal_evaluation','/history'];
  const currentPath = request.nextUrl.pathname;

  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  const isProtectedRouteAdmin = protectedPathsAdmin.some(path => currentPath.startsWith(path));
  const isProtectedRouteUser = protectedPathsUser.some(path => currentPath.startsWith(path));

  if (isProtectedRouteAdmin || isProtectedRouteUser) {
    try {
      // ตรวจสอบว่ามี cookie หรือไม่
      const cookieHeader = request.headers.get('cookie');
      if (!cookieHeader) {
        throw new Error('No cookie found');
      }

      // เพิ่ม credentials และ headers ที่จำเป็น
      const response = await fetch(`${apiUrl}/protected`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cookie': cookieHeader,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // ตรวจสอบ role และ redirect ตามเงื่อนไข
      if (isProtectedRouteAdmin && data.role !== 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }

      if (isProtectedRouteUser && data.role === 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }

      // สร้าง response สำหรับ request ที่ผ่านการตรวจสอบ
      const nextResponse = NextResponse.next();

      // เพิ่ม CORS headers
      nextResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      nextResponse.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '');

      return nextResponse;

    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/overview/:path*',
    '/management/:path*',
    '/evaluation/:path*',
    '/overview/department/:path*',
    '/personal_evaluation/:path*',
    '/history/:path*',
    '/'
  ],
};