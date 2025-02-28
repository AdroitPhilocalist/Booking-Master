import { NextResponse } from "next/server";
import { jwtVerify } from "jose"; // We'll use jose instead of jsonwebtoken for edge runtime

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const cookie = request.cookies.get('authToken')?.value; // Hotel authToken
  const userToken = request.cookies.get("userAuthToken")?.value; // User authToken
  const adminToken = request.cookies.get("adminauthToken")?.value; // Admin authToken

  // Allow access to the admin login page without any restrictions
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Allow access to the normal user login page without any restrictions
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Redirect logged-in hotel users from root (/) to property dashboard if only cookie exists
  if (pathname === '/' && cookie && !userToken) {
    return NextResponse.redirect(new URL('/property/roomdashboard', request.url));
  }

  // Redirect logged-in users from root (/) to their first role's route if userToken exists
  if (pathname === "/" && userToken) {
    try {
      // Verify the user token
      const decoded = await jwtVerify(userToken, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id; // Assuming the token payload has the user's ID

      // Fetch user data to get roles
      const userRes = await fetch(
        `${request.nextUrl.origin}/api/User/${userId}`,
        {
          headers: { "Cookie": `userAuthToken=${userToken}` }, // Pass the token in the request
        }
      );
      const userData = await userRes.json();
      console.log("User data:", userData);
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

  // Check for normal user routes (Property, Master, Restaurant, Inventory)
  if (
    pathname.startsWith("/property") ||
    pathname.startsWith("/master") ||
    pathname.startsWith("/Restaurant") ||
    pathname.startsWith("/Inventory")
  ) {
    if (!userToken && !cookie) {
      console.log("No user or hotel token found, redirecting to hotel login");
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // Verify the tokens
      if (userToken) await jwtVerify(userToken, new TextEncoder().encode(SECRET_KEY));
      if (cookie) await jwtVerify(cookie, new TextEncoder().encode(SECRET_KEY));

      // If userToken exists, restrict routes based on roles
      if (userToken) {
        const decoded = await jwtVerify(userToken, new TextEncoder().encode(SECRET_KEY));
        const userId = decoded.payload.userId;

        // Fetch user data to get roles
        const userRes = await fetch(
          `${request.nextUrl.origin}/api/User/${userId}`,
          {
            headers: { "Cookie": `userAuthToken=${userToken}` },
          }
        );
        const userData = await userRes.json();

        if (userData.success && userData.data && userData.data.roles) {
          const roles = userData.data.roles;

          // Define allowed routes based on roles
          const allowedRoutes = [];
          if (roles.includes("Property & Frontdesk")) {
            allowedRoutes.push("/property");
          }
          if (roles.includes("Restaurant")) {
            allowedRoutes.push("/Restaurant");
          }
          if (roles.includes("Inventory")) {
            allowedRoutes.push("/Inventory");
          }

          // Explicitly block Master routes for users with userAuthToken
          if (pathname.startsWith("/master")) {
            console.log("User with userAuthToken attempted to access unauthorized Master route, redirecting to first allowed route");

            // Find the first allowed route to redirect to
            let redirectPath = "/user/login"; // Default fallback to user login
            if (roles.length > 0) {
              const firstRole = roles[0];
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
              }
            }
            return NextResponse.redirect(new URL(redirectPath, request.url));
          }

          // Check if the current path is allowed based on roles
          const isRouteAllowed = allowedRoutes.some(route => pathname.startsWith(route));
          if (!isRouteAllowed) {
            console.log("User attempted to access unauthorized route, redirecting to first allowed route");

            // Find the first allowed route to redirect to
            let redirectPath = "/user/login"; // Default fallback to user login
            if (roles.length > 0) {
              const firstRole = roles[0];
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
              }
            }
            return NextResponse.redirect(new URL(redirectPath, request.url));
          }
        } else {
          console.log("No roles found for user, redirecting to hotel login");
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      // If only cookie (authToken) exists, allow access to all routes
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If none of the conditions match, continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/property/:path*", "/master/:path*", "/Restaurant/:path*", "/Inventory/:path*", "/admin/:path*"],
};