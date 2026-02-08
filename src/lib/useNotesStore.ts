import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface Note {
    id: string
    title: string
    content: string
    createdAt: number
    updatedAt: number
}

interface NotesState {
    notes: Note[]
    addNote: (title: string, content: string) => void
    updateNote: (id: string, updates: Partial<Note>) => void
    deleteNote: (id: string) => void
}

export const useNotesStore = create<NotesState>()(
    persist(
        (set) => ({
            notes: [],
            addNote: (title, content) => set((state) => ({
                notes: [
                    {
                        id: uuidv4(),
                        title,
                        content,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    },
                    ...state.notes,
                ],
            })),
            updateNote: (id, updates) => set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === id
                        ? { ...note, ...updates, updatedAt: Date.now() }
                        : note
                ),
            })),
            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter((note) => note.id !== id),
            })),
        }),
        {
            name: 'notes-storage',
        }
    )
)
