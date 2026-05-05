'use client'

import { useEffect, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Save, X, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { listNotes, createNote, updateNote, deleteNote, type NoteRow } from '@/app/actions/notes'
import { showToast } from '@/lib/toast'

export function NotesPanel() {
    const t = useTranslations('notes')
    const [notes, setNotes] = useState<NoteRow[]>([])
    const [loading, setLoading] = useState(true)
    const [, startTransition] = useTransition()
    const [pending, setPending] = useState(false)

    const [isCreating, setIsCreating] = useState(false)
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    // Initial load
    useEffect(() => {
        let cancelled = false
        listNotes()
            .then((rows) => {
                if (!cancelled) setNotes(rows)
            })
            .catch(() => undefined)
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    const resetForm = () => {
        setIsCreating(false)
        setSelectedNoteId(null)
        setTitle('')
        setContent('')
    }

    const handleCreate = () => {
        if (!title.trim()) return
        setPending(true)
        startTransition(async () => {
            const result = await createNote({ title, content })
            setPending(false)
            if (result.success && result.note) {
                setNotes((prev) => [result.note!, ...prev])
                resetForm()
            } else {
                showToast.error(t('errorSave'), result.error ?? t('errorRetry'))
            }
        })
    }

    const handleSave = () => {
        if (!selectedNoteId || !title.trim()) return
        setPending(true)
        startTransition(async () => {
            const result = await updateNote({ id: selectedNoteId, title, content })
            setPending(false)
            if (result.success && result.note) {
                setNotes((prev) => prev.map((n) => (n.id === result.note!.id ? result.note! : n)))
                resetForm()
            } else {
                showToast.error(t('errorSave'), result.error ?? t('errorRetry'))
            }
        })
    }

    const handleDelete = () => {
        if (!selectedNoteId) return
        const id = selectedNoteId
        setPending(true)
        startTransition(async () => {
            const result = await deleteNote(id)
            setPending(false)
            if (result.success) {
                setNotes((prev) => prev.filter((n) => n.id !== id))
                resetForm()
            } else {
                showToast.error(t('errorDelete'), result.error ?? t('errorRetry'))
            }
        })
    }

    const selectNote = (note: NoteRow) => {
        setSelectedNoteId(note.id)
        setTitle(note.title)
        setContent(note.content)
        setIsCreating(false)
    }

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-[480px] overflow-hidden">
            <header className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                    {t('title')}
                </h3>
                {!isCreating && !selectedNoteId ? (
                    <Button
                        size="sm"
                        onClick={() => {
                            setIsCreating(true)
                            setTitle('')
                            setContent('')
                        }}
                        className="h-8 gap-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        {t('new')}
                    </Button>
                ) : null}
            </header>

            {isCreating || selectedNoteId ? (
                <div className="flex-1 flex flex-col p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <Input
                            placeholder={t('placeholderTitle')}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-0 px-0 text-base font-semibold focus-visible:ring-0 bg-transparent text-slate-900 dark:text-white"
                            disabled={pending}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={resetForm}
                            disabled={pending}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            aria-label={t('close')}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <Textarea
                        placeholder={t('placeholderBody')}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={pending}
                        className="flex-1 resize-none border-0 focus-visible:ring-0 p-0 text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-transparent"
                    />
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200 dark:border-slate-800">
                        {selectedNoteId ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={pending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" /> {t('delete')}
                            </Button>
                        ) : <div />}
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={resetForm} disabled={pending}>
                                {t('cancel')}
                            </Button>
                            <Button
                                size="sm"
                                onClick={isCreating ? handleCreate : handleSave}
                                disabled={pending || !title.trim()}
                                className="rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-semibold gap-1.5"
                            >
                                {pending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                {isCreating ? t('create') : t('save')}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-3">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
                                {t('emptyTitle')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {t('emptyBody')}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-1.5">
                            {notes.map((note) => (
                                <li
                                    key={note.id}
                                    onClick={() => selectNote(note)}
                                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 cursor-pointer transition-colors"
                                >
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 mb-1">
                                        {note.title}
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                                        {note.content || t('noContent')}
                                    </p>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}
