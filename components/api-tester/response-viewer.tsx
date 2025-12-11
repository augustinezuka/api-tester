"use client";

import type { Response } from "@/lib/api-types";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface ResponseViewerProps {
  response: Response | null;
  darkMode: boolean;
}

export function ResponseViewer({ response, darkMode }: ResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const isErrorResponse =
    response !== null && "error" in response && response.error === true;

  const handleCopy = () => {
    if (!response) return;

    const content = isErrorResponse
      ? response.message
      : JSON.stringify(response.data, null, 2);

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "text-green-600 dark:text-green-400";
    if (status >= 300 && status < 400)
      return "text-blue-600 dark:text-blue-400";
    if (status >= 400 && status < 500)
      return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  // No response yet
  if (!response) {
    return (
      <div
        className={`p-12 min-w-[350px] min-h-[300px] text-center rounded-xl ${
          darkMode ? "bg-slate-800" : "bg-slate-100"
        }`}
      >
        <p className={darkMode ? "text-slate-400" : "text-slate-600"}>
          No response yet. Send a request to see the response here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl min-w-[350px] min-h-[350px] border ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex justify-between items-center ${
          darkMode ? "border-slate-700" : "border-slate-200"
        }`}
      >
        <div className="space-y-1">
          {isErrorResponse ? (
            <p className="text-red-600 dark:text-red-400 font-bold text-lg">
              Error
            </p>
          ) : (
            <>
              <p
                className={`font-semibold text-lg ${getStatusColor(
                  response.status,
                )}`}
              >
                {response.status} {response.statusText}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Time: {response.time}ms • Size: {response.size} bytes
              </p>
            </>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition ${
            darkMode
              ? "hover:bg-slate-700 text-slate-300"
              : "hover:bg-slate-100 text-slate-600"
          }`}
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>

      {/* Content */}
      <pre
        className={`p-4 overflow-auto max-h-[600px] min-h-[280px] font-mono text-sm rounded-b-xl ${
          darkMode
            ? "bg-slate-900 text-slate-100"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        {isErrorResponse
          ? response.message
          : JSON.stringify(response.data, null, 2)}
      </pre>
    </div>
  );
}
