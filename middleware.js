import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // We'll use jose instead of jsonwebtoken for edge runtime

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;
  
  console.log('Token from cookies:', token);

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Verify the token using jose
    await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    
    // Token is valid, continue to the protected route
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/property/:path*', '/master/:path*', '/Restaurant/:path*', '/Inventory/:path*'],
};