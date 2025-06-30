import { NextRequest, NextResponse } from 'next/server';

import pathsConfig from '~/config/paths.config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the Cognito token in cookies
  const idToken = request.cookies.get('id_token')?.value;

  const isAuthPage =
    pathname.startsWith(pathsConfig.auth.signIn) ||
    pathname.startsWith(pathsConfig.auth.signUp);

  const isProtectedPage = pathname.startsWith(pathsConfig.app.home);

  // If the user is authenticated
  if (idToken) {
    // If they try to access a sign-in/sign-up page, redirect to home
    if (isAuthPage) {
      return NextResponse.redirect(new URL(pathsConfig.app.home, request.url));
    }
  }
  // If the user is not authenticated
  else {
    // If they try to access a protected page, redirect to sign-in
    if (isProtectedPage) {
      const signInUrl = new URL(pathsConfig.auth.signIn, request.url);
      signInUrl.searchParams.set('next', pathname); // carry over the intended destination
      return NextResponse.redirect(signInUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Match all routes except for static assets, API routes, and the special _next folder
  matcher: [
    '/((?!api|_next/static|_next/image|images|favicon/|locales).*)',
  ],
};
