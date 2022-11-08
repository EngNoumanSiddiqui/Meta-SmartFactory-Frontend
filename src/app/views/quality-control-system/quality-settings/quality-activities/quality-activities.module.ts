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
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { ListQualityActivity } from './list/list.component'
import { QualityActivityRoutingModule } from './quality-activity-routing.module';
import { NewQualityActivity } from './new/new.component';
import { EditQualityActivity } from './edit/edit.component';
import { DetailQualityActivity } from './detail/detail.component';
import { QualityActivityService } from 'app/services/dto-services/quality-activity/quality-activity.service';
import { QualityDefectRecordingService } from 'app/services/dto-services/quality-defect-recording/quality-defect-recording.service';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service';
import { QualityCodeGroupService } from 'app/services/dto-services/quality-code-group/quality-code-group.service';
import { QualityCodeGroupAutoCompleteModule } from 'app/views/auto-completes/quality-code-group-auto-complete/quality-code-group-autocomplete-module';
import { QualityNotificationAutoCompleteModule } from 'app/views/auto-completes/quality-notification-auto-complete/quality-notification-autocomplete-module';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [ListQualityActivity, NewQualityActivity, EditQualityActivity,DetailQualityActivity],
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
    QualityActivityRoutingModule,
    QualityCodeGroupAutoCompleteModule,
    QualityNotificationAutoCompleteModule
  ],
  providers: [QualityActivityService, QualityDefectRecordingService]
})
export class QualityActivitiesModule { }
