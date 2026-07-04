export const cjConfig = {
  apiKey: process.env.CJ_API_KEY ?? "",
  accessToken: process.env.CJ_ACCESS_TOKEN ?? "",
  refreshToken: process.env.CJ_REFRESH_TOKEN ?? "",
  baseUrl:
    process.env.CJ_API_BASE_URL ??
    "https://developers.cjdropshipping.com/api2.0/v1",
  priceMarkupPercent: Number(process.env.CJ_PRICE_MARKUP_PERCENT ?? "35"),
  defaultCountryCode: process.env.CJ_DEFAULT_COUNTRY_CODE ?? "US",
  fromCountryCode: process.env.CJ_FROM_COUNTRY_CODE ?? "CN",
  defaultLogisticName:
    process.env.CJ_DEFAULT_LOGISTIC_NAME ?? "CJPacket Ordinary",
  isSandbox: process.env.CJ_IS_SANDBOX === "1",
  webhookSecret: process.env.CJ_WEBHOOK_SECRET ?? "",
};

export function isCjConfigured(): boolean {
  return Boolean(cjConfig.apiKey || cjConfig.accessToken);
}
