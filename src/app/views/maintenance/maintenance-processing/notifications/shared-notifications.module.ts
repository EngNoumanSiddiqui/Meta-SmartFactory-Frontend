import {NgModule} from '@angular/core';
import {NotificationListComponent} from './notification-list/notification-list.component';
import {NotificationNewComponent} from './notification-new/notification-new.component';
import {NotificationEditComponent} from './notification-edit/notification-edit.component';
import {NotificationDetailComponent} from './notification-detail/notification-detail.component';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {NotificationsService} from '../../../../services/dto-services/maintenance/notifications.service';
import {NotificationTypesService} from '../../../../services/dto-services/maintenance/notification-types.service';
import {FunctionalLocationService} from '../../../../services/dto-services/maintenance-equipment/functional-location.service';
import {EquipmentService} from '../../../../services/dto-services/equipment/equipment.service';
import {WorkstationService} from '../../../../services/dto-services/workstation/workstation.service';
import {EquipmentPlannerGroupService} from '../../../../services/dto-services/maintenance-equipment/planner-group.service';
import {EquipmentAbcIndicatorService} from '../../../../services/dto-services/maintenance-equipment/abc-indicator.service';
import {MaintenanceNotificationTypeAutoCompleteModule} from '../../../auto-completes/maintenance-notification-type-auto-complete/maintenance-notification-type-autocomplete-module';
import {PlannerGroupAutoCompleteModule} from '../../../auto-completes/planner-group-auto-complete/planner-group-autocomplete-module';
import {EquipmentAutoCompleteModule} from '../../../auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import {ChooseNotificationListComponent} from '../../../choose-panes/choose-notification-pane/list.component';
import { MaintenanceNewOrderComponent } from './maintenance-order/new.component';
import { MaintenanceOrderTypeAutoCompleteModule } from 'app/views/auto-completes/maintenance-order-type-auto-complete/maintenance-order-type-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { MaintenanceSystemConditionAutoCompleteModule } from 'app/views/auto-completes/maintenance-system-condition-auto-complete/maintenance-system-condition-autocomplete-module';
import { MaintenanceCategoryAutoCompleteModule } from 'app/views/auto-completes/maintenance-category-auto-complete/maintenance-category-autocomplete-module';
import { MaintenanceActivityTypeAutoCompleteModule } from 'app/views/auto-completes/maintenance-activity-type-auto-complete/maintenance-activity-type-autocomplete-module';
import { MaintenanceReasonAutoCompleteModule } from 'app/views/auto-completes/maintenance-reason-auto-complete/maintenance-reason-autocomplete-module';
import { SharedFunctionalLocationModule } from '../../equipment-technical-objects/functional-location/shared-functional-location-module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { MaintenanceOrderService } from 'app/services/dto-services/maintenance-equipment/maintenance-order.service';
import { EquipmentCodeGroupHeaderService } from 'app/services/dto-services/maintenance-equipment/code-group-header.service';
import { UsersService } from 'app/services/users/users.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { OrderOperationModule } from '../../maintenance-order/order-operation/order-operation.module';
import { MaintenanceOrderComponentModule } from '../../maintenance-order/maintenance-order-component/maintenance-order-component.module';

const COMPONENT = [
  NotificationListComponent,
  NotificationNewComponent,
  NotificationEditComponent,
  NotificationDetailComponent,
  ChooseNotificationListComponent,
  MaintenanceNewOrderComponent
];

@NgModule({
  declarations: [...COMPONENT],
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    MaintenanceNotificationTypeAutoCompleteModule,
    MaintenanceOrderTypeAutoCompleteModule,
    PlannerGroupAutoCompleteModule,
    EquipmentAutoCompleteModule,
    WorkStationAutoCompleteModule,
    PlantAutoCompleteModule,
    MaintenanceSystemConditionAutoCompleteModule,
    MaintenanceCategoryAutoCompleteModule,
    MaintenanceActivityTypeAutoCompleteModule,
    MaintenanceReasonAutoCompleteModule,
    EmployeeAutoCompleteModule,
    SharedFunctionalLocationModule,
    OrderOperationModule,
    MaintenanceOrderComponentModule

  ],
  exports: [
    ...COMPONENT
  ],
  providers: [NotificationsService, NotificationTypesService,
    EquipmentCodeGroupHeaderService, UsersService, EmployeeService,
    MaintenanceOrderService, FunctionalLocationService, EquipmentService, WorkstationService,
    EquipmentPlannerGroupService, EquipmentAbcIndicatorService]
})
export class SharedNotificationsModule {
}
