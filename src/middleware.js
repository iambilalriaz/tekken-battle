import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { APP_ROUTES } from '@/constants/app-routes';

const AUTH_PAGES = [APP_ROUTES.LOGIN, APP_ROUTES.SIGNUP];

const getJwtSecret = () =>
  new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('accessToken')?.value;

  // Auth route → redirect to dashboard if already logged in
  if (AUTH_PAGES.includes(pathname)) {
    if (token) {
      try {
        await jwtVerify(token, getJwtSecret());
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      } catch {
        return NextResponse.next(); // Invalid token, allow login/signup
      }
    }
    return NextResponse.next();
  } else {
    // Protected route → redirect to login if not logged in

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    try {
      await jwtVerify(token, getJwtSecret());
      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: ['/login', '/signup', '/dashboard'],
};
