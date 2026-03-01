import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { env } from './lib/env';
import { db } from './lib/db';
import { users } from './lib/db/schema';
import { eq } from 'drizzle-orm';

const getUser = async (email: string) => {
    try {
        const userArr = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (userArr.length > 0) {
            return userArr[0];
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
    }
    return null;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user || (!user.password && user.email)) {
                        
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password as string);
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
