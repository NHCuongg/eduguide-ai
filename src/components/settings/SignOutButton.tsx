'use client'

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWizardStore } from "@/lib/store"

export function SignOutButton() {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={async () => {
                if (typeof window !== "undefined") {
                    localStorage.clear()
                    sessionStorage.clear()
                }
                useWizardStore.getState().reset()
                await signOut({ callbackUrl: "/login" })
            }}
            className="gap-2 rounded-xl border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 h-11 px-5 font-semibold"
        >
            <LogOut className="h-4 w-4" />
            Sign out
        </Button>
    )
}
