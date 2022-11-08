/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceReasonModuleRoutes} from './maintenance-reason-routing.module';
import {SharedMaintenanceReasonModule} from './shared-maintenance-reason.module';
import {MaintenanceReasonListComponent} from './list/list.component';
import {MaintenanceReasonService} from '../../../../services/dto-services/maintenance-equipment/maintenance-reason.service';
import {EditMaintenanceReasonComponent} from './edit/edit.component';
import {MaintenanceReasonDetailComponent} from './detail/detail.component';


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
    MaintenanceReasonModuleRoutes,
    SharedMaintenanceReasonModule
  ],
  declarations: [MaintenanceReasonListComponent, EditMaintenanceReasonComponent],
  providers: [MaintenanceReasonService]
})
export class MaintenanceReasonModule {
}
