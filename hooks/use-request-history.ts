"use client"

import { useState, useEffect } from "react"

const STORAGE_KEY = "api-craft-history"
const MAX_HISTORY = 50

export interface RequestHistoryItem {
  id: string
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  queryParams?: Record<string, string>
  response: any
  timestamp: string
}

export function useRequestHistory() {
  const [history, setHistory] = useState<RequestHistoryItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse history:", e)
      }
    }
  }, [])

  const addToHistory = (item: Omit<RequestHistoryItem, "id">) => {
    const newItem: RequestHistoryItem = {
      ...item,
      id: Date.now().toString(),
    }

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY)
    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  }

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  }
}
