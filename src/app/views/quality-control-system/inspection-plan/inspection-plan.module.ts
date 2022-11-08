import { NgModule } from '@angular/core';

import { ListInspectionPlan } from './list/list.component';
import { DetailInspectionPlan } from './detail/detail.component';
import { NewInspectionPlan } from './new/new.component';
import { EditInspectionPlan } from './edit/edit.component';
import { ListInspectionPlanOperation } from './inspection-plan-operation/list/list.component';
import { DetailInspectionPlanOperation } from './inspection-plan-operation/detail/detail.component';
import { NewInspectionPlanOperation } from './inspection-plan-operation/new/new.component';
import { EditInspectionPlanOperation } from './inspection-plan-operation/edit/edit.component';
import { ListInspectionCharOp } from './inspection-characteristic/list/list.component';
import { DetailInspectionCharOp } from './inspection-characteristic/detail/detail.component';
import { NewInspectionCharOp } from './inspection-characteristic/new/new.component';
import { EditInspectionCharOp } from './inspection-characteristic/edit/edit.component';
import { InspectionPlanRoutingModule } from './inspection-plan-routing.module';
import { FormsModule } from '@angular/forms';

import { DassSharedModule } from 'app/shared/dass-shared.module';
import {
  RatingModule,
  SidebarModule,
  TooltipModule,
  TreeTableModule,
  ConfirmDialogModule
} from 'primeng';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { WorkstationDashboardService } from 'app/services/dto-services/workstation/workstation-dashboard.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { InspectionPlanService } from 'app/services/dto-services/inspection-plan/inspection-plan.service';
import { InspectionPlanOperationService } from 'app/services/dto-services/inspection-plan/inspection-plan-operation.service';
import { InspectionCharOpService } from 'app/services/dto-services/inspection-plan/inspection-characteristic.service';
import { QualityInspectionOperationAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-operation-auto-complete/quality-inspection-operation-autocomplete-module';
@NgModule({
  imports: [
    InspectionPlanRoutingModule,
    FormsModule,
    DassSharedModule,
    RatingModule,
    TooltipModule,
    CommonModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    SidebarModule,
    TableModule,
    TreeTableModule,
    WorkStationAutoCompleteModule,
    PlantAutoCompleteModule,
    StockAutoCompleteModule,
    WorkCenterAutocompleteModule,
    QualityInspectionOperationAutoCompleteModule,
    CalendarModule
  ],
  providers: [
    WorkstationDashboardService,
    EnumActStatusService,
    EnumActPositionService,
    InspectionPlanService,
    InspectionPlanOperationService,
    InspectionCharOpService
  ],
  declarations: [
    ListInspectionPlan,
    DetailInspectionPlan,
    NewInspectionPlan,
    EditInspectionPlan,
    ListInspectionPlanOperation,
    DetailInspectionPlanOperation,
    NewInspectionPlanOperation,
    EditInspectionPlanOperation,
    ListInspectionCharOp,
    DetailInspectionCharOp,
    NewInspectionCharOp,
    EditInspectionCharOp
  ],
  exports:[
    ListInspectionPlan,
    DetailInspectionPlan,
    NewInspectionPlan,
    EditInspectionPlan,
    ListInspectionPlanOperation,
    DetailInspectionPlanOperation,
    NewInspectionPlanOperation,
    EditInspectionPlanOperation,
    ListInspectionCharOp,
    DetailInspectionCharOp,
    NewInspectionCharOp,
    EditInspectionCharOp
  ]
})
export class InspectionPlanModule {}
