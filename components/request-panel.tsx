"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]

const CONTENT_TYPES = [
  "application/json",
  "application/xml",
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
  "text/html",
]

interface RequestPanelProps {
  onSubmit: (config: any) => void
  isLoading: boolean
}

export function RequestPanel({ onSubmit, isLoading }: RequestPanelProps) {
  const [method, setMethod] = useState("GET")
  const [url, setUrl] = useState("")
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([
    { key: "Content-Type", value: "application/json" },
  ])
  const [body, setBody] = useState("")
  const [queryParams, setQueryParams] = useState<Array<{ key: string; value: string }>>([])

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

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }])
  }

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index))
  }

  const updateQueryParam = (index: number, field: "key" | "value", value: string) => {
    const newParams = [...queryParams]
    newParams[index][field] = value
    setQueryParams(newParams)
  }

  const handleSubmit = () => {
    const config = {
      method,
      url,
      headers: headers.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      ),
      body: body || undefined,
      queryParams: queryParams.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value
          return acc
        },
        {} as Record<string, string>,
      ),
    }
    onSubmit(config)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Request Line */}
      <div className="flex gap-2">
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {HTTP_METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    m === "GET" && "text-green-600 dark:text-green-400",
                    m === "POST" && "text-blue-600 dark:text-blue-400",
                    m === "PUT" && "text-orange-600 dark:text-orange-400",
                    m === "PATCH" && "text-yellow-600 dark:text-yellow-400",
                    m === "DELETE" && "text-red-600 dark:text-red-400",
                    (m === "HEAD" || m === "OPTIONS") && "text-purple-600 dark:text-purple-400",
                  )}
                >
                  {m}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="https://api.example.com/endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 font-mono"
        />

        <Button onClick={handleSubmit} disabled={isLoading || !url} size="lg">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>

      {/* Request Details */}
      <Tabs defaultValue="params" className="flex-1">
        <TabsList>
          <TabsTrigger value="params">Query Params</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">Query Parameters</Label>
            <Button onClick={addQueryParam} size="sm" variant="outline">
              <Plus className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {queryParams.map((param, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Key"
                  value={param.key}
                  onChange={(e) => updateQueryParam(index, "key", e.target.value)}
                  className="font-mono"
                />
                <Input
                  placeholder="Value"
                  value={param.value}
                  onChange={(e) => updateQueryParam(index, "value", e.target.value)}
                  className="font-mono"
                />
                <Button onClick={() => removeQueryParam(index)} size="icon" variant="ghost">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="headers" className="space-y-3 pt-4">
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

        <TabsContent value="body" className="space-y-3 pt-4">
          <Label className="text-sm text-muted-foreground">Request Body</Label>
          <Textarea
            placeholder='{"key": "value"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-64 font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
