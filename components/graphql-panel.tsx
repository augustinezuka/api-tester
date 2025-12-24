"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Send, Plus, X, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"

export function GraphQLPanel() {
  const [url, setUrl] = useState("")
  const [query, setQuery] = useState(`query {
  # Enter your GraphQL query here
}`)
  const [variables, setVariables] = useState("{}")
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: "Content-Type", value: "application/json" },
  ])
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }])
  }

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  const handleSend = async () => {
    setIsLoading(true)
    setResponse(null)
    const startTime = Date.now()

    try {
      let parsedVariables = {}
      try {
        parsedVariables = variables ? JSON.parse(variables) : {}
      } catch (e) {
        throw new Error("Invalid JSON in variables")
      }

      const headersObj = headers.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      )

      const res = await fetch(url, {
        method: "POST",
        headers: headersObj,
        body: JSON.stringify({
          query,
          variables: parsedVariables,
        }),
      })

      const data = await res.json()
      const endTime = Date.now()

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
        headers: Object.fromEntries(res.headers.entries()),
        duration: endTime - startTime,
        hasErrors: data.errors && data.errors.length > 0,
      })
    } catch (error: any) {
      const endTime = Date.now()
      setResponse({
        error: error.message,
        duration: endTime - startTime,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const hasError = response?.error || response?.hasErrors || (response?.status && response?.status >= 400)

  return (
    <div className="flex h-full">
      {/* Left Side - Request */}
      <div className="flex flex-1 flex-col gap-4 border-r border-border p-6">
        {/* URL Input */}
        <div className="flex gap-2">
          <Input
            placeholder="https://api.example.com/graphql"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 font-mono"
          />
          <Button onClick={handleSend} disabled={isLoading || !url || !query} size="lg">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>

        {/* Query and Variables */}
        <Tabs defaultValue="query" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="flex-1 space-y-2 mt-4">
            <Label className="text-sm text-muted-foreground">GraphQL Query</Label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 font-mono text-sm min-h-[400px]"
              placeholder="Enter your GraphQL query..."
            />
          </TabsContent>

          <TabsContent value="variables" className="flex-1 space-y-2 mt-4">
            <Label className="text-sm text-muted-foreground">Query Variables (JSON)</Label>
            <Textarea
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              className="flex-1 font-mono text-sm min-h-[400px]"
              placeholder='{"key": "value"}'
            />
          </TabsContent>

          <TabsContent value="headers" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">Request Headers</Label>
              <Button onClick={addHeader} size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Header name"
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                    className="font-mono"
                  />
                  <Input
                    placeholder="Header value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, "value", e.target.value)}
                    className="font-mono"
                  />
                  <Button onClick={() => removeHeader(index)} size="icon" variant="ghost">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Side - Response */}
      <div className="flex w-1/2 flex-col bg-card">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Sending query...</p>
            </div>
          </div>
        ) : !response ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No response yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Configure and send a GraphQL query to see the response
              </p>
            </div>
          </div>
        ) : (
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
                <Tabs defaultValue="data" className="h-full">
                  <TabsList>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    {response.hasErrors && <TabsTrigger value="errors">Errors</TabsTrigger>}
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>

                  <TabsContent value="data" className="mt-4">
                    <Card className="bg-muted/30 p-4">
                      <pre className="overflow-auto text-xs text-foreground">
                        {JSON.stringify(response.data.data, null, 2)}
                      </pre>
                    </Card>
                  </TabsContent>

                  {response.hasErrors && (
                    <TabsContent value="errors" className="mt-4">
                      <Card className="border-destructive/50 bg-destructive/5 p-4">
                        <pre className="overflow-auto text-xs text-destructive">
                          {JSON.stringify(response.data.errors, null, 2)}
                        </pre>
                      </Card>
                    </TabsContent>
                  )}

                  <TabsContent value="headers" className="mt-4">
                    <Card className="bg-muted/30 p-4">
                      <pre className="overflow-auto text-xs text-foreground">
                        {JSON.stringify(response.headers, null, 2)}
                      </pre>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
