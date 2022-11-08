import { NgModule } from '@angular/core';

import { ListInspectionMethod } from './list/list.component';
import { DetailInspectionMethod } from './detail/detail.component';
import { NewInspectionMethod } from './new/new.component';
import { EditInspectionMethod } from './edit/edit.component';
import { InspectionMethodRoutingModule } from './inspection-method-routing.module';
import { FormsModule } from '@angular/forms';

import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ConfirmDialogModule} from 'primeng';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { WorkstationDashboardService } from 'app/services/dto-services/workstation/workstation-dashboard.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { InspectionMethodService } from 'app/services/dto-services/inspection-method/inspection-method.service';
@NgModule({
  imports: [
    InspectionMethodRoutingModule,
    FormsModule,
    DassSharedModule,
    CommonModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    TableModule,
    WorkStationAutoCompleteModule,
    WorkCenterAutocompleteModule,
    CalendarModule
  ],
  providers: [
    WorkstationDashboardService,
    EnumActStatusService,
    EnumActPositionService,
    InspectionMethodService
  ],
  declarations: [
    ListInspectionMethod,
    DetailInspectionMethod,
    NewInspectionMethod,
    EditInspectionMethod
  ]
})
export class InspectionMethodModule {}
