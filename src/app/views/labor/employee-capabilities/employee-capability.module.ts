import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCapabilityComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DropdownModule} from 'primeng/dropdown';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { CapabilityRoutingModule } from './employee-capability-routing.module';
import { EmployeeCategoryAutoCompleteModule } from 'app/views/auto-completes/employee-category-auto-complete/employee-category-autocomplete-module';
import { SharedCapabilityModule } from './shared-employee-capability.module';
@NgModule({
  declarations: [ListCapabilityComponent, NewComponent, EditComponent],
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
    CapabilityRoutingModule,
    DropdownModule,
    EmployeeCategoryAutoCompleteModule,
    SharedCapabilityModule
  ],
  providers: [EmployeeCapabilityService, EmployeeService]
})
export class CapabilityModule { }
