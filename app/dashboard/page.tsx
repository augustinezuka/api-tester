/* eslint-disable */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequestPanel } from "@/components/request-panel";
import { ResponsePanel } from "@/components/response-panel";
import { HistoryPanel } from "@/components/history-panel";
import { WebSocketPanel } from "@/components/websocket-panel";
import { GraphQLPanel } from "@/components/graphql-panel";
import { CollectionsPanel } from "@/components/collections-panel";
import { EnvironmentPanel } from "@/components/environment-panel";
import { useRequestHistory } from "@/hooks/use-request-history";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  LogOut,
  User,
  Send,
  Radio,
  Globe,
  FolderOpen,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const router = useRouter();
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("rest");
  const [loadedRequest, setLoadedRequest] = useState<any>(null);
  const [sidebarView, setSidebarView] = useState<"history" | "collections">(
    "history",
  );
  const { addToHistory } = useRequestHistory();

  useEffect(() => {
    const userData = localStorage.getItem("apicraft_user");
    if (!userData) {
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("apicraft_user");
    router.push("/login");
  };

  const handleRequest = async (config: any) => {
    setIsLoading(true);
    setResponse(null);

    const startTime = Date.now();

    try {
      const result = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await result.json();
      const endTime = Date.now();

      const responseData = {
        ...data,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      };

      setResponse(responseData);

      // Add to history
      addToHistory({
        ...config,
        response: responseData,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      const endTime = Date.now();
      setResponse({
        error: error.message,
        duration: endTime - startTime,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromHistory = (item: any) => {
    setLoadedRequest(item);
    setResponse(item.response);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
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

          <div className="flex items-center gap-2">
            <EnvironmentPanel />
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - History or Collections (only for REST) */}
        {activeTab === "rest" && (
          <aside className="w-64 flex flex-col border-r border-border bg-card">
            <div className="border-b border-border p-2">
              <div className="flex gap-1 bg-muted rounded-md p-1">
                <Button
                  variant={sidebarView === "history" ? "secondary" : "ghost"}
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setSidebarView("history")}
                >
                  <Clock className="h-4 w-4" />
                  History
                </Button>
                <Button
                  variant={
                    sidebarView === "collections" ? "secondary" : "ghost"
                  }
                  size="sm"
                  className="flex-1 gap-2"
                  onClick={() => setSidebarView("collections")}
                >
                  <FolderOpen className="h-4 w-4" />
                  Collections
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {sidebarView === "history" ? (
                <HistoryPanel onLoadRequest={handleLoadFromHistory} />
              ) : (
                <CollectionsPanel onLoadRequest={handleLoadFromHistory} />
              )}
            </div>
          </aside>
        )}

        {/* Center - Request Types */}
        <main className="flex flex-1 flex-col">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col"
          >
            <div className="border-b border-border bg-card px-6">
              <TabsList className="h-12">
                <TabsTrigger value="rest" className="gap-2">
                  <Send className="h-4 w-4" />
                  REST API
                </TabsTrigger>
                <TabsTrigger value="graphql" className="gap-2">
                  <Globe className="h-4 w-4" />
                  GraphQL
                </TabsTrigger>
                <TabsTrigger value="websocket" className="gap-2">
                  <Radio className="h-4 w-4" />
                  WebSocket
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="rest"
              className="flex flex-1 m-0 overflow-hidden"
            >
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <RequestPanel
                    onSubmit={handleRequest}
                    isLoading={isLoading}
                    loadedRequest={loadedRequest}
                  />
                </div>
                <aside className="w-1/2 border-l border-border bg-card">
                  <ResponsePanel response={response} isLoading={isLoading} />
                </aside>
              </div>
            </TabsContent>

            <TabsContent value="graphql" className="flex-1 overflow-auto m-0">
              <GraphQLPanel />
            </TabsContent>

            <TabsContent value="websocket" className="flex-1 overflow-auto m-0">
              <WebSocketPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
