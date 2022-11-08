/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewMaintenanceSystemConditionComponent} from './new/new.component';
import {MaintenanceSystemConditionService} from '../../../../services/dto-services/maintenance-equipment/maintenance-system-condition.service';
import { MaintenanceSystemConditionDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [
    NewMaintenanceSystemConditionComponent,
    MaintenanceSystemConditionDetailComponent
  ],
  exports: [
    NewMaintenanceSystemConditionComponent,
    MaintenanceSystemConditionDetailComponent
  ],
  providers: [MaintenanceSystemConditionService]
})
export class SharedMaintenanceSystemConditionModule {
}
