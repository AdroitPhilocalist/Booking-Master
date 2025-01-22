// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // We'll use jose instead of jsonwebtoken for edge runtime
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to the admin login page without any restrictions
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Allow access to the normal user login page without any restrictions
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Check for admin routes
  if (pathname.startsWith('/admin')) {
    const admintoken = request.cookies.get('adminauthToken')?.value;
    console.log('Admin Token from cookies:', admintoken);
    if (!admintoken) {
      console.log('No admin token found, redirecting to admin login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      // Verify the admin token using jose
      await jwtVerify(admintoken, new TextEncoder().encode(SECRET_KEY));
      // Token is valid, continue to the protected route
      return NextResponse.next();
    } catch (error) {
      console.error('Admin token verification failed:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Check for normal user routes
  if (pathname.startsWith('/property') || pathname.startsWith('/master') || pathname.startsWith('/Restaurant') || pathname.startsWith('/Inventory')) {
    const token = request.cookies.get('authToken')?.value;
    console.log('User Token from cookies:', token);
    if (!token) {
      console.log('No user token found, redirecting to login');
      return NextResponse.redirect(new URL('/', request.url));
    }
    try {
      // Verify the user token using jose
      await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      // Token is valid, continue to the protected route
      return NextResponse.next();
    } catch (error) {
      console.error('User token verification failed:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // If none of the conditions match, continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ['/property/:path*', '/master/:path*', '/Restaurant/:path*', '/Inventory/:path*', '/admin/:path*'],
};