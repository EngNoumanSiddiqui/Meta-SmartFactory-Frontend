/**
 * Created by Hammad on 01.01.2020.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../shared/dass-shared.module';
import { MaintenancePlaningDetailComponent } from './maintenance-processing/maintenance-planing/maintenance-planing-detail/maintenance-planing-detail.component';
import { FormsModule } from '@angular/forms';
import { MaintenancePlanTypeService } from 'app/services/dto-services/maintenance/maintenance-plan-types.service';
import { MaintenanceItemService } from 'app/services/dto-services/maintenance/maintenance-item.service';
import { MaintenanceOrderTypeService } from 'app/services/dto-services/maintenance-equipment/maintenance-order-type.service';
import { MaintenancePlaningService } from 'app/services/dto-services/maintenance-equipment/maintenance-planing.service';
import { FunctionalLocationService } from 'app/services/dto-services/maintenance-equipment/functional-location.service';
import { EquipmentService } from 'app/services/dto-services/equipment/equipment.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { EquipmentPlannerGroupService } from 'app/services/dto-services/maintenance-equipment/planner-group.service';
import { EquipmentAbcIndicatorService } from 'app/services/dto-services/maintenance-equipment/abc-indicator.service';
import { CategoryDetailComponent } from './equipment-technical-objects/category/detail/detail.component';
import { MaintenanceOrderDetailComponent } from './maintenance-order/maintenance-order/detail/detail.component';
import { OrderOperationModule } from './maintenance-order/order-operation/order-operation.module';
import { MaintenanceOrderComponentModule } from './maintenance-order/maintenance-order-component/maintenance-order-component.module';
import { ScheduleCallModule } from './maintenance-processing/schedule-call/schedule-call.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    OrderOperationModule,
    ScheduleCallModule,
    MaintenanceOrderComponentModule

  ],
  declarations: [
    MaintenancePlaningDetailComponent, 
    CategoryDetailComponent,
    MaintenanceOrderDetailComponent
  ],
  exports:[
    MaintenancePlaningDetailComponent,
    CategoryDetailComponent,
    MaintenanceOrderDetailComponent
  ],
  providers: [ 
    MaintenancePlanTypeService,
    MaintenanceItemService,
    MaintenanceOrderTypeService,
    MaintenancePlaningService, 
    FunctionalLocationService, 
    EquipmentService, 
    WorkstationService, 
    PlantService,
    EquipmentPlannerGroupService, 
    EquipmentAbcIndicatorService, 
  ]
})
export class MaintenanceSharedModule {
}
