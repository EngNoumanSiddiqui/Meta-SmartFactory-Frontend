import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedMaintenanceActivityTypeModule} from '../../maintenance/maintenance-technical-objects/maintenance-activity-type/shared-maintenance-activity-type.module';
import {MaintenanceActivityTypeAutoCompleteComponent} from './maintenance-activity-type-auto-complete.component';
import {MaintenanceActivityTypeService} from '../../../services/dto-services/maintenance-equipment/maintenance-activity-type.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceActivityTypeModule
  ],
  declarations: [
    MaintenanceActivityTypeAutoCompleteComponent,
  ],
  exports: [
    MaintenanceActivityTypeAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceActivityTypeService

  ]
})
export class MaintenanceActivityTypeAutoCompleteModule {
}
