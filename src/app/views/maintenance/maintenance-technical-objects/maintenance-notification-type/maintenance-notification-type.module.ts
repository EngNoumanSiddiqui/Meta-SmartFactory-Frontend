/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceNotificationTypeModuleRoutes} from './maintenance-notification-type-routing.module';
import {SharedMaintenanceNotificationTypeModule} from './shared-maintenance-notification-type.module';
import {MaintenanceNotificationTypeListComponent} from './list/list.component';
import {MaintenanceNotificationTypeService} from '../../../../services/dto-services/maintenance-equipment/maintenance-notification-type.service';
import {EditMaintenanceNotificationTypeComponent} from './edit/edit.component';


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
    MaintenanceNotificationTypeModuleRoutes,
    SharedMaintenanceNotificationTypeModule
  ],
  declarations: [MaintenanceNotificationTypeListComponent, EditMaintenanceNotificationTypeComponent],
  providers: [MaintenanceNotificationTypeService]
})
export class MaintenanceNotificationTypeModule {
}
