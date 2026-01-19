'use client'

import { usePathname } from 'next/navigation'
import RightWidgets from './RightWidgets'

export default function DashboardContentWrapper({
    children
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    // Check if we are on the study plan page (Gamified Map)
    const isMapPage = pathname === '/dashboard/plan'

    return (
        <>
            {/* Main Content Area */}
            {/* If it's the map page, we don't need extra padding or flex-col wrappers here if the page itself handles it.
                However, usually 'children' is the page component. 
                In the original layout: {children} was a flex item. 
                Reference layout: <div className="flex flex-1 overflow-hidden"> ... {children} <RightWidgets /> </div>
            */}

            {/* Render Children (The Page) */}
            {children}

            {/* Render RightWidgets ONLY if NOT on the map page */}
            {!isMapPage && <RightWidgets />}
        </>
    )
}
