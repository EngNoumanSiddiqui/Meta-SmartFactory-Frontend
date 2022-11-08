/**
 * Created by reis on 20.11.2018.
 */
import { Injectable } from '@angular/core';
import { BasePageService } from '../../base/base-page.service';
import { OptionService } from '../../base/option-service';
import { ShareHttpCallsService } from '../shared-http-calls.service';

@Injectable()

export class EnumService extends BasePageService {

  constructor(private _httpSvc: ShareHttpCallsService, private _opt: OptionService) {
    super();
  }

  getProductionOrderTypeList() { return this._httpSvc.get('prodOrderTypeEnum', this._opt.getHeader()).toPromise(); }

  getGoodsMovementActivityTypeList() { return this._httpSvc.get('GoodsMovementActivityTypeEnum', this._opt.getHeader()).toPromise(); }
  getDispatchingStatusEnum() { return this._httpSvc.get('DispatchingStatusEnum', this._opt.getHeader()).toPromise(); }

  getGoodsMovementDocumentTypeList() { return this._httpSvc.get('GoodMovementDocumentTypeEnum', this._opt.getHeader()).toPromise(); }

  getMovementTypeList() { return this._httpSvc.get('MovementTypeEnum', this._opt.getHeader()).toPromise(); }
  getProjectStatusEnum() { return this._httpSvc.get('ProjectStatusEnum', this._opt.getHeader()).toPromise(); }
  getEquipmentStatusList() { return this._httpSvc.get('EquipmentStatusEnum', this._opt.getHeader()).toPromise(); }

  getEquipmentTaskType() { return this._httpSvc.get('equipmentTask', this._opt.getHeader()).toPromise(); }

  getSkillMatrixGroupTypeEnum() { return this._httpSvc.get('SkillMatrixGroupTypeEnum', this._opt.getHeader()).toPromise(); }


  getVehicleTypeEnum() { return this._httpSvc.get('VehicleTypeEnum', this._opt.getHeader()).toPromise(); }
  getProductionTypeEnum() { return this._httpSvc.get('ProductionTypeEnum', this._opt.getHeader()).toPromise(); }

  getBatchLevel() { return this._httpSvc.get('batchLevel', this._opt.getHeader()).toPromise(); }
  QuatationStatusEnum() { return this._httpSvc.get('QuatationStatusEnum', this._opt.getHeader()).toPromise(); }

  EmployeeShiftsExceptionalTypes() { return this._httpSvc.get('EmployeeShiftsExceptionalTypes', this._opt.getHeader()).toPromise(); }

  getLatestStockReservationStatusEnums() { return this._httpSvc.get('latestStockReservationStatusEnum', this._opt.getHeader()).toPromise(); }

  getGoodsMovementNotificationStatus() { return this._httpSvc.get('goodsMovementNotificationStatus', this._opt.getHeader()).toPromise(); }

  getSchedulingIndicatorEnum() { return this._httpSvc.get('SchedulingIndicatorEnum', this._opt.getHeader()).toPromise(); }
  getGeneralSettingCatagoryType() { return this._httpSvc.get('generalSettingCategoryType', this._opt.getHeader()).toPromise(); }
  getGeneralSettingItemValueObjectType() { return this._httpSvc.get('GeneralSettingITemValueObjectType', this._opt.getHeader()).toPromise(); }
  getGeneralSettingTypeEnum() { return this._httpSvc.get('generalSettingTypeEnum', this._opt.getHeader()).toPromise(); }
  
  getMaintenanceOrderNotificationTypeEnum() { return this._httpSvc.get('MaintenanceOrderNotificationTypeEnum', this._opt.getHeader()).toPromise(); }
  getMaintenanceOrderTypeEnum() { return this._httpSvc.get('MaintenanceOrderTypeEnum', this._opt.getHeader()).toPromise(); }
  getMaintenanceActivityTypeEnum() { return this._httpSvc.get('MaintenanceActivityTypeEnum', this._opt.getHeader()).toPromise(); }

