"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"

interface ResponsePanelProps {
  response: any
  isLoading: boolean
}

export function ResponsePanel({ response, isLoading }: ResponsePanelProps) {
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
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
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
            <TabsList>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>

            <TabsContent value="body" className="mt-4">
              <Card className="bg-muted/30 p-4">
                <pre className="overflow-auto text-xs text-foreground">
                  {typeof response.data === "string" ? response.data : JSON.stringify(response.data, null, 2)}
                </pre>
              </Card>
            </TabsContent>

            <TabsContent value="headers" className="mt-4">
              <Card className="bg-muted/30 p-4">
                <pre className="overflow-auto text-xs text-foreground">{JSON.stringify(response.headers, null, 2)}</pre>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
