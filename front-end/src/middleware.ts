// middleware.ts
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

// Page d'accueil de chaque rôle (utilisée quand un utilisateur connecté va sur /login ou /register)
const roleHome: Record<string, string> = {
  client: "/client/dashboard",
  traiteur: "/caterer/dashboard",
  admin: "/admin/dashboard",
};

// Pages de connexion
const authRoutes = ["/login", "/register"];

// Routes publiques (non protégées)
const publicRoutes = [
  "/caterer",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const pathname = request.nextUrl.pathname;

  // Pages de connexion : un utilisateur déjà connecté est renvoyé vers son espace
  const isAuthRoute = authRoutes.some(route => {
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isAuthRoute) {
    const home = role ? roleHome[role] : undefined;

    if (token && home) {
      return NextResponse.redirect(new URL(home, request.url));
    }

    return NextResponse.next();
  }

  // Vérifie si la route est publique
  const isPublicRoute = publicRoutes.includes(pathname);

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