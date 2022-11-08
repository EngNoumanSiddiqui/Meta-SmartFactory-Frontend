/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {EquipmentTaskModuleRoutes} from './equipment-task-routing.module';
import {DassSharedModule} from '../../../shared/dass-shared.module';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    EquipmentTaskModuleRoutes,

  ],
  declarations: [],
  providers: []
})
export class EquipmentTaskModule {
}
