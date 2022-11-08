import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { EmployeeCapabilityService } from 'app/services/dto-services/employee/employee-capabilities.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { EmployeeCapabilityDetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [ EmployeeCapabilityDetailComponent ],
  exports: [ EmployeeCapabilityDetailComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
  ],
  providers: [ EmployeeCapabilityService, EmployeeService ]
})
export class SharedCapabilityModule { }
