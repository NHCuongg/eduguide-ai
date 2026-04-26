'use client'

import { Button } from '@/components/ui/button'
import { Printer } from 'lucide-react'

export function ExportButton() {
    const handleExport = () => {
        window.print()
    }

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2 h-12 px-4 border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg text-slate-700 dark:text-slate-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all rounded-xl print:hidden"
        >
            <Printer className="w-5 h-5" />
            Export Study Plan
        </Button>
    )
}
