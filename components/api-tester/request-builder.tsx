"use client";

import type { RequestConfig, KeyValuePair, HTTPMethod } from "@/lib/api-types";
import { Plus, Trash2, Send } from "lucide-react";
import { AuthSection } from "./auth-section";
import { generateKeyId } from "@/lib/api-utils";

interface RequestBuilderProps {
  config: RequestConfig;
  onConfigChange: (config: RequestConfig) => void;
  onSendRequest: () => void;
  loading: boolean;
  darkMode: boolean;
}

export function RequestBuilder({
  config,
  onConfigChange,
  onSendRequest,
  loading,
  darkMode,
}: RequestBuilderProps) {
  const methods: HTTPMethod[] = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "HEAD",
    "OPTIONS",
  ];

  const updateHeader = (
    index: number,
    field: keyof KeyValuePair,
    value: string | boolean,
  ) => {
    const newHeaders = [...config.headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onConfigChange({ ...config, headers: newHeaders });
  };

  const updateParam = (
    index: number,
    field: keyof KeyValuePair,
    value: string | boolean,
  ) => {
    const newParams = [...config.params];
    newParams[index] = { ...newParams[index], [field]: value };
    onConfigChange({ ...config, params: newParams });
  };

  const addHeader = () => {
    onConfigChange({
      ...config,
      headers: [
        ...config.headers,
        { id: generateKeyId(), key: "", value: "", enabled: true },
      ],
    });
  };

  const removeHeader = (index: number) => {
    onConfigChange({
      ...config,
      headers: config.headers.filter((_, i) => i !== index),
    });
  };

  const addParam = () => {
    onConfigChange({
      ...config,
      params: [
        ...config.params,
        { id: generateKeyId(), key: "", value: "", enabled: true },
      ],
    });
  };

  const removeParam = (index: number) => {
    onConfigChange({
      ...config,
      params: config.params.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* URL & Method */}
      <div
        className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="flex gap-2 mb-4">
          <select
            value={config.method}
            onChange={(e) =>
              onConfigChange({
                ...config,
                method: e.target.value as HTTPMethod,
              })
            }
            className={`px-4 py-2 rounded-lg font-semibold border ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-slate-50 border-slate-200 text-slate-900"
            }`}
          >
            {methods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter URL (e.g., https://api.example.com/users)"
            value={config.url}
            onChange={(e) => onConfigChange({ ...config, url: e.target.value })}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
            }`}
          />
          <button
            onClick={onSendRequest}
            disabled={loading || !config.url}
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              loading
                ? "opacity-50 cursor-not-allowed bg-purple-600 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105"
            }`}
          >
            <Send size={18} />
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Timeout */}
      <div
        className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <label
          className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
        >
          Request Timeout (ms)
        </label>
        <input
          type="number"
          min="1000"
          max="300000"
          step="1000"
          value={config.timeout}
          onChange={(e) =>
            onConfigChange({
              ...config,
              timeout: Number.parseInt(e.target.value),
            })
          }
          className={`w-full mt-2 px-3 py-2 rounded-lg border ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        />
      </div>

      {/* Authentication */}
      <AuthSection
        auth={config.auth}
        onAuthChange={(auth) => onConfigChange({ ...config, auth })}
        darkMode={darkMode}
      />

      {/* Headers */}
      <div
        className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Headers
          </h3>
          <button
            onClick={addHeader}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center gap-1 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {config.headers.map((header, i) => (
            <div key={header.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={(e) => updateHeader(i, "enabled", e.target.checked)}
                className="mt-2"
              />
              <input
                type="text"
                placeholder="Key"
                value={header.key}
                onChange={(e) => updateHeader(i, "key", e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
                }`}
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) => updateHeader(i, "value", e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
                }`}
              />
              <button
                onClick={() => removeHeader(i)}
                className={`p-2 rounded transition-colors ${
                  darkMode
                    ? "text-red-400 hover:bg-red-900/20"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Query Parameters */}
      <div
        className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Query Parameters
          </h3>
          <button
            onClick={addParam}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded flex items-center gap-1 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {config.params.map((param, i) => (
            <div key={param.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={param.enabled}
                onChange={(e) => updateParam(i, "enabled", e.target.checked)}
                className="mt-2"
              />
              <input
                type="text"
                placeholder="Key"
                value={param.key}
                onChange={(e) => updateParam(i, "key", e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
                }`}
              />
              <input
                type="text"
                placeholder="Value"
                value={param.value}
                onChange={(e) => updateParam(i, "value", e.target.value)}
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
                }`}
              />
              <button
                onClick={() => removeParam(i)}
                className={`p-2 rounded transition-colors ${
                  darkMode
                    ? "text-red-400 hover:bg-red-900/20"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Request Body */}
      <div
        className={`p-4 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
      >
        <div className="mb-4">
          <label
            className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}
          >
            Body Type
          </label>
          <select
            value={config.bodyType}
            onChange={(e) =>
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              onConfigChange({ ...config, bodyType: e.target.value as any })
            }
            className={`w-full mt-2 px-3 py-2 rounded-lg border ${
              darkMode
                ? "bg-slate-700 border-slate-600 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <option value="json">JSON</option>
            <option value="form">Form Data</option>
            <option value="text">Text</option>
            <option value="xml">XML</option>
          </select>
        </div>
        <textarea
          placeholder="Request body (for POST, PUT, PATCH)"
          value={config.body}
          onChange={(e) => onConfigChange({ ...config, body: e.target.value })}
          className={`w-full h-32 px-4 py-2 rounded-lg border font-mono text-sm resize-none ${
            darkMode
              ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              : "bg-white border-slate-200 text-slate-900 placeholder-slate-500"
          }`}
        />
      </div>
    </div>
  );
}