  getMaintenanceOrderPlanScheduleCallStatusEnum() { return this._httpSvc.get('MaintenanceOrderPlanScheduleCallStatusEnum', this._opt.getHeader()).toPromise(); }

  getMaintenanceOrderPlanScheduleCallTypeEnum() { return this._httpSvc.get('MaintenanceOrderPlanScheduleCallTypeEnum', this._opt.getHeader()).toPromise(); }

  getMaintenanceNotificationPriorityEnum() { return this._httpSvc.get('maintenanceNotificationPriority', this._opt.getHeader()).toPromise(); }

  getMaintenanceOrderPlanTypeEnum() { return this._httpSvc.get('MaintenanceOrderPlanTypeEnum', this._opt.getHeader()).toPromise(); }
  getMaintenanceStatusEnum() { return this._httpSvc.get('MaintenanceStatusEnum', this._opt.getHeader()).toPromise(); }

  getEmployeeGenericGroupTypeEnum() { return this._httpSvc.get('EmployeeGenericGroupTypeEnum', this._opt.getHeader()).toPromise(); }

  getInspectionCharactericStatusEnum() { return this._httpSvc.get('QualityInspectionCharacteristicStatusEnum', this._opt.getHeader()).toPromise(); }

  getQualityInspectionCharacteristicTypeEnum() { return this._httpSvc.get('QualityInspectionCharacteristicTypeEnum', this._opt.getHeader()).toPromise(); }

  getQualityInspectionLotStatusEnum() { return this._httpSvc.get('QualityInspectionLotStatusEnum', this._opt.getHeader()).toPromise(); }

  getQualityInspectionMethodStatusEnum() { return this._httpSvc.get('QualityInspectionMethodStatusEnum', this._opt.getHeader()).toPromise(); }

  getQualityInspectionPlanStatusEnum() { return this._httpSvc.get('QualityInspectionPlanStatusEnum', this._opt.getHeader()).toPromise(); }

  getQualityBlockFunctionEnum() { return this._httpSvc.get('QualityBlockFunctionEnum', this._opt.getHeader()).toPromise(); }

  getQualityNotificationTypeEnum() { return this._httpSvc.get('QualityNotificationTypeEnum', this._opt.getHeader()).toPromise(); }

  getQualityNoificationStatusEnum() { return this._httpSvc.get('QualityNotificationStatusEnum', this._opt.getHeader()).toPromise(); }

  getQualityNotificationPriorityEnum() { return this._httpSvc.get('QualityNotificationPriorityEnum', this._opt.getHeader()).toPromise(); }

  getQualityCharacteristicControlIndicatorTypeEnum() { return this._httpSvc.get('QualityCharacteristicControlIndicatorTypeEnum', this._opt.getHeader()).toPromise(); }

  getQualityInspectionTypeEnum() { return this._httpSvc.get('QualityInspectionTypeEnum', this._opt.getHeader()).toPromise(); }

  getCommonPriorityEnum() { return this._httpSvc.get('CommonPriorityEnum', this._opt.getHeader()).toPromise(); }

  getStockPurchaseConditionTypeCode() { return this._httpSvc.get('StockPurchaseConditionTypeCode', this._opt.getHeader()).toPromise(); }
  getForkLiftStatusEnum() { return this._httpSvc.get('ForkLiftStatusEnum', this._opt.getHeader()).toPromise(); }

  getTimeIntervalEnum() { return this._httpSvc.get('TimeIntervalEnum', this._opt.getHeader()).toPromise(); }
  getInvoiceTypeEnum() { return this._httpSvc.get('InvoiceTypeEnum', this._opt.getHeader()).toPromise(); }

  getCommonTemplateTypeEnum() { return this._httpSvc.get('CommonTemplateTypeEnum', this._opt.getHeader()).toPromise(); }
  getStockStrategyEnum() { return this._httpSvc.get('StockStrategyEnum', this._opt.getHeader()).toPromise(); }

  getJobOrderScheduleTypeEnum() { return this._httpSvc.get('JobOrderScheduleTypeEnum', this._opt.getHeader()).toPromise(); }
}

