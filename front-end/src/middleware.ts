import { NextRequest, NextResponse } from "next/server";

const routePermissions = [
  {
    prefix: "/client",
    roles: ["client"],
  },
  {
    prefix: "/caterer",
    roles: ["traiteur"],
  },
  {
    prefix: "/admin",
    roles: ["admin"],
  },
];

// Routes publiques (non protégées)
const publicRoutes = [
  "/caterer",
  "/caterer/test",
  "/caterer/public",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  // Vérifie si la route est publique
  const isPublicRoute = publicRoutes.some(route => {
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Non connecté
  if (!token) {
    const protectedRoute = routePermissions.some(r =>
      pathname.startsWith(r.prefix)
    );

    if (protectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // Vérification du rôle
  const route = routePermissions.find(r =>
    pathname.startsWith(r.prefix)
  );

  if (route && !route.roles.includes(role ?? "")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:path*",
    "/caterer/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};