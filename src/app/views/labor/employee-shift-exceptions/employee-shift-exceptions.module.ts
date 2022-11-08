import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './new/new.component';
import { EditEmployeeShiftExceptionComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ListEmployeeShiftExceptionComponent } from './list/list.component';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { EmpShiftExceptionRoutingModule } from './emp-shift-exception-routing.module';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { ShiftDefinationComponent } from './new/shift-defination/shift-defination.component';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
@NgModule({
  declarations: [ListEmployeeShiftExceptionComponent, NewComponent, EditEmployeeShiftExceptionComponent, DetailComponent, ShiftDefinationComponent],
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
    EmployeeAutoCompleteModule,
    EmpShiftExceptionRoutingModule
  ],
  providers:[EmployeeGroupService]
})
export class EmployeeShiftExceptionsModule { }
