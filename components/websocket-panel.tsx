"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Radio, Send, X, Circle } from "lucide-react"

interface Message {
  type: "sent" | "received" | "error" | "info"
  content: string
  timestamp: string
}

export function WebSocketPanel() {
  const [url, setUrl] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const addMessage = (type: Message["type"], content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type,
        content,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  const handleConnect = () => {
    try {
      const ws = new WebSocket(url)

      ws.onopen = () => {
        setIsConnected(true)
        addMessage("info", "Connected to WebSocket server")
      }

      ws.onmessage = (event) => {
        addMessage("received", event.data)
      }

      ws.onerror = (error) => {
        addMessage("error", "WebSocket error occurred")
      }

      ws.onclose = () => {
        setIsConnected(false)
        addMessage("info", "Disconnected from WebSocket server")
      }

      wsRef.current = ws
    } catch (error: any) {
      addMessage("error", `Failed to connect: ${error.message}`)
    }
  }

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const handleSend = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && message) {
      wsRef.current.send(message)
      addMessage("sent", message)
      setMessage("")
    }
  }

  const handleClearMessages = () => {
    setMessages([])
  }

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Connection Section */}
      <div className="flex gap-2">
        <Input
          placeholder="wss://echo.websocket.org"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isConnected}
          className="flex-1 font-mono"
        />
        {isConnected ? (
          <Button onClick={handleDisconnect} variant="destructive">
            <X className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={!url}>
            <Radio className="mr-2 h-4 w-4" />
            Connect
          </Button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <Circle
          className={`h-3 w-3 ${isConnected ? "fill-[var(--color-success)] text-[var(--color-success)]" : "fill-muted-foreground text-muted-foreground"}`}
        />
        <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
      </div>

      {/* Messages Area */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">Messages</Label>
          {messages.length > 0 && (
            <Button onClick={handleClearMessages} size="sm" variant="ghost">
              Clear
            </Button>
          )}
        </div>

        <Card className="flex-1 bg-muted/30 p-4">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-2">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No messages yet</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 ${
                      msg.type === "sent"
                        ? "bg-primary/10 border border-primary/20"
                        : msg.type === "received"
                          ? "bg-card border border-border"
                          : msg.type === "error"
                            ? "bg-destructive/10 border border-destructive/20"
                            : "bg-accent/50 border border-accent"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          msg.type === "sent"
                            ? "border-primary/50 text-primary"
                            : msg.type === "received"
                              ? "border-[var(--color-success)]/50 text-[var(--color-success)]"
                              : msg.type === "error"
                                ? "border-destructive/50 text-destructive"
                                : "border-accent-foreground/50 text-accent-foreground"
                        }`}
                      >
                        {msg.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                    <pre className="overflow-auto text-sm text-foreground whitespace-pre-wrap break-words">
                      {msg.content}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Send Message Section */}
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Send Message</Label>
        <div className="flex gap-2">
          <Textarea
            placeholder='{"message": "Hello WebSocket!"}'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isConnected}
            className="font-mono text-sm"
            rows={3}
          />
          <Button onClick={handleSend} disabled={!isConnected || !message} size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
