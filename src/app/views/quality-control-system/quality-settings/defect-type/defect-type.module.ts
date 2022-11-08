import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefectTypeService } from 'app/services/dto-services/defect-type/defect-type.service';
import { DefectTypeRoutingModule } from './defect-type-routing.module';


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
import { ListDefectType } from './list/list.component';
import { NewDefectType } from './new/new.component';
import { EditDefectType } from './edit/edit.component';
import { DetailDefectType } from './detail/detail.component';

@NgModule({
  declarations: [ListDefectType, NewDefectType, EditDefectType, DetailDefectType],
  imports: [
    CommonModule,
    DefectTypeRoutingModule,
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
  exports: [NewDefectType]
})
export class DefectTypeModule { }
