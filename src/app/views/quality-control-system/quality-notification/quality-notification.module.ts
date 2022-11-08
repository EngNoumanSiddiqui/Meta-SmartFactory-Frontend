import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityNotificationService } from 'app/services/dto-services/quality-notification/quality-notification.service'
import {ItemService} from 'app/services/dto-services/quality-notification/item/item.service'
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import {BatchAutoCompleteModule} from '../../auto-completes/batch-auto-complete/batch-autocomplete-module';
import { CausesService } from 'app/services/dto-services/quality-notification/item/causes/causes.service';
import { ItemsService } from 'app/services/dto-services/quality-notification/item/tasks/items.service';
import {ActivitiesService} from 'app/services/dto-services/quality-notification/item/activities/activities.service'
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {UnitAutoCompleteModule} from '../../auto-completes/unit-auto-complete/unit-autocomplete-module';

import {
  RatingModule,
  SidebarModule,
  TooltipModule,
  TreeTableModule,
  ConfirmDialogModule
} from 'primeng';

import { QualityNotificationRoutingModule } from './quality-notification-routing.module';
import { ListQualityNotification } from './list/list.component';
import { NewQualityNotification } from './new/new.component';
import { DetailProcessing } from './processing/detail/detail.component';
// import { DetailItem } from './item/detail/detail.component';
import { EditQualityNotification } from './edit/edit.component';
import { DetailQualityNotification} from './detail/detail.component';
import { NewProcessing } from './processing/new/new.component';
import { EditProcessingComponent } from './processing/edit/edit.component';
import { NewItem } from './item/new/new.component';
import { DetailItem } from './item/detail/detail.component';
import { ListItem } from './item/list/list.component';
import { EditItem } from './item/edit/edit.component';
import { ListCauses } from './item/causes/list/list.component';
import { NewCauses } from './item/causes/new/new.component';
import { EditCauses } from './item/causes/edit/edit.component';
import { ListTasks } from './item/item-tasks/list/list.component';
import { NewTasks } from './item/item-tasks/new/new.component';
import { EditTask } from './item/item-tasks/edit/edit.component';
import { ListItemActivities } from './item/item-activities/list/list.component';
import { NewActivity } from './item/item-activities/new/new.component';
import { EditActivity } from './item/item-activities/edit/edit.component'
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { QualityInspectionLotAutoCompleteModule } from 'app/views/auto-completes/quality-inspection-lot-auto-complete/quality-inspection-lot-autocomplete-module';
import { ActAutoCompleteModule } from 'app/views/auto-completes/act-auto-complete/act-autocomplete-module';
import { OrderDetailAutocompleteModule } from 'app/views/auto-completes/order-detail-auto-complete/order-detail-autocomplete-module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
import { QualityNotificationProcessingService } from 'app/services/dto-services/quality-notification/processing/quality-notification-processing.service';
import { QualityDefectTypeAutoCompleteModule } from 'app/views/auto-completes/quality-defect-type-auto-complete/quality-defect-type-autocomplete-module';
import { QualityDefectLocationAutoCompleteModule } from 'app/views/auto-completes/quality-defect-location-auto-complete/quality-defect-location-autocomplete-module';
import { QualityNotificationTypeAutoCompleteModule } from 'app/views/auto-completes/quality-notification-type-auto-complete/quality-notification-type-autocomplete-module';

@NgModule({
  declarations: [ListQualityNotification, NewQualityNotification, DetailProcessing,
     EditQualityNotification, DetailQualityNotification, NewProcessing, EditProcessingComponent,
      NewItem, DetailItem, ListItem,EditItem, ListCauses, NewCauses, EditCauses, ListTasks,
     NewTasks, EditTask, ListItemActivities, NewActivity, EditActivity],
  imports: [
    CommonModule,
    QualityNotificationRoutingModule,
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
    CalendarModule,
    PlantAutoCompleteModule,
    BatchAutoCompleteModule,
    UnitAutoCompleteModule,
    StockAutoCompleteModule,
    QualityInspectionLotAutoCompleteModule,
    ActAutoCompleteModule,
    OrderDetailAutocompleteModule,
    EmployeeAutoCompleteModule,
    QualityDefectTypeAutoCompleteModule,
    QualityDefectLocationAutoCompleteModule,
    QualityNotificationTypeAutoCompleteModule
  ],
  exports: [NewQualityNotification],
  providers: [QualityNotificationService, QualityNotificationProcessingService,
    ItemService,CausesService,ItemsService,ActivitiesService]
})
export class QualityNotificationModule { }
