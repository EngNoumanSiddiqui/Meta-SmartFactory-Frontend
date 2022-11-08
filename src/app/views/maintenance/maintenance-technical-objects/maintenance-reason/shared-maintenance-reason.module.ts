/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewMaintenanceReasonComponent} from './new/new.component';
import {MaintenanceReasonService} from '../../../../services/dto-services/maintenance-equipment/maintenance-reason.service';
import { MaintenanceReasonDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [
    NewMaintenanceReasonComponent,
    MaintenanceReasonDetailComponent
  ],
  exports: [
    NewMaintenanceReasonComponent,
    MaintenanceReasonDetailComponent
  ],
  providers: [MaintenanceReasonService]
})
export class SharedMaintenanceReasonModule {
}
