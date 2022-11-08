

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NotificationsRoutingModule} from './notifications-routing.module';
import {FormsModule} from '@angular/forms';
import {SharedNotificationsModule} from './shared-notifications.module';
import {EquipmentCodeGroupHeaderService} from '../../../../services/dto-services/maintenance-equipment/code-group-header.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DassSharedModule,
    NotificationsRoutingModule,
    FormsModule,
    SharedNotificationsModule

  ],
  providers: [EquipmentCodeGroupHeaderService]
})
export class NotificationsModule { }
