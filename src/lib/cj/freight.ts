import { cjConfig } from "./config";
import { cjPost } from "./client";
import type { CjFreightOption } from "./types";

type FreightCalculateBody = {
  startCountryCode: string;
  endCountryCode: string;
  products: Array<{
    vid: string;
    quantity: number;
  }>;
};

type FreightCalculateData = {
  logisticName?: string;
  logisticPrice?: number;
  freightList?: CjFreightOption[];
  [key: string]: unknown;
};

export async function calculateFreight(params: {
  countryCode: string;
  products: Array<{ vid: string; quantity: number }>;
}): Promise<{ logisticName: string; price: number }> {
  const body: FreightCalculateBody = {
    startCountryCode: cjConfig.fromCountryCode,
    endCountryCode: params.countryCode,
    products: params.products,
  };

  try {
    const data = await cjPost<FreightCalculateData | CjFreightOption[]>(
      "/logistic/freightCalculate",
      body
    );

    const list = Array.isArray(data)
      ? data
      : (data as FreightCalculateData).freightList ?? [];

    const preferred =
      list.find((o) => o.logisticName === cjConfig.defaultLogisticName) ??
      list[0];

    if (preferred?.logisticName) {
      return {
        logisticName: preferred.logisticName,
        price: Number(preferred.logisticPrice ?? 0),
      };
    }

    if (!Array.isArray(data) && (data as FreightCalculateData).logisticName) {
      const d = data as FreightCalculateData;
      return {
        logisticName: d.logisticName!,
        price: Number(d.logisticPrice ?? 0),
      };
    }
  } catch {
    /* fall through to default */
  }

  return {
    logisticName: cjConfig.defaultLogisticName,
    price: 0,
  };
}
