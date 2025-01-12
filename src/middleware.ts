import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
  const protectedPathsAdmin = ['/management', '/evaluation'];  // paths ที่จะต้องการให้ admin เข้าได้เท่านั้น
  const protectedPathsUser = ['/overview/department', '/personal_evaluation', '/history'];  // paths ที่จะต้องการให้ user เข้าได้เท่านั้น
  const currentPath = request.nextUrl.pathname;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://localhost:8000/api`;
  // ถ้า path คือ root "/" redirect ไปยัง "/overview"
  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  const isProtecedRouteAdmin = protectedPathsAdmin.some(path => currentPath.startsWith(path))
  const isProtecedRouteUser = protectedPathsUser.some(path => currentPath.startsWith(path))

  // เช็ค token จาก API
  if (isProtecedRouteAdmin) {
    try {
      const response = await axios.get(`${apiUrl}/protected`, { withCredentials: true });

      const userRole = response.data.role; // สมมุติว่า role มาจาก API response
      // console.log("Protected:",currentPath.startsWith(protectedPaths));
      console.log("Protected_currentPath:", currentPath);
      console.log("Role:", userRole);

      // ตรวจสอบ role
      if (userRole !== 'admin') {
        // ถ้าไม่ใช่ admin แต่พยายามเข้าไปที่ /management
        return NextResponse.redirect(new URL('/overview', request.url));
      }
    } catch (error: any) {
      if (error?.response) {
        console.error('Response status:', error?.response.status);
        console.error('Response data:', error?.response.data);
      }
      // หาก token หรือ API request มีปัญหา redirect ไปหน้า sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  if (isProtecedRouteUser) {
    try {
      const response = await axios.get(`${apiUrl}/protected`, {
        withCredentials: true,
        headers: {
          Cookie: request.headers.get('cookie') || '', // Forward cookies จาก client request
        },
      });
      const userRole = response.data.role;
      if (userRole === 'admin') {
        // ถ้าไม่ใช่ admin แต่พยายามเข้าไปที่ /management
        return NextResponse.redirect(new URL('/overview', request.url));
      }
    } catch (error: any) {
      if (error?.response) {
        console.error('Response status:', error?.response.status);
        console.error('Response data:', error?.response.data);
      }
      // หาก token หรือ API request มีปัญหา redirect ไปหน้า sign-in
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  return NextResponse.next(); // อนุญาตให้ผ่านสำหรับ paths อื่น ๆ
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
