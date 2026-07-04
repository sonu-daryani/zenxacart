import { cjConfig, isCjConfigured } from "./config";
import {
  getCachedTokens,
  isTokenExpired,
  setCachedTokens,
} from "./token-store";
import type { CjApiResponse, CjTokenData } from "./types";

export class CjApiError extends Error {
  code: number;
  constructor(message: string, code = 0) {
    super(message);
    this.name = "CjApiError";
    this.code = code;
  }
}

async function fetchCj<T>(
  path: string,
  init?: RequestInit & { skipAuth?: boolean }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };

  if (!init?.skipAuth) {
    const token = await getCjAccessToken();
    headers["CJ-Access-Token"] = token;
  }

  const res = await fetch(`${cjConfig.baseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const json = (await res.json()) as CjApiResponse<T>;

  if (!res.ok || json.code !== 200 || json.result === false) {
    throw new CjApiError(json.message || "CJ API request failed", json.code);
  }

  return json.data;
}

export async function getCjAccessToken(): Promise<string> {
  if (!isCjConfigured()) {
    throw new CjApiError(
      "CJ Dropshipping is not configured. Set CJ_API_KEY in .env.local"
    );
  }

  if (cjConfig.accessToken && !cjConfig.apiKey) {
    return cjConfig.accessToken;
  }

  const cached = getCachedTokens();
  if (cached && !isTokenExpired(cached)) {
    return cached.accessToken;
  }

  if (cached?.refreshToken || cjConfig.refreshToken) {
    const refreshToken = cached?.refreshToken ?? cjConfig.refreshToken;
    const data = await fetchCj<CjTokenData>(
      "/authentication/refreshAccessToken",
      {
        method: "POST",
        skipAuth: true,
        body: JSON.stringify({ refreshToken }),
      }
    );
    setCachedTokens(data);
    return data.accessToken;
  }

  const data = await fetchCj<CjTokenData>("/authentication/getAccessToken", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ apiKey: cjConfig.apiKey }),
  });

  setCachedTokens(data);
  return data.accessToken;
}

export async function cjGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(`${cjConfig.baseUrl}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }

  const token = await getCjAccessToken();
  const res = await fetch(url.toString(), {
    headers: {
      "CJ-Access-Token": token,
    },
    cache: "no-store",
  });

  const json = (await res.json()) as CjApiResponse<T>;
  if (json.code !== 200 || json.result === false) {
    throw new CjApiError(json.message || "CJ API request failed", json.code);
  }
  return json.data;
}

export async function cjPost<T>(path: string, body: unknown): Promise<T> {
  return fetchCj<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
