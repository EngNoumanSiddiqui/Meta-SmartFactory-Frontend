import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {MaintenanceRoutingModule} from './maintenance-routing.module';
import {ImageModule} from '../../image/image-module';
import {NewMaintenanceComponent} from './new/new.component';
import {EditMaintenanceComponent} from './edit/edit.component';
import {DetailMaintenanceComponent} from './detail/detail.component';
import {ListMaintenanceComponent} from './list/list.component';
import {MaintenanceService} from '../../../services/dto-services/maintenance/maintenance.service';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import {WorkstationTypeService} from '../../../services/dto-services/workstation-type/workstation-type.service';
import {EmployeeService} from '../../../services/dto-services/employee/employee.service';
@NgModule({
  imports: [

    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,

    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    MaintenanceRoutingModule,
    TooltipModule,
    ColorPickerModule,

    AutoCompleteModule,

  ],
  declarations: [

    // Maintenance
    NewMaintenanceComponent,
    EditMaintenanceComponent,
    DetailMaintenanceComponent,
    ListMaintenanceComponent,

  ],
  providers: [
    MaintenanceService,
    WorkstationService,
    WorkstationTypeService,
    EmployeeService,
  ]
})
export class MaintenanceModule {
}
