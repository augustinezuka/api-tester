"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function AuthCheck() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("apicraft_user")
    if (user) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
