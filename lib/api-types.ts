export type HTTPMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export type AuthType = "none" | "basic" | "bearer" | "api-key";

export type ResponseFormat = "json" | "xml" | "html" | "text" | "raw";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthConfig {
  type: AuthType;
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
  apiKeyHeader?: string;
}

export interface RequestConfig {
  method: HTTPMethod;
  url: string;
  headers: KeyValuePair[];
  params: KeyValuePair[];
  body: string;
  bodyType: "json" | "form" | "text" | "xml";
  auth: AuthConfig;
  timeout: number;
}

export interface ResponseData {
  status: number;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
  time: number;
  size: number;
  format: ResponseFormat;
}

export interface ResponseError {
  error: true;
  message: string;
  time: number;
}

export type Response = ResponseData | ResponseError;

export interface SavedRequest {
  id: string;
  name: string;
  config: RequestConfig;
  savedAt: string;
}

export interface HistoryEntry {
  id: string;
  method: HTTPMethod;
  url: string;
  status: number;
  time: number;
  timestamp: string;
}

export interface Environment {
  name: string;
  variables: Record<string, string>;
}

export type ViewType =
  | "landing"
  | "tester"
  | "saved"
  | "history"
  | "templates"
  | "environments";
