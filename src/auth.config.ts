import type { NextAuthConfig } from 'next-auth';
import { env } from './lib/env';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnBoarding = nextUrl.pathname.startsWith('/onboarding');
            if (isOnDashboard || isOnBoarding) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                if (nextUrl.pathname === '/login') {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
            }
            return true;
        },
    },
    providers: [],
    secret: env.AUTH_SECRET,
} satisfies NextAuthConfig;
