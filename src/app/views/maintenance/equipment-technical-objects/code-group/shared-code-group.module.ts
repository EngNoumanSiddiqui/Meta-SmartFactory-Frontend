/**
 * Created by Hammad 5-1-2020.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { CodeGroupDetailComponent } from './detail/detail.component';
import { EquipmentCodeGroupService } from 'app/services/dto-services/maintenance-equipment/code-group.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule
  ],
  declarations: [ CodeGroupDetailComponent],
  exports: [ CodeGroupDetailComponent],
  providers: [EquipmentCodeGroupService]
})
export class SharedEquipmentCodeGroupModule {
}
