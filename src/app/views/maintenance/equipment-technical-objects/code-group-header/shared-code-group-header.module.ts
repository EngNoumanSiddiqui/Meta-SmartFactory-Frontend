/**
 * Created by Hammad 5-1-2020.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';

import { CodeGroupHeaderDetailComponent } from './detail/detail.component';
import { EquipmentCodeGroupService } from 'app/services/dto-services/maintenance-equipment/code-group.service';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ConfirmDialogModule } from 'primeng';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
    ConfirmDialogModule
  ],
  declarations: [ CodeGroupHeaderDetailComponent],
  exports: [ CodeGroupHeaderDetailComponent],
  providers: [EquipmentCodeGroupService]
})
export class SharedEquipmentCodeGroupHeaderModule {}
