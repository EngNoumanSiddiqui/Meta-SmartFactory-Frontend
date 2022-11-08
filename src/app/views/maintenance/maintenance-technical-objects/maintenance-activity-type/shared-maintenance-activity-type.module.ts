/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewMaintenanceActivityTypeComponent} from './new/new.component';
import {MaintenanceActivityTypeService} from '../../../../services/dto-services/maintenance-equipment/maintenance-activity-type.service';
import { MaintenanceActivityTypeDetailComponent } from './detail/detail.component';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [NewMaintenanceActivityTypeComponent, MaintenanceActivityTypeDetailComponent],
  exports: [NewMaintenanceActivityTypeComponent, MaintenanceActivityTypeDetailComponent],
  providers: [MaintenanceActivityTypeService]
})
export class SharedMaintenanceActivityTypeModule {
}
