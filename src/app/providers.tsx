'use client'

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <SessionProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                    <Toaster 
                        position="top-right"
                        richColors
                        closeButton
                    />
                </ThemeProvider>
            </SessionProvider>
        </ErrorBoundary>
    );
}
