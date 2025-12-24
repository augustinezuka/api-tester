/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Plus, X, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeGenerator } from "@/components/code-generator";
import { useEnvironmentVars } from "@/hooks/use-environment-vars";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
];

interface RequestPanelProps {
  onSubmit: (config: any) => void;
  isLoading: boolean;
  loadedRequest?: any;
}

export function RequestPanel({
  onSubmit,
  isLoading,
  loadedRequest,
}: RequestPanelProps) {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>(
    [{ key: "Content-Type", value: "application/json" }],
  );
  const [body, setBody] = useState("");
  const [queryParams, setQueryParams] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collections, setCollections] = useState<any[]>([]);

  const { replaceVars } = useEnvironmentVars();

  useEffect(() => {
    const saved = localStorage.getItem("apicraft_collections");
    if (saved) {
      setCollections(JSON.parse(saved));
    }
  }, [saveDialogOpen]);

  useEffect(() => {
    if (loadedRequest) {
      setMethod(loadedRequest.method || "GET");
      setUrl(loadedRequest.url || "");

      if (loadedRequest.headers) {
        const headerArray = Object.entries(loadedRequest.headers).map(
          ([key, value]) => ({
            key,
            value: value as string,
          }),
        );
        setHeaders(
          headerArray.length > 0
            ? headerArray
            : [{ key: "Content-Type", value: "application/json" }],
        );
      }

      setBody(loadedRequest.body || "");

      if (loadedRequest.queryParams) {
        const paramsArray = Object.entries(loadedRequest.queryParams).map(
          ([key, value]) => ({
            key,
            value: value as string,
          }),
        );
        setQueryParams(paramsArray);
      }
    }
  }, [loadedRequest]);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const updateQueryParam = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newParams = [...queryParams];
    newParams[index][field] = value;
    setQueryParams(newParams);
  };

  const handleSubmit = () => {
    const config = {
      method,
      url: replaceVars(url),
      headers: headers.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = replaceVars(value);
          return acc;
        },
        {} as Record<string, string>,
      ),
      body: body ? replaceVars(body) : undefined,
      queryParams: queryParams.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = replaceVars(value);
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
    onSubmit(config);
  };

  const saveToCollection = () => {
    if (!selectedCollection) return;

    const config = {
      method,
      url,
      headers: headers.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      body: body || undefined,
      queryParams: queryParams.reduce(
        (acc, { key, value }) => {
          if (key) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };

    const updatedCollections = collections.map((col) => {
      if (col.id === selectedCollection) {
        return { ...col, requests: [...col.requests, config] };
      }
      return col;
    });

    localStorage.setItem(
      "apicraft_collections",
      JSON.stringify(updatedCollections),
    );
    setSaveDialogOpen(false);
    setSelectedCollection("");
  };

  const getCurrentConfig = () => ({
    method,
    url,
    headers: headers.reduce(
      (acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    ),
    body: body ? JSON.parse(body) : undefined,
  });

  const methodColor = (m: string) =>
    cn(
      "font-mono font-extrabold",
      m === "GET" && "text-emerald-500",
      m === "POST" && "text-blue-500",
      m === "PUT" && "text-amber-500",
      m === "PATCH" && "text-purple-500",
      m === "DELETE" && "text-red-500",
      (m === "HEAD" || m === "OPTIONS") && "text-slate-400",
    );

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
                <span className={methodColor(m)}>{m}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="https://api.example.com/endpoint or {{baseUrl}}/endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 font-mono"
        />

        <Button onClick={handleSubmit} disabled={isLoading || !url} size="lg">
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <CodeGenerator config={getCurrentConfig()} />

        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Save className="h-4 w-4" />
              Save to Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save to Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Collection</Label>
                <Select
                  value={selectedCollection}
                  onValueChange={setSelectedCollection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {collections.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No collections available. Create one first.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={saveToCollection} disabled={!selectedCollection}>
                Save Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <Label className="text-sm text-muted-foreground">
              Query Parameters
            </Label>
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
                  onChange={(e) =>
                    updateQueryParam(index, "key", e.target.value)
                  }
                  className="font-mono"
                />
                <Input
                  placeholder="Value (use {{varName}} for env vars)"
                  value={param.value}
                  onChange={(e) =>
                    updateQueryParam(index, "value", e.target.value)
                  }
                  className="font-mono"
                />
                <Button
                  onClick={() => removeQueryParam(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="headers" className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">
              Request Headers
            </Label>
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
                  placeholder="Header value (use {{varName}} for env vars)"
                  value={header.value}
                  onChange={(e) => updateHeader(index, "value", e.target.value)}
                  className="font-mono"
                />
                <Button
                  onClick={() => removeHeader(index)}
                  size="icon"
                  variant="ghost"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="body" className="space-y-3 pt-4">
          <Label className="text-sm text-muted-foreground">
            Request Body (use {`{{varName}}`} for environment variables)
          </Label>
          <Textarea
            placeholder='{"key": "value"} or {"apiKey": "{{apiKey}}"}'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-64 font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
