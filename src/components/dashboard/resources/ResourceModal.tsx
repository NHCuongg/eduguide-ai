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
import { ExternalLink, Youtube, BookOpen, Video } from "lucide-react"
import { useGamificationStore } from "@/lib/useGamificationStore"

export function ResourceModal({ moduleTitle }: { moduleTitle: string }) {
    const { addXP } = useGamificationStore()

    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(moduleTitle + " tutorial")}`
    const googleScholarUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(moduleTitle)}`
    const mediumUrl = `https://medium.com/search?q=${encodeURIComponent(moduleTitle)}`

    const handleResourceClick = () => {
        addXP(5) 
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-slate-600 gap-2">
                    <BookOpen className="w-4 h-4" /> Resources
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Study Resources</DialogTitle>
                    <DialogDescription>
                        Curated content for <span className="font-bold text-indigo-600">{moduleTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {}
                    <a href={youtubeSearchUrl} onClick={handleResourceClick} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 rounded-xl border hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Youtube className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-red-700">Watch Video Tutorials</h4>
                            <p className="text-xs text-slate-500">Find top-rated lectures on YouTube</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-red-400" />
                    </a>

                    {}
                    <a href={googleScholarUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 rounded-xl border hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-700">Academic Papers</h4>
                            <p className="text-xs text-slate-500">Read deep-dive research via Google Scholar</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                    </a>

                    {}
                    <a href={mediumUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 rounded-xl border hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Video className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 group-hover:text-slate-700">Community Articles</h4>
                            <p className="text-xs text-slate-500">Practical guides on Medium/Blogs</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    )
}
