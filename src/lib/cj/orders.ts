import { cjConfig } from "./config";
import { cjPost } from "./client";
import { calculateFreight } from "./freight";
import { resolveVariantIds } from "./products";
import type { CjCreateOrderPayload, CjCreateOrderResult } from "./types";

export type StoreOrderInput = {
  orderNumber: string;
  email?: string;
  phone?: string;
  customerName: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zip?: string;
  country?: string;
  countryCode?: string;
  remark?: string;
  items: Array<{
    id: string;
    quantity: number;
    cjPid?: string;
    cjVid?: string;
    cjSku?: string;
  }>;
};

export async function createCjOrder(input: StoreOrderInput) {
  const countryCode = input.countryCode ?? cjConfig.defaultCountryCode;
  const country = input.country ?? "United States";

  const variants = await resolveVariantIds(input.items);

  const freightProducts = variants.map((v, i) => ({
    vid: v.vid,
    quantity: input.items[i].quantity,
  }));

  const { logisticName } = await calculateFreight({
    countryCode,
    products: freightProducts,
  });

  const payload: CjCreateOrderPayload = {
    orderNumber: input.orderNumber,
    shippingCustomerName: input.customerName,
    shippingAddress: input.address,
    shippingAddress2: input.address2,
    shippingCity: input.city,
    shippingProvince: input.state,
    shippingZip: input.zip,
    shippingCountry: country,
    shippingCountryCode: countryCode,
    shippingPhone: input.phone,
    email: input.email,
    remark: input.remark,
    logisticName,
    fromCountryCode: cjConfig.fromCountryCode,
    platform: "Api",
    shopLogisticsType: 2,
    isSandbox: cjConfig.isSandbox ? 1 : 0,
    products: input.items.map((item, index) => ({
      vid: variants[index].vid,
      sku: variants[index].sku ?? item.cjSku,
      quantity: item.quantity,
      storeLineItemId: item.id,
    })),
  };

  return cjPost<CjCreateOrderResult>("/shopping/order/createOrderV3", payload);
}
