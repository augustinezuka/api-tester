"use client";

import { useState, useEffect } from "react";
import type {
  RequestConfig,
  Response,
  SavedRequest,
  HistoryEntry,
  ViewType,
  Environment,
} from "@/lib/api-types";
import { RequestBuilder } from "@/components/api-tester/request-builder";
import { ResponseViewer } from "@/components/api-tester/response-viewer";
import { EnvironmentManager } from "@/components/api-tester/environment-manager";
import { makeRequest } from "@/lib/api-utils";
import {
  Zap,
  Moon,
  Sun,
  Save,
  Trash2,
  Clock,
  Sparkles,
  ChevronRight,
  Folder,
} from "lucide-react";
import { generateKeyId } from "@/lib/api-utils";

const defaultConfig: RequestConfig = {
  method: "GET",
  url: "",
  headers: [{ id: generateKeyId(), key: "", value: "", enabled: true }],
  params: [{ id: generateKeyId(), key: "", value: "", enabled: true }],
  body: "",
  bodyType: "json",
  auth: { type: "none" },
  timeout: 30000,
};

export default function APITester() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [config, setConfig] = useState<RequestConfig>(defaultConfig);
  const [response, setResponse] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [requestHistory, setRequestHistory] = useState<HistoryEntry[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [currentEnv, setCurrentEnv] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [requestName, setRequestName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("api_tester_saved");
    const hist = localStorage.getItem("api_tester_history");
    const envs = localStorage.getItem("api_tester_environments");
    const curr = localStorage.getItem("api_tester_current_env");
    const dark = localStorage.getItem("api_tester_darkmode");

    if (saved) setSavedRequests(JSON.parse(saved));
    if (hist) setRequestHistory(JSON.parse(hist));
    if (envs) setEnvironments(JSON.parse(envs));
    if (curr) setCurrentEnv(curr);
    if (dark) setDarkMode(JSON.parse(dark));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("api_tester_saved", JSON.stringify(savedRequests));
    }
  }, [savedRequests, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        "api_tester_history",
        JSON.stringify(requestHistory),
      );
    }
  }, [requestHistory, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        "api_tester_environments",
        JSON.stringify(environments),
      );
    }
  }, [environments, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      if (currentEnv) {
        localStorage.setItem("api_tester_current_env", currentEnv);
      } else {
        localStorage.removeItem("api_tester_current_env");
      }
    }
  }, [currentEnv, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("api_tester_darkmode", JSON.stringify(darkMode));
    }
  }, [darkMode, isHydrated]);

  const handleSendRequest = async () => {
    if (!config.url.trim()) return;

    setLoading(true);
    setResponse(null);
    const startTime = Date.now();

    try {
      const result = await makeRequest(config);
      const endTime = Date.now();

      setResponse({
        status: result.status,
        statusText: result.statusText,
        data: result.data,
        headers: result.headers,
        time: endTime - startTime,
        size: JSON.stringify(result.data).length,
        format: "json",
      });

      const historyEntry: HistoryEntry = {
        id: generateKeyId(),
        method: config.method,
        url: config.url,
        status: result.status,
        time: endTime - startTime,
        timestamp: new Date().toISOString(),
      };
      setRequestHistory((prev) => [historyEntry, ...prev].slice(0, 100));
    } catch (error) {
      setResponse({
        error: true,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        time: Date.now() - startTime,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = () => {
    if (!requestName.trim()) return;

    const saved: SavedRequest = {
      id: generateKeyId(),
      name: requestName,
      config,
      savedAt: new Date().toISOString(),
    };

    setSavedRequests((prev) => [saved, ...prev]);
    setShowSaveModal(false);
    setRequestName("");
  };

  const loadSavedRequest = (saved: SavedRequest) => {
    setConfig(saved.config);
    setCurrentView("tester");
  };

  const deleteSavedRequest = (id: string) => {
    setSavedRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const clearHistory = () => {
    if (confirm("Clear all request history?")) {
      setRequestHistory([]);
    }
  };

  if (!isHydrated) {
    return null;
  }

  if (currentView === "landing") {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"}`}
      >
        <nav
          className={`${darkMode ? "bg-slate-800/50" : "bg-white/80"} backdrop-blur-lg border-b ${darkMode ? "border-slate-700" : "border-purple-100"} sticky top-0 z-50`}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <span
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                API
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Craft
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? "bg-slate-700 text-yellow-400" : "bg-slate-100 text-slate-700"} hover:scale-110 transition-transform`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setCurrentView("tester")}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
              <Sparkles size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                Type-Safe API Testing Tool
              </span>
            </div>
            <h1
              className={`text-6xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Test APIs with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
                Lightning Speed
              </span>
            </h1>
            <p
              className={`text-xl ${darkMode ? "text-slate-300" : "text-slate-600"} mb-8 max-w-2xl mx-auto`}
            >
              A beautiful, type-safe API testing tool with authentication,
              environments, request templates, and persistent local storage.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentView("tester")}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Start Testing <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Type-Safe",
                desc: "Full TypeScript support with precise type definitions",
              },
              {
                icon: Save,
                title: "Save & Persist",
                desc: "All requests and history saved locally in your browser",
              },
              {
                icon: Clock,
                title: "History",
                desc: "Track up to 100 API calls automatically",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`${darkMode ? "bg-slate-800/50" : "bg-white"} p-8 rounded-2xl border ${darkMode ? "border-slate-700" : "border-slate-200"} hover:shadow-2xl transition-all`}
              >
                <feature.icon className="text-purple-600 mb-4" size={32} />
                <h3
                  className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  {feature.title}
                </h3>
                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}
    >
      <nav
        className={`${darkMode ? "bg-slate-800" : "bg-white"} border-b ${darkMode ? "border-slate-700" : "border-slate-200"} sticky top-0 z-50 shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setCurrentView("landing")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <span
                className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                APICraft
              </span>
            </div>
            <div className="flex gap-2">
              {["tester", "saved", "history", "environments"].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view as ViewType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    currentView === view
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      : darkMode
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {view === "tester"
                    ? "Tester"
                    : view === "saved"
                      ? `Saved (${savedRequests.length})`
                      : view === "history"
                        ? `History (${requestHistory.length})`
                        : "Environments"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? "bg-slate-700 text-yellow-400" : "bg-slate-100 text-slate-700"} hover:scale-110 transition-transform`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {currentView === "tester" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h2
                  className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  Request Builder
                </h2>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save
                </button>
              </div>
              <RequestBuilder
                config={config}
                onConfigChange={setConfig}
                onSendRequest={handleSendRequest}
                loading={loading}
                darkMode={darkMode}
              />
            </div>
            <div className="space-y-4">
              <h2
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Response
              </h2>
              <ResponseViewer response={response} darkMode={darkMode} />
            </div>
          </div>
        )}

        {currentView === "environments" && (
          <div className="max-w-2xl">
            <h2
              className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Environments
            </h2>
            <EnvironmentManager
              environments={environments}
              currentEnv={currentEnv}
              onEnvironmentsChange={setEnvironments}
              onCurrentEnvChange={setCurrentEnv}
              darkMode={darkMode}
            />
          </div>
        )}

        {currentView === "saved" && (
          <div>
            <h2
              className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Saved Requests
            </h2>
            {savedRequests.length === 0 ? (
              <div
                className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl p-12 text-center`}
              >
                <Folder
                  size={64}
                  className={`mx-auto mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
                />
                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  No saved requests yet. Save your first request!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`${darkMode ? "bg-slate-800" : "bg-white"} p-6 rounded-xl border ${darkMode ? "border-slate-700" : "border-slate-200"} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className={`font-semibold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}
                        >
                          {req.name}
                        </h3>
                        <p
                          className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                        >
                          {req.config.method} {req.config.url}
                        </p>
                        <p
                          className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-500"}`}
                        >
                          {new Date(req.savedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadSavedRequest(req)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteSavedRequest(req.id)}
                          className={`p-2 ${darkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"} rounded-lg transition-colors`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentView === "history" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Request History
              </h2>
              {requestHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-red-900/20 text-red-400 hover:bg-red-900/30"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  Clear History
                </button>
              )}
            </div>
            {requestHistory.length === 0 ? (
              <div
                className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl p-12 text-center`}
              >
                <Clock
                  size={64}
                  className={`mx-auto mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
                />
                <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
                  No request history yet. Send a request to see it here!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requestHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className={`${darkMode ? "bg-slate-800" : "bg-white"} p-4 rounded-lg border ${darkMode ? "border-slate-700" : "border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
                        >
                          {entry.method} {entry.url}
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                        >
                          {new Date(entry.timestamp).toLocaleString()} •{" "}
                          {entry.time}ms
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                          entry.status >= 200 && entry.status < 300
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : entry.status >= 400
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl p-6 max-w-sm w-full mx-4`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Save Request
            </h2>
            <input
              type="text"
              placeholder="Enter request name"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveRequest()}
              autoFocus
              className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
              }`}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveRequest}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? "bg-slate-700 hover:bg-slate-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
