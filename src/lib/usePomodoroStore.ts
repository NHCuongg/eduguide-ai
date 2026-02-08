import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PomodoroState {
    timeLeft: number
    isRunning: boolean
    mode: 'focus' | 'shortBreak' | 'longBreak'
    setTime: (time: number) => void
    startTimer: () => void
    pauseTimer: () => void
    resetTimer: () => void
    setMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void
    tick: () => void
}

const DEFAULT_TIMES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
}

export const usePomodoroStore = create<PomodoroState>()(
    persist(
        (set, get) => ({
            timeLeft: DEFAULT_TIMES.focus,
            isRunning: false,
            mode: 'focus',
            setTime: (time) => set({ timeLeft: time }),
            startTimer: () => set({ isRunning: true }),
            pauseTimer: () => set({ isRunning: false }),
            resetTimer: () => set((state) => ({
                timeLeft: DEFAULT_TIMES[state.mode],
                isRunning: false
            })),
            setMode: (mode) => set({
                mode,
                timeLeft: DEFAULT_TIMES[mode],
                isRunning: false
            }),
            tick: () => set((state) => {
                if (state.timeLeft <= 0) {
                    return { isRunning: false, timeLeft: 0 }
                }
                return { timeLeft: state.timeLeft - 1 }
            }),
        }),
        {
            name: 'pomodoro-storage',
        }
    )
)
