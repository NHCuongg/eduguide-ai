'use client'

import { useState } from 'react'
import { useNotesStore, Note } from '@/lib/useNotesStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Save, FileText, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export function NotesPanel() {
    const { notes, addNote, updateNote, deleteNote } = useNotesStore()
    const [isCreating, setIsCreating] = useState(false)
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleCreate = () => {
        if (!title.trim()) return
        addNote(title, content)
        setTitle('')
        setContent('')
        setIsCreating(false)
    }

    const handleSave = () => {
        if (selectedNoteId && title.trim()) {
            updateNote(selectedNoteId, { title, content })
            setSelectedNoteId(null)
            setTitle('')
            setContent('')
        }
    }

    const selectNote = (note: Note) => {
        setSelectedNoteId(note.id)
        setTitle(note.title)
        setContent(note.content)
        setIsCreating(false)
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 flex flex-col h-[500px] shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="p-5 border-b-2 border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30">
                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    My Notes
                </h3>
                {!isCreating && !selectedNoteId && (
                    <Button
                        size="sm"
                        onClick={() => {
                            setIsCreating(true)
                            setTitle('')
                            setContent('')
                        }}
                        className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Note
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex">
                {}
                {(isCreating || selectedNoteId) ? (
                    <div className="flex-1 flex flex-col p-4 animate-in fade-in slide-in-from-right-4 duration-200">
                        <div className="mb-4 flex gap-2">
                            <Input
                                placeholder="Note Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-bold text-xl border-transparent focus-visible:ring-0 px-0 h-auto rounded-none border-b-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors bg-transparent"
                            />
                            <div className="flex gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsCreating(false)
                                        setSelectedNoteId(null)
                                    }}
                                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            placeholder="Write your thoughts here... (Markdown supported)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 resize-none border-none focus-visible:ring-0 p-0 text-zinc-600 dark:text-zinc-300 leading-relaxed"
                        />
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            {selectedNoteId && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        deleteNote(selectedNoteId)
                                        setSelectedNoteId(null)
                                    }}
                                    className="gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreating(false)
                                        setSelectedNoteId(null)
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={isCreating ? handleCreate : handleSave}
                                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {isCreating ? 'Create Note' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {notes.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                <div className="relative mb-4">
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl" />
                                    <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700 relative" />
                                </div>
                                <p className="font-medium text-lg mb-1">No notes yet</p>
                                <p className="text-sm">Create your first note to get started</p>
                            </div>
                        ) : (
                            notes.map((note) => (
                                <div
                                    key={note.id}
                                    onClick={() => selectNote(note)}
                                    className="group p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{note.title}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">{note.content || "No content"}</p>
                                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                        {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
