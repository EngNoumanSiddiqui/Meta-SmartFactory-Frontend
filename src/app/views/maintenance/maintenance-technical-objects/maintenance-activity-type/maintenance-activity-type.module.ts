/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceActivityTypeModuleRoutes} from './maintenance-activity-type-routing.module';
import {SharedMaintenanceActivityTypeModule} from './shared-maintenance-activity-type.module';
import {MaintenanceActivityTypeListComponent} from './list/list.component';
import {MaintenanceActivityTypeService} from '../../../../services/dto-services/maintenance-equipment/maintenance-activity-type.service';
import {EditMaintenanceActivityTypeComponent} from './edit/edit.component';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    MaintenanceActivityTypeModuleRoutes,
    SharedMaintenanceActivityTypeModule
  ],
  declarations: [MaintenanceActivityTypeListComponent, EditMaintenanceActivityTypeComponent],
  providers: [MaintenanceActivityTypeService]
})
export class MaintenanceActivityTypeModule {
}
