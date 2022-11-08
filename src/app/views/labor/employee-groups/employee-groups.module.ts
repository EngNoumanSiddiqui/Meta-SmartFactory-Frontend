import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListEmployeeComponent } from './list/list.component';
import { EmployeeGroupsRoutingModule } from './employee-groups-routing.module';
import { EmployeeGroupService } from 'app/services/dto-services/employee-group.service';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { NewComponent } from './new/new.component';
import { GroupDefinationComponent } from './details/group-defination/group-defination.component';
import { EditGroupDefinationComponent } from './edit-components/edit-group-defination/edit-group-defination.component';

@NgModule({
  declarations: [ListEmployeeComponent, NewComponent,EditGroupDefinationComponent,GroupDefinationComponent],
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
    EmployeeGroupsRoutingModule
  ],
  providers:[EmployeeGroupService]
})
export class EmployeeGroupsModule { }
