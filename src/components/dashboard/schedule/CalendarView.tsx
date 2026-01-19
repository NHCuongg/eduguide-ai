'use client'

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { addDays, format, isSameDay } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

// Mock schedule data - In a real app, this would come from the store/backend
const mockSchedule = [
    { date: new Date(), title: "Intro to Astrophysics", type: "Module" },
    { date: addDays(new Date(), 2), title: "Calculus Review", type: "Practice" },
    { date: addDays(new Date(), 3), title: "Quantum Physics I", type: "Module" },
    { date: addDays(new Date(), 5), title: "Weekly Quiz", type: "Exam" },
]

export function CalendarView() {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const selectedDayEvents = mockSchedule.filter(event =>
        date && isSameDay(event.date, date)
    )

    return (
        <div className="grid md:grid-cols-[auto_1fr] gap-8">
            <Card className="border-none shadow-md">
                <CardContent className="p-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        modifiers={{
                            booked: mockSchedule.map(s => s.date)
                        }}
                        modifiersStyles={{
                            booked: { border: '2px solid var(--indigo-500)', fontWeight: 'bold', color: 'var(--indigo-600)' }
                        }}
                    />
                </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <CalendarIcon className="w-5 h-5 text-indigo-600" />
                        Schedule for {date ? format(date, "MMMM do, yyyy") : "Selected Date"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedDayEvents.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDayEvents.map((event, idx) => (
                                <div key={idx} className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 shadow-sm">
                                        <Clock className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{event.title}</h4>
                                        <Badge variant="secondary" className="mt-1 bg-white text-slate-500 border-slate-200">
                                            {event.type}
                                        </Badge>
                                    </div>
                                    <div className="ml-auto text-sm font-bold text-slate-400">
                                        2:00 PM
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            <p>No learning sessions scheduled for this day.</p>
                            <p className="text-sm mt-1">Enjoy your free time!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
