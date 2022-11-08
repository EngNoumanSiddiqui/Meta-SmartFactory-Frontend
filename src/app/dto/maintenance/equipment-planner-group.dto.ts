/**
 * Created by reis on 30.07.2019.
 */
export class RequestCreateEquipmentPlannerGroupDto {
  definition: string;
  mail: string;
  plannerGroup: string;
  plannerGroupId: number;
  plantId: number;
  telephone: string;
}
export interface ResponseEquipmentPlannerGroupDto {
  active: boolean;
  createDate: any;
  definition: string;
  equipmentlist: EquipmentDto[],
  mail: string;
  maintanencePlanningPlant: PlantDto;
  plannerGroup: string;
  plannerGroupId: number;
  telephone: string;
  updateDate: any;

}

export interface PlantDto {
  address: string;
  createdDate: any;
  plantCode: string;
  plantId: number;
  plantName: string;
  postcode: string
}

export interface EquipmentDto {
  equipmentId: number;
  equipmentName: string;
  equipmentNo: string;
  equipmentTypeName: number;
}
