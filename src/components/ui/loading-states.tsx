// Loading state components for better UX
import { Skeleton } from "./skeleton"
import { Loader2 } from "lucide-react"

export function CardSkeleton() {
    return (
        <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-4 w-40" />
        </div>
    )
}

export function QuizLoadingSkeleton() {
    return (
        <div className="space-y-6 py-4">
            <div className="flex justify-between">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-11 w-32 ml-auto" />
        </div>
    )
}

export function FlashcardLoadingSkeleton() {
    return (
        <div className="flex flex-col items-center gap-6">
            <Skeleton className="h-[350px] w-full rounded-3xl" />
            <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-2 w-32 rounded-full" />
                <Skeleton className="h-14 w-14 rounded-full" />
            </div>
        </div>
    )
}

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    }
    
    return (
        <div className="flex items-center justify-center">
            <div className="relative">
                <div className={`absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse`} />
                <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600 dark:text-indigo-400 relative`} />
            </div>
        </div>
    )
}
