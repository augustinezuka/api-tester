"use client"

import { useEffect, useState } from "react"

interface EnvironmentVariable {
  key: string
  value: string
}

export function useEnvironmentVars() {
  const [vars, setVars] = useState<EnvironmentVariable[]>([])

  useEffect(() => {
    const activeEnvId = localStorage.getItem("apicraft_active_environment")
    if (!activeEnvId) return

    const environments = localStorage.getItem("apicraft_environments")
    if (!environments) return

    const envs = JSON.parse(environments)
    const activeEnv = envs.find((e: any) => e.id === activeEnvId)

    if (activeEnv) {
      setVars(activeEnv.variables || [])
    }
  }, [])

  const replaceVars = (text: string): string => {
    let result = text
    vars.forEach((v) => {
      const regex = new RegExp(`{{${v.key}}}`, "g")
      result = result.replace(regex, v.value)
    })
    return result
  }

  return { vars, replaceVars }
}
