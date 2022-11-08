/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewMaintenanceNotificationTypeComponent} from './new/new.component';
import {MaintenanceNotificationTypeService} from '../../../../services/dto-services/maintenance-equipment/maintenance-notification-type.service';
import { MaintenanceNotificationTypeDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [NewMaintenanceNotificationTypeComponent, MaintenanceNotificationTypeDetailComponent],
  exports: [NewMaintenanceNotificationTypeComponent, MaintenanceNotificationTypeDetailComponent],
  providers: [MaintenanceNotificationTypeService]
})
export class SharedMaintenanceNotificationTypeModule {
}
