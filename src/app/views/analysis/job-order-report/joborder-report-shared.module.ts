import {NgModule} from '@angular/core';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {FormsModule} from '@angular/forms';

import {DassSharedModule} from 'app/shared/dass-shared.module';
import {AutoCompleteModule, CheckboxModule, ConfirmDialogModule, RatingModule, SidebarModule, TooltipModule, ConfirmationService} from 'primeng';
import {ProgressBarModule} from 'primeng/progressbar';

import { TreeTableModule } from 'primeng/treetable'
import { WorkstationDashboardService } from 'app/services/dto-services/workstation/workstation-dashboard.service';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TableModule } from 'primeng/table';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';
import { EmployeeAutoCompleteModule } from 'app/views/auto-completes/employee-auto-complete/employee-autocomplete-module';

//services
import { TranslateService } from '@ngx-translate/core';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { StopService } from 'app/services/dto-services/stop/stop.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { OeeService } from 'app/services/dto-services/oee/oee-service';
import { TeepService } from 'app/services/dto-services/teep/teep-service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { PowerConsumptionService } from 'app/services/dto-services/power-consumption/power-consumption-service';

//components
import { JobOrderReportComponent } from './joborder-report.component';
import { JObReportChartComponent } from './job-report-chart/job-report-chart.component';
import { MachineStatusTemplateComponent } from './machine-status-template/machine-status-template.component';
import { StopTemplateComponent } from '../stop-downtime-analysis/stop-template.component';
import { JobOrderAutoCompleteModule } from 'app/views/auto-completes/job-order-auto-complete/job-order-autocomplete.module';
import { JobOrderProcessReportComponent } from './job-order-process-report/joborder-process-report.component';

import { EmployeeAnalysisJobsModule } from '../employee-analysis/new/job-detail/emp-jobs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessagesModule,
    ModalModule.forRoot(),
    MessageModule,
    DassSharedModule,
    ConfirmDialogModule,
    RatingModule,
    TooltipModule,
    ProgressBarModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      'backgroundPadding': 0,
      'radius': 79,
      'space': -13,
      'unitsFontSize': '11',
      'outerStrokeGradient': true,
      'outerStrokeWidth': 13,
      'outerStrokeColor': '#4882c2',
      'outerStrokeGradientStopColor': '#53a9ff',
      'innerStrokeColor': '#e7e8ea',
      'innerStrokeWidth': 13,
      'title': '',
      'titleFontSize': '30',
      'subtitleFontSize': '60',
      'animateTitle': false,
      'animationDuration': 500,
      'showTitle': false,
      'showUnits': false,
      'showBackground': false,
      'clockwise': false,
      'responsive': true,
      'startFromZero': false,
      'titleColor': '#d6d6d6',
      'subtitleColor': '#d6d6d6',
    }),
    SidebarModule,
    AutoCompleteModule,
    TableModule,
    CheckboxModule,
    WorkStationAutoCompleteModule,
    EmployeeAutoCompleteModule,
    TreeTableModule,
    JobOrderAutoCompleteModule,
    EmployeeAnalysisJobsModule
  ],
  declarations: [
    JobOrderReportComponent,
    JobOrderProcessReportComponent,
    JObReportChartComponent,
    MachineStatusTemplateComponent,
    StopTemplateComponent

  ],
  exports: [
      JobOrderReportComponent,
      JobOrderProcessReportComponent,
      JObReportChartComponent,
      MachineStatusTemplateComponent,
      StopTemplateComponent

  ],
  providers: [
    TranslateService,
    WorkstationService,
    StopService,
    EmployeeService,
    OeeService,
    TeepService,
    JobOrderService,
    ConfirmationService,
    PowerConsumptionService,
    WorkstationDashboardService
  ]
})
export class JobOrderSharedModule {
}
