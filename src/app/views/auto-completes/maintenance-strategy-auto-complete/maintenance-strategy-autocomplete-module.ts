import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedMaintenanceStrategyModule} from '../../maintenance/maintenance-technical-objects/maintenance-strategy/shared-maintenance-strategy.module';
import {MaintenanceStrategyAutoCompleteComponent} from './maintenance-strategy-auto-complete.component';
import {MaintenanceStrategyService} from '../../../services/dto-services/maintenance-equipment/maintenance-strategy.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedMaintenanceStrategyModule
  ],
  declarations: [
    MaintenanceStrategyAutoCompleteComponent,
  ],
  exports: [
    MaintenanceStrategyAutoCompleteComponent,
  ]
  ,
  providers: [MaintenanceStrategyService

  ]
})
export class MaintenanceStrategyAutoCompleteModule {
}
