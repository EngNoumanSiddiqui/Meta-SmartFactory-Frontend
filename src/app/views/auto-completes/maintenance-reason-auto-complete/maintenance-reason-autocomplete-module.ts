import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedMaintenanceReasonModule} from '../../maintenance/maintenance-technical-objects/maintenance-reason/shared-maintenance-reason.module';
import {MaintenanceReasonAutoCompleteComponent} from './maintenance-reason-auto-complete.component';
import {MaintenanceReasonService} from '../../../services/dto-services/maintenance-equipment/maintenance-reason.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceReasonModule
  ],
  declarations: [
    MaintenanceReasonAutoCompleteComponent,
  ],
  exports: [
    MaintenanceReasonAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceReasonService

  ]
})
export class MaintenanceReasonAutoCompleteModule {
}
