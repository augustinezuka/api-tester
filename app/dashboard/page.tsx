"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RequestPanel } from "@/components/request-panel"
import { ResponsePanel } from "@/components/response-panel"
import { HistoryPanel } from "@/components/history-panel"
import { useRequestHistory } from "@/hooks/use-request-history"
import { Button } from "@/components/ui/button"
import { Zap, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
  const router = useRouter()
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { addToHistory } = useRequestHistory()

  useEffect(() => {
    const userData = localStorage.getItem("apicraft_user")
    if (!userData) {
      router.push("/login")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("apicraft_user")
    router.push("/login")
  }

  const handleRequest = async (config: any) => {
    setIsLoading(true)
    setResponse(null)

    const startTime = Date.now()

    try {
      const result = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const data = await result.json()
      const endTime = Date.now()

      const responseData = {
        ...data,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      }

      setResponse(responseData)

      // Add to history
      addToHistory({
        ...config,
        response: responseData,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      const endTime = Date.now()
      setResponse({
        error: error.message,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadFromHistory = (item: any) => {
    // This will be handled by the RequestPanel component
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">API Craft</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - History */}
        <aside className="w-64 border-r border-border bg-card">
          <HistoryPanel onLoadRequest={handleLoadFromHistory} />
        </aside>

        {/* Center - Request */}
        <main className="flex flex-1 flex-col">
          <div className="flex-1 overflow-auto">
            <RequestPanel onSubmit={handleRequest} isLoading={isLoading} />
          </div>
        </main>

        {/* Right - Response */}
        <aside className="w-1/2 border-l border-border bg-card">
          <ResponsePanel response={response} isLoading={isLoading} />
        </aside>
      </div>
    </div>
  )
}
