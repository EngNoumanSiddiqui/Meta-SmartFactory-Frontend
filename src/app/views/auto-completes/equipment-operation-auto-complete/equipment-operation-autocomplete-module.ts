import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedEquipmentOperationModule} from '../../maintenance/equipment-technical-objects/equipment-operation/shared-equipment-operation.module';
import {EquipmentOperationAutoCompleteComponent} from './equipment-operation-auto-complete.component';
import {EquipmentOperationService} from '../../../services/dto-services/maintenance-equipment/equipment-operation.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedEquipmentOperationModule
  ],
  declarations: [
    EquipmentOperationAutoCompleteComponent,
  ],
  exports: [
    EquipmentOperationAutoCompleteComponent,
  ]
  ,
  providers: [EquipmentOperationService

  ]
})
export class EquipmentOperationAutoCompleteModule {
}
