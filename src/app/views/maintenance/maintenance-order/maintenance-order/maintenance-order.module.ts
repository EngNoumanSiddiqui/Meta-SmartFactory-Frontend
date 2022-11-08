/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceOrderListComponent} from './list/list.component';
import {EditMaintenanceOrderComponent} from './edit/edit.component';
import {NewMaintenanceOrderComponent} from './new/new.component';
import {EquipmentAutoCompleteModule} from '../../../auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {SharedFunctionalLocationModule} from '../../equipment-technical-objects/functional-location/shared-functional-location-module';
import {WorkStationAutoCompleteModule} from '../../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {PlannerGroupAutoCompleteModule} from '../../../auto-completes/planner-group-auto-complete/planner-group-autocomplete-module';
import {MaintenanceSystemConditionAutoCompleteModule} from '../../../auto-completes/maintenance-system-condition-auto-complete/maintenance-system-condition-autocomplete-module';
import { MaintenanceOrderModuleRoutes} from './maintenance-order-routing.module';
import {OrderOperationModule} from '../order-operation/order-operation.module';
import {MaintenanceOrderComponentModule} from '../maintenance-order-component/maintenance-order-component.module';
import {EmployeeAutoCompleteModule} from '../../../auto-completes/employee-auto-complete/employee-autocomplete-module';
import {MaintenanceCategoryAutoCompleteModule} from '../../../auto-completes/maintenance-category-auto-complete/maintenance-category-autocomplete-module';
import {MaintenanceActivityTypeAutoCompleteModule} from '../../../auto-completes/maintenance-activity-type-auto-complete/maintenance-activity-type-autocomplete-module';
import {MaintenanceOrderTypeAutoCompleteModule} from '../../../auto-completes/maintenance-order-type-auto-complete/maintenance-order-type-autocomplete-module';
import {MaintenanceReasonAutoCompleteModule} from '../../../auto-completes/maintenance-reason-auto-complete/maintenance-reason-autocomplete-module';
import {MaintenanceOrderService} from '../../../../services/dto-services/maintenance-equipment/maintenance-order.service';
import {SharedNotificationsModule} from '../../maintenance-processing/notifications/shared-notifications.module';
import { MaintenanceSharedModule } from '../../maintenance-shared.module';
import { JobOrderGanttViewComponent } from 'app/views/analysis/allocation-report/job-order-gantt-view/job-order-gantt-view.component';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';
import { MySchedulerModule } from 'app/components/scheduler/scheduler.module';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    MaintenanceOrderModuleRoutes,
    TooltipModule,
    KeyFilterModule,
    EquipmentAutoCompleteModule,
    PlantAutoCompleteModule,
    SharedFunctionalLocationModule,
    WorkStationAutoCompleteModule,
    PlannerGroupAutoCompleteModule,
    MaintenanceSystemConditionAutoCompleteModule,
    OrderOperationModule,
    MaintenanceOrderComponentModule,
    EmployeeAutoCompleteModule,
    MaintenanceCategoryAutoCompleteModule,
    MaintenanceActivityTypeAutoCompleteModule,
    MaintenanceOrderTypeAutoCompleteModule,
    MaintenanceReasonAutoCompleteModule,
    SharedNotificationsModule,
    MaintenanceSharedModule,
    MySchedulerModule
  ],
  declarations: [MaintenanceOrderListComponent, NewMaintenanceOrderComponent, EditMaintenanceOrderComponent],
  providers: [MaintenanceOrderService, ScheduleReportService ]
})
export class MaintenanceOrderModule {
}
