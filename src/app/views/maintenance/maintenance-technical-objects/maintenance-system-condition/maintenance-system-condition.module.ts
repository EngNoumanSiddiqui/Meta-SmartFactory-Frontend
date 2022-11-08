/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceSystemConditionModuleRoutes} from './maintenance-system-condition-routing.module';
import {SharedMaintenanceSystemConditionModule} from './shared-maintenance-system-condition.module';
import {MaintenanceSystemConditionListComponent} from './list/list.component';
import {MaintenanceSystemConditionService} from '../../../../services/dto-services/maintenance-equipment/maintenance-system-condition.service';
import {EditMaintenanceSystemConditionComponent} from './edit/edit.component';
import {MaintenanceSystemConditionDetailComponent} from './detail/detail.component';


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
    MaintenanceSystemConditionModuleRoutes,
    SharedMaintenanceSystemConditionModule
  ],
  declarations: [MaintenanceSystemConditionListComponent, EditMaintenanceSystemConditionComponent],
  providers: [MaintenanceSystemConditionService]
})
export class MaintenanceSystemConditionModule {
}
