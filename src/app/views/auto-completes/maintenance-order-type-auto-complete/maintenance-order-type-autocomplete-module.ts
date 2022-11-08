import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedMaintenanceOrderTypeModule} from '../../maintenance/maintenance-technical-objects/maintenance-order-type/shared-maintenance-order-type.module';
import {MaintenanceOrderTypeService} from '../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';
import {MaintenanceOrderTypeAutoCompleteComponent} from './maintenance-order-type-auto-complete.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceOrderTypeModule
  ],
  declarations: [
    MaintenanceOrderTypeAutoCompleteComponent,
  ],
  exports: [
    MaintenanceOrderTypeAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceOrderTypeService

  ]
})
export class MaintenanceOrderTypeAutoCompleteModule {
}
