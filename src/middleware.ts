import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiUrl } from './app/data/data-option';

export async function middleware(request: NextRequest) {
  const protectedPathsAdmin = ['/management', '/evaluation'];
  const protectedPathsUser = ['/overview/department', '/personal_evaluation', '/history'];
  const currentPath = request.nextUrl.pathname;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // สร้าง custom request headers
  const requestHeaders = new Headers(request.headers);
  
  // ดึง token จาก localStorage แทน (ถ้าคุณเก็บ token ไว้ที่ localStorage)
  // หรือถ้าใช้ cookie ก็ดึงจาก cookie
  const authHeader = request.headers.get('authorization');
  console.log('Auth header:', authHeader);

  const isProtecedRouteAdmin = protectedPathsAdmin.some(path => currentPath.startsWith(path));
  const isProtecedRouteUser = protectedPathsUser.some(path => currentPath.startsWith(path));

  if (isProtecedRouteAdmin || isProtecedRouteUser) {
    try {
      // ใช้ fetch แทน axios
      const response = await fetch(`${apiUrl}/protected`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader || '',
          'Origin': request.headers.get('origin') || '',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        console.error('Protected route check failed:', await response.text());
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      const data = await response.json();
      const userRole = data.role;

      if (isProtecedRouteAdmin && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }

      if (isProtecedRouteUser && userRole === 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }

    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
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
