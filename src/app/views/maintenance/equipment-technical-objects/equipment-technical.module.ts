/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EquipmentTechnicalModuleRoutes} from './equipment-technical-routing.module';
import {DassSharedModule} from '../../../shared/dass-shared.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    EquipmentTechnicalModuleRoutes,

  ],
  declarations: [],
  providers: []
})
export class EquipmentTechnicalModule {
}
