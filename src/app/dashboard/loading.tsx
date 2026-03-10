export default function DashboardLoading() {
    return (
        <div className="flex-1 overflow-y-auto p-8 space-y-8 animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mb-2" />
                    <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800/50 rounded" />
                </div>
                <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>

            {/* Stat cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                        <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Continue learning skeleton */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="flex items-center gap-6">
                    <div className="h-32 w-32 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    <div className="flex-1 space-y-3">
                        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-700 rounded" />
                        <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Study tools skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    )
}
