export default function DashboardLoading() {
    return (
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8" aria-busy="true" aria-live="polite">
                <div className="space-y-2">
                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-9 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                    <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                    {[0, 1, 2, 3].map((i) => (
                        <div key={i} className="p-5 md:p-6 space-y-3 animate-pulse">
                            <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-10 animate-pulse">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                        <div className="flex-1 space-y-3 w-full">
                            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                        <div className="h-32 w-32 md:h-40 md:w-40 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0" />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="px-6 py-5 flex items-center gap-4 animate-pulse">
                            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                                <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
