/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {OrderOperationListComponent} from './list/list.component';
import {EditOrderOperationComponent} from './edit/edit.component';
import {OrderOperationDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {NewOrderOperationComponent} from './new/new.component';
import {EquipmentOperationAutoCompleteModule} from '../../../auto-completes/equipment-operation-auto-complete/equipment-operation-autocomplete-module';
import {OrderOperationService} from '../../../../services/dto-services/maintenance-equipment/order-operation.service';
import {EquipmentAutoCompleteModule} from '../../../auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import {WorkStationAutoCompleteModule} from '../../../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {MaintenanceOrderTypeAutoCompleteModule} from '../../../auto-completes/maintenance-order-type-auto-complete/maintenance-order-type-autocomplete-module';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {MaintenanceActivityTypeAutoCompleteModule} from '../../../auto-completes/maintenance-activity-type-auto-complete/maintenance-activity-type-autocomplete-module';
import {OrderExternalServiceModule} from '../order-external-service/order-external-service.module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';


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
    EquipmentAutoCompleteModule,
    UnitAutoCompleteModule,
    WorkStationAutoCompleteModule,
    MaintenanceOrderTypeAutoCompleteModule,
    MaintenanceActivityTypeAutoCompleteModule,
    PlantAutoCompleteModule,
    EmployeeAutoCompleteModule,
    OrderExternalServiceModule,
  ],
  declarations: [OrderOperationListComponent, NewOrderOperationComponent, EditOrderOperationComponent, OrderOperationDetailComponent],
  exports: [OrderOperationListComponent],
  providers: [OrderOperationService]
})
export class OrderOperationModule {
}
