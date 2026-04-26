'use client'

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useWizardStore } from "@/lib/store"

/**
 * If `?fresh=1` is present, wipe wizard state once on mount so the user
 * starts a brand-new course wizard from step 1.
 */
export default function WizardResetGuard() {
    const params = useSearchParams()
    const fresh = params.get("fresh")

    useEffect(() => {
        if (fresh === "1") {
            useWizardStore.getState().reset()
        }
    }, [fresh])

    return null
}
