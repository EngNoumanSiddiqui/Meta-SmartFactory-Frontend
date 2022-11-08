import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationalEmployeeRoutingModule } from './organizational-employee-routing.module';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import { SpinnerModule } from 'primeng/spinner';
import {ModalModule} from 'ngx-bootstrap/modal';

import { OrganizationalEmployeeService } from 'app/services/dto-services/organizational-employee/organizational-employee.service';
import { OrganizationalEmployeeListComponent } from './list/list.component';

@NgModule({
  declarations: [
    OrganizationalEmployeeListComponent
  ],
  imports: [
    CommonModule,
    OrganizationalEmployeeRoutingModule,
    OrganizationChartModule,
    DassSharedModule,
    FormsModule,
    SpinnerModule,
    ModalModule
  ],
  providers:[OrganizationalEmployeeService]
})
export class OrganizationalEmployeeModule { }
