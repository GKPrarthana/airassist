import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const cognitoError = searchParams.get('error');

  // If Cognito returned an error, redirect to sign-in with that error
  if (cognitoError) {
    const errorDescription = searchParams.get('error_description');
    console.error(`Cognito Error: ${cognitoError}, Description: ${errorDescription}`);
    return redirect(`/auth/sign-in?error=${cognitoError}&error_description=${errorDescription}`);
  }

  if (!code) {
    // Handle case where there's no code and no error
    return redirect('/auth/sign-in?error=NoCognitoCode');
  }

  try {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGN_IN;

    if (!domain || !clientId || !redirectUri) {
      console.error('Cognito environment variables are not set');
      return redirect('/auth/sign-in?error=CognitoConfigError');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code: code,
      redirect_uri: redirectUri,
    });

    const response = await fetch(`${domain}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokens = await response.json();

    if (tokens.error) {
      console.error('Cognito token exchange error:', tokens.error);
      return redirect(`/auth/sign-in?error=${tokens.error}`);
    }

    const { id_token, access_token, refresh_token, expires_in } = tokens;

    // Create a response to set cookies and redirect
    const nextResponse = NextResponse.redirect(new URL('/home', request.url));

    // Set tokens in secure, httpOnly cookies
    nextResponse.cookies.set('id_token', id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expires_in,
      path: '/',
    });

    nextResponse.cookies.set('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: expires_in,
      path: '/',
    });

    if (refresh_token) {
      nextResponse.cookies.set('refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        path: '/',
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Failed to handle Cognito callback:', error);
    return redirect('/auth/sign-in?error=CallbackFailed');
  }
}
