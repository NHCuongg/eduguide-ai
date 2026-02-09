'use client'

import { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-6 max-w-md">
                {(error as Error).message || 'An unexpected error occurred. Please try again.'}
            </p>
            <div className="flex gap-3">
                <Button onClick={resetErrorBoundary} variant="default">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline">
                    Go home
                </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-6 text-left max-w-2xl">
                    <summary className="cursor-pointer text-sm text-slate-500 mb-2">
                        Error details (development only)
                    </summary>
                    <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto">
                        {(error as Error).stack}
                    </pre>
                </details>
            )}
        </div>
    )
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: React.ComponentType<FallbackProps>
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
    return (
        <ReactErrorBoundary FallbackComponent={fallback || ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    )
}
