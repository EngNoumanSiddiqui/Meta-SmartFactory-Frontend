/**
 * Created by reis on 28.06.2019.
 */
export class PlantModelDto {
  address: string;
  createdDate: any;
  plantCode: string;
  plantId: number;
  plantName: string;
  postcode: string
}
export interface PlantDto{
  address: string,
  cityId: number,
  cityName: string,
  companyAddress: string,
  companyId: number,
  countryId: number,
  countryName: string,
  createdDate: string | Date,
  plantCode: string,
  plantId: number,
  plantName: string,
  postcode: string
}

export interface IOrganization {
  address:                                         string;
  checkAvaiableStockForRequestedReservation:       boolean| number;
  cityId:                                          number;
  cityName:                                        string;
  countryId:                                       number;
  countryName:                                     string;
  createAutoProdOrders:                            boolean|number;
  createdDate:                                     Date;
  deliverManualPurchaseOrder:                      boolean | number;
  getWaitingForMaterialReservationByJobOrder:      boolean | number;
  goodsMovementCodTemplete:                        string;
  materialCode:                                    string;
  organizationCode:                                string;
  organizationId:                                  number;
  organizationName:                                string;
  plantId:                                         number;
  postcode:                                        string;
  prodOrderCodeTemplete:                           string;
  purchaseOrderCodeTemplete:                       string;
  purchaseQuotationCodeTemplete:                   string;
  recheckJobOrderStockHasUnReristrictedQuantity:   boolean|number;
  releaseAllStockFromReservation:                  boolean|number;
  releaseAllStockFromReservationAfterAutoSchedule: boolean|number;
  salesForecastDurationDay:                        number;
  salesOrderCodeTemplete:                          string;
  salesQuotationCodeTemplete:                      string;
}
