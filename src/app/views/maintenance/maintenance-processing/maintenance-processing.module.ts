/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaintenanceProcessingModuleRoutes} from './maintenance-processing-routing.module';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../shared/dass-shared.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    MaintenanceProcessingModuleRoutes
  ],
  declarations: [],
  providers: []
})
export class MaintenanceProcessingModule {
}
