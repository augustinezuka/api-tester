"use client"

import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key)
      if (storedValue) {
        setState(JSON.parse(storedValue))
      }
    } catch (error) {
      console.error(`[v0] Failed to load ${key} from localStorage:`, error)
    }
    setIsHydrated(true)
  }, [key])

  // Save to localStorage whenever state changes
  const setValue = (value: T) => {
    try {
      setState(value)
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[v0] Failed to save ${key} to localStorage:`, error)
    }
  }

  return [state, setValue]
}
