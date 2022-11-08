import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefectLocationRoutingModule } from './defect-location-routing.module';
import {DefectLocationsService} from 'app/services/dto-services/defect-location/defect-locations.service'

import { ListDefectLocations } from './list/list.component';


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
import { NewDefectLocation } from './new/new.component';
import { EditDefectLocation } from './edit/edit.component';
import { DetailDefectLocation } from './detail/detail.component';


@NgModule({
  declarations: [ListDefectLocations, NewDefectLocation, EditDefectLocation, DetailDefectLocation],
  imports: [
    CommonModule,
    DefectLocationRoutingModule,
    FormsModule,
    DassSharedModule,
    RatingModule,
    TooltipModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    SidebarModule,
    TableModule,
    TreeTableModule,
    CalendarModule
  ],
  providers:[DefectLocationsService],
  exports: [NewDefectLocation]
})
export class DefectLocationModule { }
