'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, BookOpen, GraduationCap, FileText, ListChecks, Search } from "lucide-react"
import { useGamificationStore } from "@/lib/useGamificationStore"
import type { RoadmapResource } from "@/lib/types"

interface Props {
    moduleTitle: string
    resources?: RoadmapResource[]
}

const TYPE_ICON: Record<string, typeof BookOpen> = {
    Reading: BookOpen,
    Quiz: ListChecks,
    Flashcard: GraduationCap,
    Exercise: FileText,
}

function isHttpUrl(value: string): boolean {
    return /^https?:\/\//i.test(value.trim())
}

export function ResourceModal({ moduleTitle, resources }: Props) {
    const { addXP } = useGamificationStore()

    const aiResources = (resources ?? []).filter((r) => r.title?.trim().length > 0)
    const fallbackSearch = `https://www.google.com/search?q=${encodeURIComponent(moduleTitle)}`

    const handleResourceClick = () => {
        addXP(5)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-slate-700 dark:text-slate-200 gap-2 rounded-lg border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-4 h-4" /> Resources
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Study resources</DialogTitle>
                    <DialogDescription>
                        Tài liệu cho <span className="font-semibold text-slate-900 dark:text-white">{moduleTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2">
                    {aiResources.length > 0 ? (
                        aiResources.map((resource, idx) => {
                            const Icon = TYPE_ICON[resource.type] ?? BookOpen
                            const href = isHttpUrl(resource.url)
                                ? resource.url
                                : `https://www.google.com/search?q=${encodeURIComponent(resource.url)}`
                            return (
                                <a
                                    key={`${resource.title}-${idx}`}
                                    href={href}
                                    onClick={handleResourceClick}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                            {resource.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{resource.type}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                                </a>
                            )
                        })
                    ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400 px-1 py-2">
                            Không có tài liệu được đề xuất sẵn cho mô-đun này.
                        </p>
                    )}

                    <a
                        href={fallbackSearch}
                        onClick={handleResourceClick}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-3 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-colors mt-1"
                    >
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200">Tìm thêm trên Google</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">Mở kết quả tìm kiếm cho từ khoá module</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    )
}
