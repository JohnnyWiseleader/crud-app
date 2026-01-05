import { useState } from "react";
import { useCreateJournalEntry } from "../data-access/use-create-journal-entry";

export function CreateJournalEntryForm() {
  const createMutation = useCreateJournalEntry();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createMutation.mutate({
      title,
      message,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl space-y-4 rounded-xl border p-6"
    >
      <h2 className="text-lg font-semibold">Create Journal Entry</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My first entry"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Message</label>
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Today I learned..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={createMutation.isPending}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {createMutation.isPending ? "Submitting..." : "Create"}
      </button>

      {createMutation.isSuccess && (
        <p className="text-sm text-green-600">
          Transaction sent: {createMutation.data}
        </p>
      )}

      {createMutation.isError && (
        <p className="text-sm text-red-600">
          {(createMutation.error as Error).message}
        </p>
      )}
    </form>
  );
}
