'use client'

import { usePathname } from 'next/navigation'
import RightWidgets from './RightWidgets'

export default function DashboardContentWrapper({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    
    const isMapPage = pathname === '/dashboard/plan'

    return (
        <>
            {}
            {

}

            {}
            {children}

            {}
            {!isMapPage && <RightWidgets />}
        </>
    )
}
