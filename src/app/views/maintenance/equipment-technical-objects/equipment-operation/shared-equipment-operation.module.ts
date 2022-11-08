/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewEquipmentOperationComponent} from './new/new.component';
import {EquipmentOperationService} from '../../../../services/dto-services/maintenance-equipment/equipment-operation.service';
import { EquipmentOperationDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [NewEquipmentOperationComponent, EquipmentOperationDetailComponent],
  exports: [NewEquipmentOperationComponent, EquipmentOperationDetailComponent],
  providers: [EquipmentOperationService]
})
export class SharedEquipmentOperationModule {
}
