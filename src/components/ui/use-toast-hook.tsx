'use client'

export const useToast = () => {
    return {
        toast: (props: Record<string, unknown>) => {
            console.log('Toast:', props)
        }
    }
}
