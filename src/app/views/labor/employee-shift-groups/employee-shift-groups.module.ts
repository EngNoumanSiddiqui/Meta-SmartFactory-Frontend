import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { EmployeeShiftGroupsRoutingModule } from './emp-shift-groups-routing.module';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
@NgModule({
  declarations: [ListComponent, NewComponent, EditComponent, DetailComponent],
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
    EmployeeShiftGroupsRoutingModule,
    EmployeeAutoCompleteModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [EmployeeGroupService]
})
export class EmployeeShiftGroupsModule { }
