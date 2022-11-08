import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedMaintenanceNotificationTypeModule} from '../../maintenance/maintenance-technical-objects/maintenance-notification-type/shared-maintenance-notification-type.module';
import {MaintenanceNotificationTypeAutoCompleteComponent} from './maintenance-notification-type-auto-complete.component';
import {MaintenanceNotificationTypeService} from '../../../services/dto-services/maintenance-equipment/maintenance-notification-type.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceNotificationTypeModule
  ],
  declarations: [
    MaintenanceNotificationTypeAutoCompleteComponent,
  ],
  exports: [
    MaintenanceNotificationTypeAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceNotificationTypeService

  ]
})
export class MaintenanceNotificationTypeAutoCompleteModule {
}
