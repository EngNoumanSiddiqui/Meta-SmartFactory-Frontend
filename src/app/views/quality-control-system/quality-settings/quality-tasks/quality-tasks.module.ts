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
import {CalendarModule} from 'primeng/calendar';

import { QualityTasksRoutingModule } from './quality-tasks-routing.module';
import { QualityTastsService } from 'app/services/dto-services/quality-tasks/quality-tasts.service'

import { ListQualityTasks } from './list/list.component';
import { NewQualityTask } from './new/new.component';
import { EditQualityTask } from './edit/edit.component';
import { DetailQualityTask } from './detail/detail.component';
import { QualityCodeGroupService } from 'app/services/dto-services/quality-code-group/quality-code-group.service';
import { QualityDefectRecordingService } from 'app/services/dto-services/quality-defect-recording/quality-defect-recording.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { QualityCodeGroupAutoCompleteModule } from 'app/views/auto-completes/quality-code-group-auto-complete/quality-code-group-autocomplete-module';
import { QualityNotificationAutoCompleteModule } from 'app/views/auto-completes/quality-notification-auto-complete/quality-notification-autocomplete-module';


@NgModule({
  declarations: [ListQualityTasks, NewQualityTask, EditQualityTask, DetailQualityTask],
  imports: [
    CommonModule,
    QualityTasksRoutingModule,
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
  providers: [QualityTastsService , QualityDefectRecordingService]
})
export class QualityTasksModule { }
 