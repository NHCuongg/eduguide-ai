'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { setActiveRoadmap, deleteRoadmap } from "@/app/actions/onboarding"
import { showToast } from "@/lib/toast"
import { Loader2 } from "lucide-react"

interface Props {
    courseId: string
    status: "active" | "completed" | "archived"
}

export function CourseCardActions({ courseId, status }: Props) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [confirmDelete, setConfirmDelete] = useState(false)

    const handleSetActive = () => {
        startTransition(async () => {
            const result = await setActiveRoadmap(courseId)
            if (result.success) {
                showToast.success("Đã đổi khóa học active", "Refreshing dashboard…")
                router.refresh()
            } else {
                showToast.error("Không thể chuyển khóa", result.error ?? "Unknown error")
            }
        })
    }

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true)
            return
        }
        startTransition(async () => {
            const result = await deleteRoadmap(courseId)
            if (result.success) {
                showToast.success("Đã xoá khóa học", "")
                router.refresh()
            } else {
                showToast.error("Không thể xoá", result.error ?? "Unknown error")
                setConfirmDelete(false)
            }
        })
    }

    return (
        <div className="flex items-center gap-2">
            {status !== "active" ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    onClick={handleSetActive}
                    className="text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 h-8 px-3"
                >
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Make active"}
                </Button>
            ) : null}
            <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={handleDelete}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 px-3"
            >
                {confirmDelete ? "Confirm?" : "Delete"}
            </Button>
        </div>
    )
}
