/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MaintenanceOrderComponentListComponent} from './list/list.component';
import {EditMaintenanceOrderComponentComponent} from './edit/edit.component';
import {MaintenanceOrderComponentDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceOrderComponentService} from '../../../../services/dto-services/maintenance-equipment/maintenance-order-component.service';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {NewMaintenanceOrderComponentComponent} from './new/new.component';
import {BatchAutoCompleteModule} from '../../../auto-completes/batch-auto-complete/batch-autocomplete-module';
import { ProductionOrderMaterialService } from 'app/services/dto-services/production-order/production-order-material.service';
import { SharedMaterialModule } from 'app/views/inventory-management/warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';


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
    SharedMaterialModule,
    UnitAutoCompleteModule,
    BatchAutoCompleteModule
  ],
  declarations: [MaintenanceOrderComponentListComponent, NewMaintenanceOrderComponentComponent, EditMaintenanceOrderComponentComponent, MaintenanceOrderComponentDetailComponent],
  exports: [MaintenanceOrderComponentListComponent],
  providers: [MaintenanceOrderComponentService, ProductionOrderMaterialService]
})
export class MaintenanceOrderComponentModule {
}
