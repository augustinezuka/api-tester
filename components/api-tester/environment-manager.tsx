"use client"

import type { Environment } from "@/lib/api-types"
import { Plus, Trash2, Check, X } from "lucide-react"
import { useState } from "react"

interface EnvironmentManagerProps {
  environments: Environment[]
  currentEnv: string | null
  onEnvironmentsChange: (envs: Environment[]) => void
  onCurrentEnvChange: (env: string | null) => void
  darkMode: boolean
}

export function EnvironmentManager({
  environments,
  currentEnv,
  onEnvironmentsChange,
  onCurrentEnvChange,
  darkMode,
}: EnvironmentManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [envName, setEnvName] = useState("")
  const [varKey, setVarKey] = useState("")
  const [varValue, setVarValue] = useState("")

  const handleAddEnv = () => {
    if (!envName.trim()) return
    const newEnv: Environment = {
      name: envName,
      variables: {},
    }
    onEnvironmentsChange([...environments, newEnv])
    setEnvName("")
  }

  const handleAddVariable = (envName: string) => {
    if (!varKey.trim()) return
    const updated = environments.map((env) =>
      env.name === envName ? { ...env, variables: { ...env.variables, [varKey]: varValue } } : env,
    )
    onEnvironmentsChange(updated)
    setVarKey("")
    setVarValue("")
  }

  const handleDeleteEnv = (name: string) => {
    onEnvironmentsChange(environments.filter((e) => e.name !== name))
    if (currentEnv === name) onCurrentEnvChange(null)
  }

  const handleDeleteVariable = (envName: string, varName: string) => {
    const updated = environments.map((env) => {
      if (env.name === envName) {
        const { [varName]: _, ...rest } = env.variables
        return { ...env, variables: rest }
      }
      return env
    })
    onEnvironmentsChange(updated)
  }

  return (
    <div className="space-y-4">
      {/* Current Environment Selector */}
      <div
        className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <label className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          Active Environment
        </label>
        <select
          value={currentEnv || ""}
          onChange={(e) => onCurrentEnvChange(e.target.value || null)}
          className={`w-full mt-2 px-3 py-2 rounded-lg border ${
            darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <option value="">None</option>
          {environments.map((env) => (
            <option key={env.name} value={env.name}>
              {env.name}
            </option>
          ))}
        </select>
      </div>

      {/* Environment List */}
      {environments.length > 0 && (
        <div className="space-y-3">
          {environments.map((env) => (
            <div
              key={env.name}
              className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>{env.name}</h4>
                <button
                  onClick={() => handleDeleteEnv(env.name)}
                  className={`p-1 rounded transition-colors ${
                    darkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Variables */}
              {Object.entries(env.variables).length > 0 ? (
                <div className="space-y-2 mb-3">
                  {Object.entries(env.variables).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <div className="font-mono">
                        <span className="text-purple-600">${key}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteVariable(env.name, key)}
                        className={`p-1 rounded transition-colors ${
                          darkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Add Variable */}
              {currentEnv === env.name && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Var name"
                    value={varKey}
                    onChange={(e) => setVarKey(e.target.value)}
                    className={`flex-1 px-2 py-1 rounded border text-sm ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={varValue}
                    onChange={(e) => setVarValue(e.target.value)}
                    className={`flex-1 px-2 py-1 rounded border text-sm ${
                      darkMode
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500"
                    }`}
                  />
                  <button
                    onClick={() => handleAddVariable(env.name)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Check size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add New Environment */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-2 justify-center"
        >
          <Plus size={18} />
          Add Environment
        </button>
      ) : (
        <div
          className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
        >
          <input
            type="text"
            placeholder="Environment name"
            value={envName}
            onChange={(e) => setEnvName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddEnv()}
            autoFocus
            className={`w-full px-3 py-2 rounded-lg border mb-3 ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
            }`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddEnv}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowForm(false)
                setEnvName("")
              }}
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
      )}
    </div>
  )
}
