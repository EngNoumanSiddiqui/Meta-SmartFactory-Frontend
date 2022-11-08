import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QualityReportTypeService} from 'app/services/dto-services/quality-report-type/quality-report-type.service'
import { QualityReportTypeRoutingModule } from './quality-report-type-routing.module';
import { ListQualityReportTypes } from './list/list.component';


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
import { NewQualityReportType } from './new/new.component';
import { EditQualityReportType } from './edit/edit.component';
import { DetailQualityReportType } from './detail/detail.component';


@NgModule({
  declarations: [ListQualityReportTypes, NewQualityReportType, EditQualityReportType, DetailQualityReportType],
  imports: [
    CommonModule,
    QualityReportTypeRoutingModule,
    FormsModule,
    DassSharedModule,
    RatingModule,
    TooltipModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    SidebarModule,
    TableModule,
    TreeTableModule,
    CalendarModule,
  ],
  providers:[QualityReportTypeService]
})
export class QualityReportType { }
