/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TaskOperationServiceListComponent} from './list/list.component';
import {EditTaskOperationServiceComponent} from './edit/edit.component';
import {TaskOperationServiceDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {TaskOperationServiceService} from '../../../../services/dto-services/maintenance-equipment/task-operation-service.service';
import {ExternalServiceAutoCompleteModule} from '../../../auto-completes/external-service-auto-complete/external-service-autocomplete-module';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {NewTaskOperationServiceComponent} from './new/new.component';


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
    ExternalServiceAutoCompleteModule,
    UnitAutoCompleteModule
  ],
  declarations: [TaskOperationServiceListComponent, NewTaskOperationServiceComponent, EditTaskOperationServiceComponent, TaskOperationServiceDetailComponent],
  exports: [TaskOperationServiceListComponent],
  providers: [TaskOperationServiceService]
})
export class TaskOperationServiceModule {
}
