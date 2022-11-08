/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TaskOperationComponentListComponent} from './list/list.component';
import {EditTaskOperationComponentComponent} from './edit/edit.component';
import {TaskOperationComponentDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {TaskOperationComponentService} from '../../../../services/dto-services/maintenance-equipment/task-operation-component.service';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {NewTaskOperationComponentComponent} from './new/new.component';
import {StockAutoCompleteModule} from '../../../auto-completes/stock-auto-complete/stock-autocomplete-module';
import {BatchAutoCompleteModule} from '../../../auto-completes/batch-auto-complete/batch-autocomplete-module';


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
    StockAutoCompleteModule,
    UnitAutoCompleteModule,
    BatchAutoCompleteModule
  ],
  declarations: [TaskOperationComponentListComponent, NewTaskOperationComponentComponent, EditTaskOperationComponentComponent, TaskOperationComponentDetailComponent],
  exports: [TaskOperationComponentListComponent],
  providers: [TaskOperationComponentService]
})
export class TaskOperationComponentModule {
}
