import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSamplingType } from './list/list.component'
import { SamplingTypeRoutingModule } from './sampling-type-routing.module';
import { FormsModule } from '@angular/forms';
import { SamplingTypeService } from 'app/services/dto-services/sampling-type/sampling-type.service'
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
import { NewSamplingType } from './new/new.component';
import { EditSamplingType } from './edit/edit.component';
import { DetailSamplingType } from './detail/detail.component'
@NgModule({
  declarations: [ListSamplingType, NewSamplingType, EditSamplingType,DetailSamplingType],
  imports: [
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
    SamplingTypeRoutingModule
  ],
  providers: [SamplingTypeService]
})
export class SamplingTypeModule { }
