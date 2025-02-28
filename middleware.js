import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // We'll use jose instead of jsonwebtoken for edge runtime

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get('authToken')?.value;
  const userToken = request.cookies.get("userAuthToken")?.value; // Use userAuthToken for normal users
  const adminToken = request.cookies.get("adminauthToken")?.value;

  // Allow access to the admin login page without any restrictions
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Allow access to the normal user login page without any restrictions
  if (pathname === '/') {
    return NextResponse.next();
  }
  else if (pathname === '/' && cookie) {
    return NextResponse.redirect(new URL('/property/roomdashboard', request.url));
  }

  // Redirect logged-in users from root (/) to their first role's route
  if (pathname === "/" && userToken) {
    try {
      // Verify the user token
      const decoded = await jwtVerify(userToken, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id; // Assuming the token payload has the user's ID

      // Fetch user data to get roles
      const userRes = await fetch(
        `${request.nextUrl.origin}/api/User?id=${encodeURIComponent(userId)}`,
        {
          headers: { "Cookie": `userAuthToken=${userToken}` }, // Pass the token in the request
        }
      );
      const userData = await userRes.json();

      if (userData.success && userData.data && userData.data.roles) {
        const roles = userData.data.roles;
        if (roles.length > 0) {
          const firstRole = roles[0]; // Get the first role from the array
          console.log("First role:", firstRole);
          let redirectPath = "/dashboard"; // Default redirect if no role match
          switch (firstRole) {
            case "Property & Frontdesk":
              redirectPath = "/property/roomdashboard";
              break;
            case "Restaurant":
              redirectPath = "/Restaurant/dashboard";
              break;
            case "Inventory":
              redirectPath = "/Inventory/Category";
              break;
            default:
              redirectPath = "/dashboard"; // Fallback redirect
          }
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
      }
      return NextResponse.next(); // Fallback if no roles or fetch fails
    } catch (error) {
      console.error("User token verification or role fetch failed:", error);
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to login if token is invalid
    }
  }

  // Check for admin routes
  if (pathname.startsWith("/admin")) {
    if (!adminToken) {
      console.log("No admin token found, redirecting to admin login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    try {
      // Verify the admin token using jose
      await jwtVerify(adminToken, new TextEncoder().encode(SECRET_KEY));
      // Token is valid, continue to the protected route
      return NextResponse.next();
    } catch (error) {
      console.error("Admin token verification failed:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Check for normal user routes
  if (
    pathname.startsWith("/property") ||
    pathname.startsWith("/master") ||
    pathname.startsWith("/Restaurant") ||
    pathname.startsWith("/Inventory")
  ) {
    if (!userToken && !cookie) {
      console.log("No user token found, redirecting to login");
      return NextResponse.redirect(new URL("/", request.url));
    }
    try {
      // Verify the user token using jose
      if(userToken) await jwtVerify(userToken, new TextEncoder().encode(SECRET_KEY));
      if(cookie) await jwtVerify(cookie, new TextEncoder().encode(SECRET_KEY));
      // Token is valid, continue to the protected route
      return NextResponse.next();
    } catch (error) {
      console.error("User token verification failed:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If none of the conditions match, continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/property/:path*", "/master/:path*", "/Restaurant/:path*", "/Inventory/:path*", "/admin/:path*"],
};