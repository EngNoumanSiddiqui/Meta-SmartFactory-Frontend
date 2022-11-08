import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { SimulationReportComponent } from './simulation-report.component';
import { SimulationChartReportRoutingModule } from './simulation-report-routing.module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { WorkCenterAutocompleteModule } from 'app/views/auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SimulationJobOrderGanttViewComponent } from './job-order-gantt-view/simulation-job-order-gantt-view.component';
import { MySchedulerModule } from 'app/components/scheduler/scheduler.module';

@NgModule({
  declarations: [
    SimulationReportComponent, 
    SimulationJobOrderGanttViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    DassSharedModule,
    MySchedulerModule,
    SimulationChartReportRoutingModule,
    WorkStationAutoCompleteModule,
    WorkCenterAutocompleteModule
  ]
})
export class SimulationReportModule {
}
