import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionOperationRoutingModule } from './inspection-operation-routing.module';
import { ListInspectionOperations } from './list/list.component';
import { DetailInspectionOperation } from './detail/detail.component'
import { NewInspectionOperation } from './new/new.component'
import { EditInspectionOperation } from './edit/edit.component';

import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {
  RatingModule,
  SidebarModule,
  TooltipModule,
  TreeTableModule,
  ConfirmDialogModule
} from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service';
@NgModule({
  declarations: [ListInspectionOperations, EditInspectionOperation, DetailInspectionOperation, NewInspectionOperation],
  imports: [
    CommonModule,
    InspectionOperationRoutingModule,
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
    WorkCenterAutocompleteModule,
    CalendarModule
  ],
  exports: [NewInspectionOperation],
  providers: [InspectionOperationsService]
})
export class InspectionOperationModule { }
