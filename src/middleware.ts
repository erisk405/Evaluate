import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const protectedPathsAdmin = ['/management', '/evaluation'];
  const protectedPathsUser = ['/overview/department', '/personal_evaluation', '/history'];
  const currentPath = request.nextUrl.pathname;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;

  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  const isProtectedRouteAdmin = protectedPathsAdmin.some((path) => currentPath.startsWith(path));
  const isProtectedRouteUser = protectedPathsUser.some((path) => currentPath.startsWith(path));

  try {
    const cookies = request.headers.get('cookie') || '';
    console.log("cookies",cookies);
    
    const response = await axios.get(`${apiUrl}/protected`, {
      withCredentials: true,
      headers: { Cookie: cookies },
    });
    const userRole = response.data.role;

    if (isProtectedRouteAdmin && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
    if (isProtectedRouteUser && userRole === 'admin') {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
  } catch (error: any) {
    console.error('Error in middleware:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
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
    '/',
  ],
};
