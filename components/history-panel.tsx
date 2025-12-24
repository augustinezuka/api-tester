"use client"

import { useState } from "react"
import { useRequestHistory } from "@/hooks/use-request-history"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { History, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryPanelProps {
  onLoadRequest: (item: any) => void
}

export function HistoryPanel({ onLoadRequest }: HistoryPanelProps) {
  const { history, clearHistory, removeFromHistory } = useRequestHistory()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleLoadRequest = (item: any) => {
    setSelectedId(item.id)
    onLoadRequest(item)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold">History</h2>
        </div>
        {history.length > 0 && (
          <Button onClick={clearHistory} size="sm" variant="ghost" className="h-7 text-xs">
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {history.length === 0 ? (
            <div className="px-2 py-8 text-center">
              <p className="text-xs text-muted-foreground">No history yet</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative cursor-pointer rounded-lg border border-transparent p-3 hover:border-border hover:bg-muted/50",
                  selectedId === item.id && "border-primary bg-primary/5",
                )}
                onClick={() => handleLoadRequest(item)}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono text-xs",
                      item.method === "GET" && "border-[var(--color-method-get)]/50 text-[var(--color-method-get)]",
                      item.method === "POST" && "border-[var(--color-method-post)]/50 text-[var(--color-method-post)]",
                      item.method === "PUT" && "border-[var(--color-method-put)]/50 text-[var(--color-method-put)]",
                      item.method === "PATCH" &&
                        "border-[var(--color-method-patch)]/50 text-[var(--color-method-patch)]",
                      item.method === "DELETE" &&
                        "border-[var(--color-method-delete)]/50 text-[var(--color-method-delete)]",
                    )}
                  >
                    {item.method}
                  </Badge>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFromHistory(item.id)
                    }}
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="truncate text-xs font-mono text-foreground">{new URL(item.url).pathname}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
