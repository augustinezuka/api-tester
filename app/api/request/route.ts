import axios from "axios"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    const { method, url, headers, body, queryParams } = config

    // Build URL with query params
    let fullUrl = url
    if (queryParams && Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams)
      fullUrl = `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`
    }

    // Make request with axios
    const startTime = Date.now()
    const response = await axios({
      method: method.toLowerCase(),
      url: fullUrl,
      headers: headers || {},
      data: body ? (headers?.["Content-Type"]?.includes("application/json") ? JSON.parse(body) : body) : undefined,
      validateStatus: () => true, // Don't throw on any status
      timeout: 30000, // 30 second timeout
    })
    const endTime = Date.now()

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      duration: endTime - startTime,
    })
  } catch (error: any) {
    console.error("Request error:", error)
    return NextResponse.json(
      {
        error: error.message || "Request failed",
        details: error.response?.data || null,
      },
      { status: 500 },
    )
  }
}
