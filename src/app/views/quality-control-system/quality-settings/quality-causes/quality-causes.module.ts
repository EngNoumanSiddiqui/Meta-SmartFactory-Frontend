import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QualityCausesService} from 'app/services/dto-services/quality-causes/quality-causes.service'
import { QualityCausesRoutingModule } from './quality-causes-routing.module';
import { ListQualityCauses } from './list/list.component';


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
import { NewQualityCause } from './new/new.component';
import { EditQualityCauses } from './edit/edit.component';
import { DetailQualityCauses } from './detail/detail.component';
import { QualityDefectRecordingService } from 'app/services/dto-services/quality-defect-recording/quality-defect-recording.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { QualityCodeGroupService } from 'app/services/dto-services/quality-code-group/quality-code-group.service';
import { QualityCodeGroupAutoCompleteModule } from 'app/views/auto-completes/quality-code-group-auto-complete/quality-code-group-autocomplete-module';
import { QualityNotificationAutoCompleteModule } from 'app/views/auto-completes/quality-notification-auto-complete/quality-notification-autocomplete-module';


@NgModule({
  declarations: [ListQualityCauses, NewQualityCause, EditQualityCauses, DetailQualityCauses],
  imports: [
    CommonModule,
    QualityCausesRoutingModule,
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
    QualityCodeGroupAutoCompleteModule,
    QualityNotificationAutoCompleteModule
  ],
  providers:[QualityCausesService, QualityDefectRecordingService]
})
export class QualityCausesModule { }
