/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MaintenanceTechnicalModuleRoutes} from './maintenance-technical-routing.module';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../shared/dass-shared.module';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    MaintenanceTechnicalModuleRoutes,

  ],
  declarations: [
  ],
  providers: []
})
export class MaintenanceTechnicalModule {
}
