'use client'

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 py-16 md:py-24 relative overflow-hidden transition-colors duration-500">
            {}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 text-[20vw] font-black font-serif text-slate-900/[0.02] dark:text-white/[0.02] pointer-events-none select-none whitespace-nowrap">
                EDUGUIDE
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="font-serif font-black text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="text-3xl text-indigo-600">❖</span> EduGuide
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Empowering self-directed learners with the structure of a university degree and the flexibility of AI.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">EduGuide Academy</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Professional Development</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">FAQs</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Community</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">About Us</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Contact</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Blog</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1 transition-all inline-block">Branding</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Socials</h4>
                        <div className="flex gap-4 mb-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1"><Twitter className="h-4 w-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1"><Facebook className="h-4 w-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1"><Linkedin className="h-4 w-4" /></a>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1"><Instagram className="h-4 w-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all hover:-translate-y-1"><Youtube className="h-4 w-4" /></a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-500">
                    <div className="mb-4 md:mb-0">
                        © 2026 EduGuide AI LLC. All Rights Reserved.
                    </div>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
