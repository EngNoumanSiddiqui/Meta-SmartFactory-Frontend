import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MaintenanceSystemConditionAutoCompleteComponent} from './maintenance-system-condition-auto-complete.component';
import {SharedMaintenanceSystemConditionModule} from '../../maintenance/maintenance-technical-objects/maintenance-system-condition/shared-maintenance-system-condition.module';
import {MaintenanceSystemConditionService} from '../../../services/dto-services/maintenance-equipment/maintenance-system-condition.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceSystemConditionModule
  ],
  declarations: [
    MaintenanceSystemConditionAutoCompleteComponent,
  ],
  exports: [
    MaintenanceSystemConditionAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceSystemConditionService

  ]
})
export class MaintenanceSystemConditionAutoCompleteModule {
}
