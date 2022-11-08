import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CommonDialogsComponent} from './common-dialog.component';
import {DassSharedModule} from '../../shared/dass-shared.module';
import {SharedWorkstationModule} from '../../views/production-settings/workstation/shared-workstation.module';
import {SharedOperationsModule} from '../../views/production-settings/operations/shared-operations.module';
import { SharedPlantModule } from 'app/views/production-settings/plant/shared-plant.module';
import { SharedWarehouseModule } from 'app/views/stocks/warehouse/warehouse.shared.module';
import { CountrySharedModule } from 'app/views/general-settings/country/country-shared.module';
import { WorkcenterTypeSharedModule } from 'app/views/production-settings/workcenter-type/workcenter-type-shared.module';
import { WorkcenterSharedModule } from 'app/views/production-settings/workcenter/workcenter-shared.module';
import { SettingsSharedModule } from 'app/views/production-settings/settings-shared.module';
import { SharedFunctionalLocationModule } from 'app/views/maintenance/equipment-technical-objects/functional-location/shared-functional-location-module';
import { SharedEquipmentsModule } from 'app/views/maintenance/equipment-technical-objects/equipment/shared-equipment.module';
import { SharedMaintenanceSystemConditionModule } from 'app/views/maintenance/maintenance-technical-objects/maintenance-system-condition/shared-maintenance-system-condition.module';
import { SharedMaintenanceActivityTypeModule } from 'app/views/maintenance/maintenance-technical-objects/maintenance-activity-type/shared-maintenance-activity-type.module';
import { SharedMaintenanceCategoryModule } from 'app/views/maintenance/maintenance-technical-objects/maintenance-category/shared-maintenance-category.module';
import { SharedMaintenanceReasonModule } from 'app/views/maintenance/maintenance-technical-objects/maintenance-reason/shared-maintenance-reason.module';
import { MaintenanceSharedModule } from 'app/views/maintenance/maintenance-shared.module';
import { SharedEquipmentPlannerGroupModule } from 'app/views/maintenance/equipment-technical-objects/planner-group/shared-planner-gruop-module';
import { SharedAbcIndicatorModule } from 'app/views/maintenance/equipment-technical-objects/abc-indicator/shared-abc-indicator-module';
import { SharedMaintenanceStrategyModule } from 'app/views/maintenance/maintenance-technical-objects/maintenance-strategy/shared-maintenance-strategy.module';
import { SharedEquipmentCodeGroupModule } from 'app/views/maintenance/equipment-technical-objects/code-group/shared-code-group.module';
import { SharedEquipmentCodeGroupHeaderModule } from 'app/views/maintenance/equipment-technical-objects/code-group-header/shared-code-group-header.module';
import { SharedCityModule } from 'app/views/general-settings/city/shared-city.module';
import { SharedCapabilityModule } from 'app/views/labor/employee-capabilities/shared-employee-capability.module';
import { JobOrderSharedModule } from 'app/views/analysis/job-order-report/joborder-report-shared.module';
import { ScrapCauseSharedModule } from 'app/views/quality-control-system/quality-settings/scrap-cause/scrap-cause.shared.module';
import { ScrapTypeSharedModule } from 'app/views/quality-control-system/quality-settings/scrap-type/scrap-type.shared.module';
import { ScrapReworkCauseSharedModule } from 'app/views/quality-control-system/quality-settings/scrap-cause-rework/scrap-cause-rework-shared.module';
import { EmployeeSkillsModule } from 'app/views/labor/employee-skills/employee-skills.module';
import { SharedCustomerModule } from 'app/views/inventory-management/order-management/customers/shared-customer-module';
import { PordersSharedModule } from 'app/views/inventory-management/order-management/porders/porders.shared.module';
import { SalesSharedModule } from 'app/views/inventory-management/order-management/sales/sales-shared.module';
import { SharedBatchModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/batch/shared-batch.module';
import { SharedStockTransferModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/transfer/shared-transfer-module';
import { BasicManufacturingSharedModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/basic-manufacturing-planning.shared.module';
import { ReservationModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/reservation/reservation.module';
import { TransferNotificationModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/transfer-notifications/transfer-notifications.module';
import { PalletRecordsModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/pallet-records/pallet-records.module';
import { SharedShiftSettingsModule } from 'app/views/labor/shift-settings/shared.shift.setting.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedMaintenanceNotificationTypeModule } from 'app/views/maintenance/maintenance-technical-objects/maintenance-notification-type/shared-maintenance-notification-type.module';
import { SharedEquipmentOperationModule } from 'app/views/maintenance/equipment-technical-objects/equipment-operation/shared-equipment-operation.module';
import { SharedNotificationsModule } from 'app/views/maintenance/maintenance-processing/notifications/shared-notifications.module';
import { StopCauseTypeModule } from 'app/views/production-settings/stop-cause-type/stop-cause-type.module';
import { CausesModule } from 'app/views/production-settings/causes/causes.module';
import { ProjectModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/projects/projects.module';
import { CostCenterModule } from 'app/views/inventory-management/order-management/cost-center/cost-center.module';
import { LocationModule } from 'app/views/production-settings/location/location.module';
import { SalesQuotationsSharedModule } from 'app/views/inventory-management/order-management/sales-quotations/sales-quotations-shared.module';
import { JobOrderModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/job-order/job-order.module';
import { SendMailModule } from 'app/shared/send-mail/send-mail.module';
import { BarcodeDetailsComponent } from './barcode-details/barcode-details.component';
import { ScrapModule } from 'app/views/production-settings/scrap/scrap.module';
import { ReworkModule } from 'app/views/production-settings/rework/rework.module';
import { FactoryCalendarModule } from 'app/views/factory/factory-calendar/factory-calendar.module';
import { PalletsModule } from 'app/views/production-settings/pallets/pallets.module';
import { EmployeeDetailGroupsListModule } from 'app/views/labor/employee-detail-groups/employee-detail-groups.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DassSharedModule,
    SharedBatchModule,
    SharedWorkstationModule,
    SharedOperationsModule,
    SharedCustomerModule,
    JobOrderModule,
    BasicManufacturingSharedModule,
    SharedStockTransferModule,
    SharedPlantModule,
    SharedWarehouseModule,
    PordersSharedModule,
    ScrapCauseSharedModule,
    ScrapTypeSharedModule,
    ScrapReworkCauseSharedModule,
    CountrySharedModule,
    WorkcenterTypeSharedModule,
    WorkcenterSharedModule,
    SettingsSharedModule,
    SalesSharedModule,
    SharedFunctionalLocationModule,
    SharedEquipmentsModule,
    SharedMaintenanceSystemConditionModule,
    SharedMaintenanceActivityTypeModule,
    SharedMaintenanceCategoryModule,
    SharedMaintenanceReasonModule,
    SharedMaintenanceNotificationTypeModule,
    SharedEquipmentOperationModule,
    MaintenanceSharedModule,
    SharedEquipmentPlannerGroupModule,
    SharedAbcIndicatorModule,
    SharedMaintenanceStrategyModule,
    SharedEquipmentCodeGroupModule,
    SharedEquipmentCodeGroupHeaderModule,
    SharedCityModule,
    SharedNotificationsModule,
    SharedCapabilityModule,
    EmployeeSkillsModule,
    EmployeeDetailGroupsListModule,
    ReservationModule,
    CausesModule,
    TransferNotificationModule,
    PalletsModule,
    PalletRecordsModule,
    JobOrderSharedModule,
    SharedShiftSettingsModule,
    SalesQuotationsSharedModule,
    ProjectModule,
    LocationModule,
    ModalModule.forRoot(),
    StopCauseTypeModule,
    FactoryCalendarModule,
    SendMailModule,
    CostCenterModule,
    ScrapModule,
    ReworkModule
  ],
  declarations: [
    CommonDialogsComponent,
    BarcodeDetailsComponent,
  ],
  exports: [
    CommonDialogsComponent
  ]
  ,
  providers: []
})
export class DetailDialogModule {
}
