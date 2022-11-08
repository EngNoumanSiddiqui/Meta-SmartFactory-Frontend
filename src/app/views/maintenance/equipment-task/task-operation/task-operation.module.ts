/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TaskOperationListComponent} from './list/list.component';
import {EditTaskOperationComponent} from './edit/edit.component';
import {TaskOperationDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {NewTaskOperationComponent} from './new/new.component';
import {EquipmentOperationAutoCompleteModule} from '../../../auto-completes/equipment-operation-auto-complete/equipment-operation-autocomplete-module';
import {TaskOperationService} from '../../../../services/dto-services/maintenance-equipment/task-operation.service';
import {TaskOperationServiceModule} from '../task-operation-service/task-operation-service.module';
import {TaskOperationComponentModule} from '../task-operation-component/task-operation-component.module';


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
    EquipmentOperationAutoCompleteModule,
    UnitAutoCompleteModule,
    TaskOperationServiceModule,
    TaskOperationComponentModule
  ],
  declarations: [TaskOperationListComponent, NewTaskOperationComponent, EditTaskOperationComponent, TaskOperationDetailComponent],
  exports: [TaskOperationListComponent],
  providers: [TaskOperationService]
})
export class TaskOperationModule {
}
