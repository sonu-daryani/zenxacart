import type { CjTokenData } from "./types";

type TokenCache = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
};

const globalForCj = globalThis as unknown as {
  cjTokenCache?: TokenCache;
};

export function getCachedTokens(): TokenCache | null {
  return globalForCj.cjTokenCache ?? null;
}

export function setCachedTokens(data: CjTokenData): void {
  const accessExpiresAt = data.accessTokenExpiryDate
    ? new Date(data.accessTokenExpiryDate).getTime()
    : Date.now() + 14 * 24 * 60 * 60 * 1000;

  globalForCj.cjTokenCache = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    accessExpiresAt,
  };
}

export function isTokenExpired(cache: TokenCache): boolean {
  return Date.now() > cache.accessExpiresAt - 60_000;
}
