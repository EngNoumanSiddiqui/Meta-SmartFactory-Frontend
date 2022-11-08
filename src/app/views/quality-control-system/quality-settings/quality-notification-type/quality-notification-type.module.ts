import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityNotificationTypeRoutingModule } from './quality-notification-type-routing.module';
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
import { ListQualityNotificationType } from './list/list.component'
import { NewQualityNotificationType } from './new/new.component';
import { EditQualityNotificationType } from './edit/edit.component';
import { DetailQualityNotificationType } from './detail/detail.component'
import { QualityNotificationTypeService } from 'app/services/dto-services/quality-notification-type/quality-notification-type.service'
@NgModule({
  declarations: [ListQualityNotificationType, NewQualityNotificationType, EditQualityNotificationType,DetailQualityNotificationType],
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
    QualityNotificationTypeRoutingModule
  ],
  providers: [QualityNotificationTypeService]
})
export class QualityNotificationTypeModule { }
