import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

type MemoryItem = { text: string; type: string };

export function MemoryPanel() {
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState<"retain" | "recall" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRetain() {
    const text = content.trim();
    if (!text) return;
    setError(null);
    setMessage(null);
    setLoading("retain");
    try {
      await api<{ ok: boolean }>("/memory/retain", {
        method: "POST",
        body: JSON.stringify({ content: text }),
      });
      setMessage("Saved — you can search for it on the right.");
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save memory");
    } finally {
      setLoading(null);
    }
  }

  async function handleRecall() {
    const q = query.trim();
    if (!q) return;
    setError(null);
    setMessage(null);
    setLoading("recall");
    try {
      const res = await api<{ memories: MemoryItem[] }>("/memory/recall", {
        method: "POST",
        body: JSON.stringify({ query: q }),
      });
      setMemories(res.memories ?? []);
      if (!res.memories?.length) {
        setMessage("No matches yet — add a note on the left first.");
      } else {
        setMessage(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not search memories");
      setMemories([]);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="mt-14">
      <div className="mb-6">
        <p className="text-sm font-medium text-accent-muted">Hindsight</p>
        <h2 className="mt-1 font-display text-xl text-white">Personal shopping memory</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Save preferences on the left; search what the model knows about you on the right. Your API key never leaves the
          server.
        </p>
      </div>

      <Card className="overflow-hidden !p-0" hover={false}>
        {error && (
          <div className="border-b border-red-500/20 bg-red-500/10 px-6 py-3 text-sm text-red-200">{error}</div>
        )}
        {message && !error && (
          <div className="border-b border-accent/20 bg-accent/10 px-6 py-3 text-sm text-ink">{message}</div>
        )}

        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-white/10">
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <div>
              <label htmlFor="dash-mem-save" className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Remember
              </label>
              <textarea
                id="dash-mem-save"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="e.g. I want free returns and usually shop under $150."
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
              />
            </div>
            <Button
              type="button"
              className="self-start"
              disabled={loading !== null || !content.trim()}
              onClick={() => void handleRetain()}
            >
              {loading === "retain" ? "Saving…" : "Save to memory"}
            </Button>
          </div>

          <div className="flex flex-col border-t border-white/10 p-6 sm:p-8 lg:border-t-0">
            <label htmlFor="dash-mem-search" className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Search & results
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
              <input
                id="dash-mem-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleRecall();
                }}
                placeholder="What do you know about my budget?"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
              />
              <Button
                type="button"
                variant="secondary"
                className="shrink-0 sm:min-w-[7rem]"
                disabled={loading !== null || !query.trim()}
                onClick={() => void handleRecall()}
              >
                {loading === "recall" ? "…" : "Search"}
              </Button>
            </div>

            <div className="mt-6 min-h-[8rem] flex-1 rounded-xl border border-white/5 bg-black/20 p-4">
              {memories.length === 0 ? (
                <p className="text-sm text-ink-faint">Results appear here after you search.</p>
              ) : (
                <ul className="space-y-3">
                  {memories.map((m, i) => (
                    <li
                      key={`${m.text}-${i}`}
                      className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-ink"
                    >
                      <span className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">{m.type}</span>
                      <p className="mt-1 leading-relaxed">{m.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
