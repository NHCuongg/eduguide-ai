import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OnboardingData } from './schemas'
import { Roadmap } from './types'

interface WizardState {
    currentStep: number
    data: Partial<OnboardingData>
    roadmap: Roadmap | null
    completedModules: string[]
    activeModuleId: string | null
    setData: (data: Partial<OnboardingData>) => void
    setRoadmap: (roadmap: Roadmap) => void
    toggleModule: (moduleId: string) => void
    setActiveModule: (moduleId: string) => void
    nextStep: () => void
    prevStep: () => void
    reset: () => void
}

export const useWizardStore = create<WizardState>()(
    persist(
        (set) => ({
            currentStep: 1,
            data: {},
            roadmap: null,
            completedModules: [],
            activeModuleId: null,
            setData: (newData: Partial<OnboardingData>) => set((state) => ({ data: { ...state.data, ...newData } })),
            setRoadmap: (roadmap: Roadmap) => set({ roadmap }),
            toggleModule: (moduleId: string) => set((state) => {
                const exists = state.completedModules.includes(moduleId)
                return {
                    completedModules: exists
                        ? state.completedModules.filter(id => id !== moduleId)
                        : [...state.completedModules, moduleId]
                }
            }),
            setActiveModule: (activeModuleId: string) => set({ activeModuleId }),
            nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
            prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
            reset: () => set({
                currentStep: 1,
                data: {},
                roadmap: null,
                completedModules: [],
                activeModuleId: null
            }),
        }),
        {
            name: 'wizard-storage',
            partialize: (state) => ({
                data: state.data,
                roadmap: state.roadmap,
                completedModules: state.completedModules,
                currentStep: state.currentStep,
            }),
            storage: {
                getItem: (name) => {
                    if (typeof window === 'undefined') return null
                    const str = localStorage.getItem(name)
                    if (!str) return null
                    return JSON.parse(str)
                },
                setItem: (name, value) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(name, JSON.stringify(value))
                    }
                },
                removeItem: (name) => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(name)
                    }
                },
            },
        }
    )
)
