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
        <div className="grid md:grid-cols-[auto_1fr] gap-6">
            <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardContent className="p-8">
                    <div className="[&_.rdp]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-table]:border-separate [&_.rdp-table]:border-spacing-2 [&_.rdp-weekday]:w-[calc(var(--cell-size)+0.5rem)] [&_.rdp-weekday]:text-center [&_.rdp-day]:w-[calc(var(--cell-size)+0.5rem)] [&_.rdp-day_button]:w-[--cell-size] [&_.rdp-day_button]:h-[--cell-size]">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-2xl [--cell-size:2.75rem]"
                            classNames={{
                                root: "w-full",
                                months: "w-full",
                                month: "w-full space-y-6",
                                caption: "flex justify-center pt-1 relative items-center mb-6",
                                caption_label: "text-xl font-black text-slate-900 dark:text-white tracking-tight",
                                nav: "space-x-1 absolute items-center justify-between w-full px-1",
                                button_previous: "absolute left-0 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110",
                                button_next: "absolute right-0 h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-110",
                                table: "w-full border-separate",
                                weekdays: "flex mb-4 justify-between",
                                weekday: "w-[--cell-size] text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider py-2",
                                week: "flex w-full mt-2 justify-between",
                                day: "w-[--cell-size] text-center p-0 relative",
                                day_button: "h-[--cell-size] w-[--cell-size] rounded-xl font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center",
                                selected: "!bg-gradient-to-br !from-indigo-600 !to-violet-600 !text-white !font-bold !shadow-lg !shadow-indigo-500/50 hover:!from-indigo-700 hover:!to-violet-700",
                                today: "!bg-indigo-100 dark:!bg-indigo-900/40 !text-indigo-700 dark:!text-indigo-300 !font-bold !border-2 !border-indigo-300 dark:!border-indigo-700",
                                outside: "text-slate-400 dark:text-slate-600 opacity-50",
                            }}
                        modifiers={{
                            booked: mockSchedule.map(s => s.date)
                        }}
                        modifiersStyles={{
                            booked: { 
                                border: '2px solid rgb(99, 102, 241)', 
                                fontWeight: 'bold', 
                                color: 'rgb(99, 102, 241)',
                                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                borderRadius: '0.75rem',
                                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                            }
                        }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-shadow rounded-2xl bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                <CardHeader className="pb-4 border-b-2 border-slate-100 dark:border-slate-800">
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                            <CalendarIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                            {date ? format(date, "MMMM do, yyyy") : "Selected Date"}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    {selectedDayEvents.length > 0 ? (
                        <div className="space-y-3">
                            {selectedDayEvents.map((event, idx) => (
                                <div 
                                    key={idx} 
                                    className="flex items-center p-5 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-800/30 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform">
                                        <Clock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">{event.title}</h4>
                                        <Badge 
                                            variant="secondary" 
                                            className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold"
                                        >
                                            {event.type}
                                        </Badge>
                                    </div>
                                    <div className="ml-auto text-sm font-bold text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                                        2:00 PM
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-2xl animate-pulse" />
                                <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 flex items-center justify-center border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
                                    <CalendarIcon className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </div>
                            <div className="text-center space-y-3 max-w-sm">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                    No sessions scheduled
                                </h3>
                                <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    You don&apos;t have any learning sessions scheduled for this day. Take a break or explore new topics!
                                </p>
                            </div>
                            <div className="mt-8 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border border-indigo-200 dark:border-indigo-800">
                                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                    🎉 Enjoy your free time!
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
