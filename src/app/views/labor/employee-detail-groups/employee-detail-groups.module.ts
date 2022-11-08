import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DropdownModule} from 'primeng/dropdown';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EmployeeDetailGroupsListComponent } from './list/list.component';


import { EmployeeDetailGroupsListRoutingModule } from './employee-detail-groups-routing.module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
@NgModule({
  declarations: [EmployeeDetailGroupsListComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    TreeModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    EmployeeDetailGroupsListRoutingModule,
    EmployeeAutoCompleteModule,
    DropdownModule
  ],
  providers: [EmployeeService],
  exports: [EmployeeDetailGroupsListComponent]
})
export class EmployeeDetailGroupsListModule { }
