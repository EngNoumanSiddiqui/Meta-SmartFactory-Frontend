export class RequestPrintDto {
  templateId = null;
  templateText = null;
  templateTypeId = null;
  itemId = null;
  offset: number = null;
  plantId = null;
  templateTypeCode = null;
  emailBody=  null;
};

export enum CommonTemplateTypeEnum {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  SALE_ORDER = 'SALE_ORDER',
  DELIVERY_NOTE = 'DELIVERY_NOTE',
  SALES_ORDER_QUOTATION = "SALES_ORDER_QUOTATION",
  PURCHASE_ORDER_QUOTATION = "PURCHASE_ORDER_QUOTATION",
  PRODUCTION_ORDER = 'PRODUCTION_ORDER',
  JOB_ORDER_LIST = 'JOB_ORDER_LIST',
  GOODS_MOVEMENT = 'GOODS_MOVEMENT',
  GOODS_MOVEMENT_NOTIFICATION = 'GOODS_MOVEMENT_NOTIFICATION',
  JOB_ORDER = 'JOB_ORDER',
  SCRAP = 'SCRAP',
  PALLET = 'PALLET'
}
