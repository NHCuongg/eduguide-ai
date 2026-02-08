'use client'

export const useToast = () => {
    return {
        toast: (props: any) => {
            console.log('Toast:', props)
        }
    }
}
