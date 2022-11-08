import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AllocationReportComponent } from './allocation-report.component';
import { AllocationChartReportRoutingModule } from './allocation-report-routing.module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JobOrderGanttViewComponent } from './job-order-gantt-view/job-order-gantt-view.component';
import { MySchedulerModule } from 'app/components/scheduler/scheduler.module';

@NgModule({
  declarations: [
    AllocationReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    DassSharedModule,
    MySchedulerModule,
    AllocationChartReportRoutingModule,
    WorkStationAutoCompleteModule,
    WorkCenterAutocompleteModule
  ]
})
export class AllocationChartReportModule {
}
