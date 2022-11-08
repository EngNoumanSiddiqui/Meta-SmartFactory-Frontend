/**
 * Created by reis on 7.11.2018.
 */
export class PowerConsuptionSettingsDto {
  currency: string = 'EURO';
  requestTariffTypeDetailDtos: RequestTariffTypeDetailDtos[];
  tariffTypeId: number;
}

export class RequestTariffTypeDetailDtos {
  endTime: string ;
  startTime: string ;
  stepEnd: any ;
  stepStart: any ;
  unitCost: any ;
}
