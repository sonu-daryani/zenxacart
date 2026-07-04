export type CjApiResponse<T> = {
  code: number;
  result: boolean;
  message: string;
  data: T;
  success?: boolean;
  requestId?: string;
};

export type CjTokenData = {
  accessToken: string;
  accessTokenExpiryDate?: string;
  refreshToken: string;
  refreshTokenExpiryDate?: string;
  openId?: number;
};

export type CjListProduct = {
  id: string;
  nameEn: string;
  sku: string;
  spu?: string;
  bigImage: string;
  sellPrice: string;
  nowPrice?: string;
  discountPrice?: string;
  listedNum?: number;
  threeCategoryName?: string;
  twoCategoryName?: string;
  oneCategoryName?: string;
};

export type CjListV2Data = {
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
  totalPages: number;
  content: Array<{
    productList: CjListProduct[];
  }>;
};

export type CjVariant = {
  vid: string;
  pid: string;
  variantSku: string;
  variantNameEn?: string;
  variantSellPrice?: number;
  variantImage?: string;
};

export type CjProductDetail = {
  pid: string;
  productNameEn: string;
  productSku: string;
  bigImage: string;
  sellPrice: number;
  description?: string;
  variants: CjVariant[];
};

export type CjFreightOption = {
  logisticName: string;
  logisticPrice?: number;
  logisticPriceCn?: number;
  logisticAging?: string;
};

export type CjCreateOrderProduct = {
  vid: string;
  sku?: string;
  quantity: number;
  storeLineItemId?: string;
};

export type CjCreateOrderPayload = {
  orderNumber: string;
  shippingZip?: string;
  shippingCountry: string;
  shippingCountryCode: string;
  shippingProvince: string;
  shippingCity: string;
  shippingCounty?: string;
  shippingPhone?: string;
  shippingCustomerName: string;
  shippingAddress: string;
  shippingAddress2?: string;
  email?: string;
  remark?: string;
  logisticName: string;
  fromCountryCode: string;
  platform?: string;
  shopLogisticsType?: number;
  isSandbox?: number;
  products: CjCreateOrderProduct[];
};

export type CjCreateOrderResult = {
  orderId?: string;
  orderNumber?: string;
  orderStatus?: string;
  cjPayUrl?: string;
  actualPayment?: number;
  productAmount?: number;
  postageAmount?: number;
};
