/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {MaintenanceOrderTypeModuleRoutes} from './maintenance-order-type-routing.module';
import {SharedMaintenanceOrderTypeModule} from './shared-maintenance-order-type.module';
import {MaintenanceOrderTypeListComponent} from './list/list.component';
import {MaintenanceOrderTypeService} from '../../../../services/dto-services/maintenance-equipment/maintenance-order-type.service';
import {EditMaintenanceOrderTypeComponent} from './edit/edit.component';
import {MaintenanceOrderTypeDetailComponent} from './detail/detail.component';


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
    MaintenanceOrderTypeModuleRoutes,
    SharedMaintenanceOrderTypeModule
  ],
  declarations: [MaintenanceOrderTypeListComponent, EditMaintenanceOrderTypeComponent, MaintenanceOrderTypeDetailComponent],
  providers: [MaintenanceOrderTypeService]
})
export class MaintenanceOrderTypeModule {
}
