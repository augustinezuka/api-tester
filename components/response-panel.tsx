"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, Clock, Copy, Check } from "lucide-react"
import { JsonTreeViewer } from "@/components/json-tree-viewer"
import { useState } from "react"

interface ResponsePanelProps {
  response: any
  isLoading: boolean
}

export function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<"tree" | "raw">("tree")

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Sending request...</p>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No response yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Configure and send a request to see the response</p>
        </div>
      </div>
    )
  }

  const hasError = response.error || response.status >= 400

  return (
    <div className="flex h-full flex-col">
      {/* Response Status */}
      <div className="border-b border-border bg-muted/30 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {hasError ? (
              <XCircle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
            )}
            <span className="text-sm font-medium">{response.error ? "Error" : "Success"}</span>
          </div>

          {response.status && (
            <Badge variant={hasError ? "destructive" : "default"}>
              {response.status} {response.statusText}
            </Badge>
          )}

          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {response.duration}ms
          </div>
        </div>
      </div>

      {/* Response Content */}
      <div className="flex-1 overflow-auto p-6">
        {response.error ? (
          <Card className="border-destructive/50 bg-destructive/5 p-4">
            <pre className="text-sm text-destructive">{response.error}</pre>
          </Card>
        ) : (
          <Tabs defaultValue="body" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                  <Button
                    variant={viewMode === "tree" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setViewMode("tree")}
                  >
                    Tree
                  </Button>
                  <Button
                    variant={viewMode === "raw" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setViewMode("raw")}
                  >
                    Raw
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2),
                    )
                  }
                >
                  {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  Copy
                </Button>
              </div>
            </div>

            <TabsContent value="body" className="mt-0">
              <Card className="bg-muted/30 p-4">
                {viewMode === "tree" && typeof response.data === "object" ? (
                  <JsonTreeViewer data={response.data} />
                ) : (
                  <pre className="overflow-auto text-xs text-foreground">
                    {typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2)}
                  </pre>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="headers" className="mt-0">
              <Card className="bg-muted/30 p-4">
                {viewMode === "tree" ? (
                  <JsonTreeViewer data={response.headers} />
                ) : (
                  <pre className="overflow-auto text-xs text-foreground">
                    {JSON.stringify(response.headers, null, 2)}
                  </pre>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
