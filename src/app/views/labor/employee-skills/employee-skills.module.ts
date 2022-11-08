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
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { EmployeeSkillsListComponent } from './list/list.component';
import { EmployeeSkillsNewComponent } from './new/new.component';
import { EmployeeSkillsDetailComponent } from './detail/detail.component';
import { EmployeeSkillsEditComponent } from './edit/edit.component';
import { EmployeeSkillsRoutingModule } from './employee-skills-routing.module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';
@NgModule({
  declarations: [EmployeeSkillsListComponent, EmployeeSkillsNewComponent, EmployeeSkillsDetailComponent, EmployeeSkillsEditComponent],
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
    EmployeeSkillsRoutingModule,
    EmployeeAutoCompleteModule,
    DropdownModule
  ],
  providers: [ EmployeeCapabilityService , EmployeeService, EmployeeSkillService],
  exports: [EmployeeSkillsListComponent, EmployeeSkillsNewComponent, EmployeeSkillsDetailComponent, EmployeeSkillsEditComponent]
})
export class EmployeeSkillsModule { }
