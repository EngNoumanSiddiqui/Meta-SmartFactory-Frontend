import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service';
import { UsageDecisionTypeRoutingModule } from './usage-decision-type-routing.module';
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
import { ListUsageDecisionType } from './list/list.component';
import { NewUsageDecisionType } from './new/new.component';
import { EditUsageDecisionType } from './edit/edit.component';
import { DetailUsageDecisionType } from './detail/detail.component';

@NgModule({
  declarations: [
    ListUsageDecisionType,
    NewUsageDecisionType,
    EditUsageDecisionType,
    DetailUsageDecisionType
  ],
  imports: [
    CommonModule,
    UsageDecisionTypeRoutingModule,
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
  providers: [DefectTypeService],
  exports: []
})

export class UsageDecisionTypeModule { }
