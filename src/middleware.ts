import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiUrl } from './app/data/data-option';

export async function middleware(request: NextRequest) {
  const protectedPathsAdmin = ['/management', '/evaluation'];
  const protectedPathsUser = ['/overview/department', '/personal_evaluation', '/history'];
  const currentPath = request.nextUrl.pathname;

  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  const isProtecedRouteAdmin = protectedPathsAdmin.some(path => currentPath.startsWith(path));
  const isProtecedRouteUser = protectedPathsUser.some(path => currentPath.startsWith(path));

  async function verifyToken() {
    try {
      // Get all cookies from the request
      const cookie = request.headers.get('cookie');
      
      // Create headers object with cookies
      const headers = new Headers();
      if (cookie) {
        headers.set('Cookie', cookie);
      }

      // Make the API request with proper credentials and headers
      const response = await fetch(`${apiUrl}/protected`, {
        credentials: 'include',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  if (isProtecedRouteAdmin || isProtecedRouteUser) {
    try {
      const userData = await verifyToken();
      
      if (isProtecedRouteAdmin && userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }

      if (isProtecedRouteUser && userData.role === 'admin') {
        return NextResponse.redirect(new URL('/overview', request.url));
      }

      // If verification passes, allow the request to continue
      const response = NextResponse.next();
      
      // Set CORS headers if needed
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '');
      
      return response;

    } catch (error) {
      // Redirect to sign-in on any error
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