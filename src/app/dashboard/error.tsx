'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full text-center space-y-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
                <div className="mx-auto w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                        Có gì đó sai
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        Dashboard gặp lỗi không mong muốn. Hãy thử tải lại hoặc về trang chủ.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <Button
                        onClick={reset}
                        className="h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="h-10 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold gap-2"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                    </Button>
                </div>

                {error.digest ? (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        Error ID: {error.digest}
                    </p>
                ) : null}
            </div>
        </div>
    )
}
