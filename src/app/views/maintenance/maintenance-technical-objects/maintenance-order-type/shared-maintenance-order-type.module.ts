/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewMaintenanceOrderTypeComponent} from './new/new.component';
import {MaintenanceOrderTypeService} from '../../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [NewMaintenanceOrderTypeComponent],
  exports: [NewMaintenanceOrderTypeComponent],
  providers: [MaintenanceOrderTypeService]
})
export class SharedMaintenanceOrderTypeModule {
}
