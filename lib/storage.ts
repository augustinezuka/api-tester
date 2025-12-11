import type { SavedRequest, HistoryEntry, Environment } from "./api-types"

const STORAGE_KEYS = {
  SAVED_REQUESTS: "api_tester_saved_requests",
  HISTORY: "api_tester_history",
  ENVIRONMENTS: "api_tester_environments",
  CURRENT_ENV: "api_tester_current_env",
  PREFERENCES: "api_tester_preferences",
}

export interface StoragePreferences {
  darkMode: boolean
  defaultTimeout: number
}

export const storage = {
  savedRequests: {
    get: (): SavedRequest[] => {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_REQUESTS)
      return data ? JSON.parse(data) : []
    },
    set: (requests: SavedRequest[]) => {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.SAVED_REQUESTS, JSON.stringify(requests))
    },
  },

  history: {
    get: (): HistoryEntry[] => {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
      return data ? JSON.parse(data) : []
    },
    set: (entries: HistoryEntry[]) => {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(entries))
    },
  },

  environments: {
    get: (): Environment[] => {
      if (typeof window === "undefined") return []
      const data = localStorage.getItem(STORAGE_KEYS.ENVIRONMENTS)
      return data ? JSON.parse(data) : []
    },
    set: (envs: Environment[]) => {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(envs))
    },
  },

  currentEnv: {
    get: (): string | null => {
      if (typeof window === "undefined") return null
      return localStorage.getItem(STORAGE_KEYS.CURRENT_ENV)
    },
    set: (env: string | null) => {
      if (typeof window === "undefined") return
      env ? localStorage.setItem(STORAGE_KEYS.CURRENT_ENV, env) : localStorage.removeItem(STORAGE_KEYS.CURRENT_ENV)
    },
  },

  preferences: {
    get: (): StoragePreferences => {
      if (typeof window === "undefined") return { darkMode: false, defaultTimeout: 30000 }
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      return data ? JSON.parse(data) : { darkMode: false, defaultTimeout: 30000 }
    },
    set: (prefs: StoragePreferences) => {
      if (typeof window === "undefined") return
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs))
    },
  },

  clearAll: () => {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  },
}
