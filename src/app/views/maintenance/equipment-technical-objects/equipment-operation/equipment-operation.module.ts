/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EquipmentOperationModuleRoutes} from './equipment-operation-routing.module';
import {SharedEquipmentOperationModule} from './shared-equipment-operation.module';
import {EquipmentOperationListComponent} from './list/list.component';
import {EquipmentOperationService} from '../../../../services/dto-services/maintenance-equipment/equipment-operation.service';
import {EditEquipmentOperationComponent} from './edit/edit.component';


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
    EquipmentOperationModuleRoutes,
    SharedEquipmentOperationModule
  ],
  declarations: [EquipmentOperationListComponent, EditEquipmentOperationComponent],
  providers: [EquipmentOperationService]
})
export class EquipmentOperationModule {
}
