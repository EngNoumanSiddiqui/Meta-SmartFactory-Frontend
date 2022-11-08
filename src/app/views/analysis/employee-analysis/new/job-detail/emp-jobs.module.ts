import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CheckboxModule, ConfirmDialogModule, ContextMenuModule, DialogModule, MenuModule, ProgressBarModule, ProgressSpinnerModule, SharedModule, TableModule, TabViewModule, TooltipModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { EmployeeAnalysisJobsRoutingModule } from './emp-jobs.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeAnalysisJobsComponent } from './emp-jobs.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {EmployeeService} from '../../../../../services/dto-services/employee/employee.service';


@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DassSharedModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    MenuModule,
    ModalModule.forRoot(),
    EmployeeAnalysisJobsRoutingModule,
    SharedModule,
    TabsModule,
    TabViewModule,
    TooltipModule,
    TableModule,
  ],
  exports: [EmployeeAnalysisJobsComponent],
  declarations: [EmployeeAnalysisJobsComponent],
  providers: [EmployeeService]
})
export class EmployeeAnalysisJobsModule { }
