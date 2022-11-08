import { PlantAutoCompleteModule } from './../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ColorPickerModule, ConfirmDialogModule, PickListModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../image/image-module';
import {NewStaffComponent} from './new/new.component';
import {EditStaffComponent} from './edit/edit.component';
import {ListStaffComponent} from './list/list.component';
import {StaffRoutingModule} from './staff-routing.module';
import {TreeModule} from 'primeng/tree';
import { ComparisonComponent } from './comparison/comparison.component';
import { EmployeeSkillService } from 'app/services/dto-services/employee/employee-skills.service';
import { EmployeeSkillsModule } from '../employee-skills/employee-skills.module';
import { EmployeeDetailGroupsListModule } from '../employee-detail-groups/employee-detail-groups.module';

@NgModule({
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
    StaffRoutingModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    PlantAutoCompleteModule,
    EmployeeSkillsModule,
    EmployeeDetailGroupsListModule
   
  ],
  declarations: [
    NewStaffComponent,
    EditStaffComponent,
    // DetailStaffComponent,
    ListStaffComponent,
    ComparisonComponent
  ],
  providers: [EmployeeSkillService]
})
export class StaffModule {
}
