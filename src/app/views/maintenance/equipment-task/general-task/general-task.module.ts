/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EquipmentTaskListComponent} from './list/list.component';
import {EquipmentTaskService} from '../../../../services/dto-services/maintenance-equipment/equipment-task.service';
import {EditEquipmentTaskComponent} from './edit/edit.component';
import {EquipmentTaskDetailComponent} from './detail/detail.component';
import {NewEquipmentTaskComponent} from './new/new.component';
import {EquipmentAutoCompleteModule} from '../../../auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {SharedFunctionalLocationModule} from '../../equipment-technical-objects/functional-location/shared-functional-location-module';
import {WorkStationAutoCompleteModule} from '../../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {PlannerGroupAutoCompleteModule} from '../../../auto-completes/planner-group-auto-complete/planner-group-autocomplete-module';
import {MaintenanceSystemConditionAutoCompleteModule} from '../../../auto-completes/maintenance-system-condition-auto-complete/maintenance-system-condition-autocomplete-module';
import {MaintenanceStrategyAutoCompleteModule} from '../../../auto-completes/maintenance-strategy-auto-complete/maintenance-strategy-autocomplete-module';
import {TaskOperationModule} from '../task-operation/task-operation.module';
import {GeneralTaskModuleRoutes} from './general-task-routing.module';
import { EquipmenttaskOperationStrCycleService } from 'app/services/dto-services/equipment/equipment-operation-strategy-cycle.service';
import { ChooseEquipmentTaskPaneComponent } from 'app/views/choose-panes/choose-equipment-task-pane/list.component';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    EquipmentAutoCompleteModule,
    PlantAutoCompleteModule,
    SharedFunctionalLocationModule,
    WorkStationAutoCompleteModule,
    PlannerGroupAutoCompleteModule,
    MaintenanceSystemConditionAutoCompleteModule,
    MaintenanceStrategyAutoCompleteModule,
    GeneralTaskModuleRoutes,
    TaskOperationModule
  ],
  declarations: [ EquipmentTaskListComponent, NewEquipmentTaskComponent,
    ChooseEquipmentTaskPaneComponent,
    EditEquipmentTaskComponent, EquipmentTaskDetailComponent],
  exports: [NewEquipmentTaskComponent,
    ChooseEquipmentTaskPaneComponent,
    EditEquipmentTaskComponent, EquipmentTaskDetailComponent],
  providers: [EquipmentTaskService, EquipmenttaskOperationStrCycleService]
})
export class GeneralTaskModule {
}
