import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 1. Liste des routes à protéger.
 * Si l'URL commence par l'un de ces mots, l'accès est vérifié.
 */
const protectedRoutes = ['/dashboard', '/profile', '/caterer', '/settings'];

/**
 * 2. Liste des routes "publiques" à ignorer (facultatif).
 * Par exemple, si /caterer/register doit rester accessible.
 */
const publicPaths = ['/caterer/register', '/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Récupérer le cookie de session généré par Laravel
  // Note : Laravel nomme souvent ce cookie 'laravel_session' ou 'XSRF-TOKEN'
  const sessionCookie = request.cookies.get('laravel_session');
  const xsrfCookie = request.cookies.get('XSRF-TOKEN');

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicPath = publicPaths.some((path) => pathname === path);

  if (isProtectedRoute && !isPublicPath && !sessionCookie && !xsrfCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/'; // Redirection vers la racine
    
    
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (routes d'API Next.js internes)
     * - _next/static (fichiers JS/CSS statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico, images public (png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};