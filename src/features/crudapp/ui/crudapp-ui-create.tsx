'use client'

import { useState } from 'react'
import { useCreateJournalEntry } from '../data-access/use-create-journal-entry'
import { useUpdateJournalEntry } from '../data-access/use-update-journal-entry'
import { useDeleteJournalEntry } from '../data-access/use-delete-journal-entry'

export function CrudappUiCreate() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const createMut = useCreateJournalEntry()
  const updateMut = useUpdateJournalEntry()
  const deleteMut = useDeleteJournalEntry()

  const busy = createMut.isPending || updateMut.isPending || deleteMut.isPending

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <div className="space-y-2">
        <div className="text-lg font-semibold">Journal Entry</div>
        <input
          className="w-full rounded-md border px-3 py-2"
          placeholder="Title (seed)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full rounded-md border px-3 py-2 min-h-[120px]"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={busy || !title || !message}
          onClick={() => createMut.mutate({ title, message })}
        >
          Create
        </button>

        <button
          className="rounded-md border px-4 py-2 disabled:opacity-50"
          disabled={busy || !title || !message}
          onClick={() => updateMut.mutate({ title, message })}
        >
          Update
        </button>

        <button
          className="rounded-md border px-4 py-2 disabled:opacity-50"
          disabled={busy || !title}
          onClick={() => deleteMut.mutate({ title })}
        >
          Delete
        </button>
      </div>

      {(createMut.error || updateMut.error || deleteMut.error) && (
        <div className="text-sm text-red-600">
          {String((createMut.error || updateMut.error || deleteMut.error) as any)}
        </div>
      )}

      {(createMut.data || updateMut.data || deleteMut.data) && (
        <div className="text-sm">
          <div className="font-medium">Last signature:</div>
          <div className="break-all">
            {String((createMut.data || updateMut.data || deleteMut.data) as any)}
          </div>
        </div>
      )}
    </div>
  )
}
