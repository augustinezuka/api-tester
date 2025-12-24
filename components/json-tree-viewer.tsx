"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JSX } from "react/jsx-runtime"

interface JsonTreeViewerProps {
  data: any
  level?: number
}

export function JsonTreeViewer({ data, level = 0 }: JsonTreeViewerProps) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({})

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderValue = (value: any, key: string, depth: number): JSX.Element => {
    const isExpandable = typeof value === "object" && value !== null
    const isExpanded = expanded[`${depth}-${key}`]

    if (!isExpandable) {
      return (
        <div className="flex gap-2" style={{ paddingLeft: `${depth * 16}px` }}>
          <span className="text-primary font-medium">{key}:</span>
          <span
            className={cn(
              typeof value === "string" && "text-success",
              typeof value === "number" && "text-chart-2",
              typeof value === "boolean" && "text-chart-3",
              value === null && "text-muted-foreground",
            )}
          >
            {typeof value === "string" ? `"${value}"` : String(value)}
          </span>
        </div>
      )
    }

    const isArray = Array.isArray(value)
    const length = isArray ? value.length : Object.keys(value).length

    return (
      <div>
        <div
          className="flex items-center gap-1 cursor-pointer hover:bg-accent rounded px-1"
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => toggleExpand(`${depth}-${key}`)}
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span className="text-primary font-medium">{key}:</span>
          <span className="text-muted-foreground text-xs">{isArray ? `Array[${length}]` : `Object{${length}}`}</span>
        </div>
        {isExpanded && (
          <div>
            {isArray
              ? value.map((item, index) => <div key={index}>{renderValue(item, String(index), depth + 1)}</div>)
              : Object.entries(value).map(([k, v]) => <div key={k}>{renderValue(v, k, depth + 1)}</div>)}
          </div>
        )}
      </div>
    )
  }

  if (typeof data !== "object" || data === null) {
    return <div className="text-foreground font-mono text-sm">{JSON.stringify(data, null, 2)}</div>
  }

  return (
    <div className="font-mono text-sm space-y-0.5">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>{renderValue(value, key, level)}</div>
      ))}
    </div>
  )
}
