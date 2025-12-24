"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, Plus, Trash2, ChevronRight, ChevronDown, File } from "lucide-react"
import { cn } from "@/lib/utils"

interface Collection {
  id: string
  name: string
  requests: any[]
  expanded?: boolean
}

interface CollectionsPanelProps {
  onLoadRequest: (request: any) => void
}

export function CollectionsPanel({ onLoadRequest }: CollectionsPanelProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isAddingCollection, setIsAddingCollection] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("apicraft_collections")
    if (saved) {
      setCollections(JSON.parse(saved))
    }
  }, [])

  const saveCollections = (cols: Collection[]) => {
    localStorage.setItem("apicraft_collections", JSON.stringify(cols))
    setCollections(cols)
  }

  const addCollection = () => {
    if (!newCollectionName.trim()) return

    const newCollection: Collection = {
      id: Date.now().toString(),
      name: newCollectionName,
      requests: [],
      expanded: true,
    }

    saveCollections([...collections, newCollection])
    setNewCollectionName("")
    setIsAddingCollection(false)
  }

  const deleteCollection = (id: string) => {
    saveCollections(collections.filter((c) => c.id !== id))
  }

  const toggleCollection = (id: string) => {
    saveCollections(collections.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c)))
  }

  const deleteRequest = (collectionId: string, requestIndex: number) => {
    saveCollections(
      collections.map((c) =>
        c.id === collectionId ? { ...c, requests: c.requests.filter((_, i) => i !== requestIndex) } : c,
      ),
    )
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-card-foreground">Collections</h2>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsAddingCollection(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {isAddingCollection && (
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCollection()}
              className="h-8"
            />
            <Button size="sm" onClick={addCollection}>
              Add
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {collections.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No collections yet. Create one to organize your requests.
            </div>
          ) : (
            collections.map((collection) => (
              <div key={collection.id}>
                <div className="flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-accent">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => toggleCollection(collection.id)}
                  >
                    {collection.expanded ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm text-card-foreground">{collection.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => deleteCollection(collection.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {collection.expanded && (
                  <div className="ml-6 space-y-0.5">
                    {collection.requests.map((request, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer group"
                        onClick={() => onLoadRequest(request)}
                      >
                        <File className="h-3.5 w-3.5 text-muted-foreground" />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            `text-[color:var(--method-${request.method?.toLowerCase() || "get"})]`,
                          )}
                        >
                          {request.method || "GET"}
                        </span>
                        <span className="flex-1 truncate text-xs text-card-foreground">{request.url || "Unnamed"}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteRequest(collection.id, index)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {collection.requests.length === 0 && (
                      <div className="px-2 py-2 text-xs text-muted-foreground">No requests</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
