import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CalendarModule } from 'primeng/calendar';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { ValuationModeRoutingModule } from './valuation-mode-routing.module';
import { ListValuationMode } from './list/list.component'
import { NewValuationMode } from './new/new.component';
import { EditValuationMode } from './edit/edit.component';
import { DetailValuationMode } from './detail/detail.component';
import {  ValuationModeService } from 'app/services/dto-services/valuation-mode/valuation-mode.service'

@NgModule({
  declarations: [ListValuationMode, NewValuationMode, EditValuationMode, DetailValuationMode],
  imports: [
    CommonModule,
    ValuationModeRoutingModule,
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
    CalendarModule,
  ],
  providers: [ValuationModeService]
})
export class ValuationModeModule { }
