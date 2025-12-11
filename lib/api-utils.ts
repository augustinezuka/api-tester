import type { RequestConfig, KeyValuePair, AuthConfig } from "./api-types"

export function generateKeyId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function buildUrlWithParams(baseUrl: string, params: KeyValuePair[]): string {
  const enabledParams = params.filter((p) => p.enabled && p.key.trim())
  if (enabledParams.length === 0) return baseUrl

  const queryString = enabledParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join("&")

  return baseUrl + (baseUrl.includes("?") ? "&" : "?") + queryString
}

export function buildHeadersObject(
  headers: KeyValuePair[],
  auth: AuthConfig,
  bodyType: string,
): Record<string, string> {
  const headersObj: Record<string, string> = {}

  // Add enabled headers
  headers
    .filter((h) => h.enabled && h.key.trim())
    .forEach((h) => {
      headersObj[h.key] = h.value
    })

  // Add auth headers
  if (auth.type === "basic" && auth.username && auth.password) {
    const credentials = btoa(`${auth.username}:${auth.password}`)
    headersObj["Authorization"] = `Basic ${credentials}`
  } else if (auth.type === "bearer" && auth.token) {
    headersObj["Authorization"] = `Bearer ${auth.token}`
  } else if (auth.type === "api-key" && auth.apiKey && auth.apiKeyHeader) {
    headersObj[auth.apiKeyHeader] = auth.apiKey
  }

  // Add Content-Type if needed
  if (bodyType === "json" && !headersObj["Content-Type"]) {
    headersObj["Content-Type"] = "application/json"
  } else if (bodyType === "xml" && !headersObj["Content-Type"]) {
    headersObj["Content-Type"] = "application/xml"
  }

  return headersObj
}

export function formatResponse(data: unknown): string {
  if (typeof data === "string") return data
  return JSON.stringify(data, null, 2)
}

export function detectResponseFormat(contentType: string | null): "json" | "xml" | "html" | "text" | "raw" {
  if (!contentType) return "raw"
  if (contentType.includes("application/json")) return "json"
  if (contentType.includes("application/xml") || contentType.includes("text/xml")) return "xml"
  if (contentType.includes("text/html")) return "html"
  if (contentType.includes("text/")) return "text"
  return "raw"
}

export function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-orange-500",
    PATCH: "bg-yellow-500",
    DELETE: "bg-red-500",
    HEAD: "bg-purple-500",
    OPTIONS: "bg-slate-500",
  }
  return colors[method] || "bg-gray-500"
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "text-green-600 dark:text-green-400"
  if (status >= 300 && status < 400) return "text-blue-600 dark:text-blue-400"
  if (status >= 400 && status < 500) return "text-orange-600 dark:text-orange-400"
  if (status >= 500) return "text-red-600 dark:text-red-400"
  return "text-gray-600 dark:text-gray-400"
}

export async function makeRequest(
  config: RequestConfig,
): Promise<{ data: unknown; headers: Record<string, string>; status: number; statusText: string }> {
  const finalUrl = buildUrlWithParams(config.url, config.params)
  const headersObj = buildHeadersObject(config.headers, config.auth, config.bodyType)

  const options: RequestInit = {
    method: config.method,
    headers: headersObj,
  }

  if (["POST", "PUT", "PATCH"].includes(config.method) && config.body) {
    options.body = config.body
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.timeout)

  try {
    const res = await fetch(finalUrl, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    let responseData: unknown
    const contentType = res.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      responseData = await res.json()
    } else {
      responseData = await res.text()
    }

    const responseHeaders: Record<string, string> = {}
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    return {
      data: responseData,
      headers: responseHeaders,
      status: res.status,
      statusText: res.statusText,
    }
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}
