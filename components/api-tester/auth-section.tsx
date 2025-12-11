"use client"

import type { AuthConfig, AuthType } from "@/lib/api-types"
import { Lock } from "lucide-react"

interface AuthSectionProps {
  auth: AuthConfig
  onAuthChange: (auth: AuthConfig) => void
  darkMode: boolean
}

export function AuthSection({ auth, onAuthChange, darkMode }: AuthSectionProps) {
  const authTypes: AuthType[] = ["none", "basic", "bearer", "api-key"]

  return (
    <div className={`p-4 rounded-lg ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
      <div className="flex items-center gap-2 mb-4">
        <Lock size={18} className="text-purple-600" />
        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Authentication</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Auth Type</label>
          <select
            value={auth.type}
            onChange={(e) => onAuthChange({ ...auth, type: e.target.value as AuthType })}
            className={`w-full mt-2 px-3 py-2 rounded-lg border ${
              darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <option value="none">None</option>
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
            <option value="api-key">API Key</option>
          </select>
        </div>

        {auth.type === "basic" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              value={auth.username || ""}
              onChange={(e) => onAuthChange({ ...auth, username: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
              }`}
            />
            <input
              type="password"
              placeholder="Password"
              value={auth.password || ""}
              onChange={(e) => onAuthChange({ ...auth, password: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
              }`}
            />
          </div>
        )}

        {auth.type === "bearer" && (
          <input
            type="password"
            placeholder="Bearer Token"
            value={auth.token || ""}
            onChange={(e) => onAuthChange({ ...auth, token: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg border ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
            }`}
          />
        )}

        {auth.type === "api-key" && (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Header Name (e.g., X-API-Key)"
              value={auth.apiKeyHeader || ""}
              onChange={(e) => onAuthChange({ ...auth, apiKeyHeader: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
              }`}
            />
            <input
              type="password"
              placeholder="API Key Value"
              value={auth.apiKey || ""}
              onChange={(e) => onAuthChange({ ...auth, apiKey: e.target.value })}
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
              }`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
