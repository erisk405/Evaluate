import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { apiUrl } from './app/data/data-option';

export async function middleware(request: NextRequest) {
  const protectedPaths = '/management';  // paths ที่จะต้องการให้ admin เข้าได้เท่านั้น
  const currentPath = request.nextUrl.pathname;

  // ถ้า path คือ root "/" redirect ไปยัง "/overview"
  if (currentPath === '/') {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // เช็ค token จาก API
  try {
    const response = await axios.get(`${apiUrl}/protected`, {
      withCredentials: true,
      headers: {
        Cookie: request.headers.get('cookie') || '', // Forward cookies จาก client request
      },
    });
    
    const userRole = response.data.role; // สมมุติว่า role มาจาก API response
    // console.log("Protected:",currentPath.startsWith(protectedPaths));
    // console.log("Protected_currentPath:",currentPath);
    // console.log("Role:",userRole);
    
    // ตรวจสอบ role
    if (currentPath.startsWith(protectedPaths) && userRole !== 'admin') {
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

  return NextResponse.next(); // อนุญาตให้ผ่านสำหรับ paths อื่น ๆ
}

// กำหนด paths ที่จะเรียกใช้ middleware
export const config = {
  matcher: ['/overview:path*', '/management/:path*', '/'], // matcher ที่ต้องการตรวจสอบ
};
