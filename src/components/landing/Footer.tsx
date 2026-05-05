import Link from "next/link"
import { Twitter, Linkedin, Github } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 py-14">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
                    <div className="col-span-2 md:col-span-1 space-y-3">
                        <div className="font-serif font-semibold text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="text-xl text-indigo-500">❖</span> EduGuide
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                            Empowering self-directed learners with the structure of a university and the flexibility of AI.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Product
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#methodology" className="hover:text-slate-900 dark:hover:text-white transition-colors">Methodology</Link></li>
                            <li><Link href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/onboarding" className="hover:text-slate-900 dark:hover:text-white transition-colors">Get started</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Company
                        </h4>
                        <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                            Connect
                        </h4>
                        <div className="flex gap-2">
                            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                                <Twitter className="h-3.5 w-3.5" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                                <Linkedin className="h-3.5 w-3.5" />
                            </a>
                            <a href="#" aria-label="GitHub" className="w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
                                <Github className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
                    <p>© 2026 EduGuide AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
