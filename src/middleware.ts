import axios from 'axios';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiUrl } from './app/data/data-option';
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  try {
    const response = await axios.get(`${apiUrl}/protected`,{
      headers:{
        'Authorization':`${token?.value}`,
      },
    });
    console.log(response.data);
  } catch (error : any) {
      if(error?.response){
        console.error('Response status:', error?.response.status);
        console.error('Response data:', error?.response.data);
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
  }
  return NextResponse.next();
  
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/overview:path*','/'],
}