import {Injector, NgModule} from '@angular/core';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {FormsModule} from '@angular/forms';

import {DassSharedModule} from 'app/shared/dass-shared.module';
import {AutoCompleteModule, CheckboxModule, ConfirmDialogModule, RatingModule, SidebarModule, TooltipModule} from 'primeng';
import {ProgressBarModule} from 'primeng/progressbar';


import {AnalysisRoutingModule} from './analysis-routing.module';
import {StopDowntimeAnalysisComponent} from './stop-downtime-analysis/all/stop-downtime-analysis.component';
import {OeeAnalysisComponent} from './oee-analysis/oee-analysis.component';
import {EmployeeAnalysisComponent} from './employee-analysis/custom/employee-analysis.component';
import {TranslateService} from '@ngx-translate/core';
import {WorkstationService} from '../../services/dto-services/workstation/workstation.service';
import {CommonModule} from '@angular/common';
import {StopService} from '../../services/dto-services/stop/stop.service';
import {CustomStopDowntimeAnalysisComponent} from './stop-downtime-analysis/custom/custom-stop-downtime-analysis.component';
import {EmployeeService} from 'app/services/dto-services/employee/employee.service';
import {TableModule} from 'primeng/table';
import {OeeService} from '../../services/dto-services/oee/oee-service';
import {TeepService} from '../../services/dto-services/teep/teep-service';
import {JobOrderService} from '../../services/dto-services/job-order/job-order.service';
import {WorkStationAutoCompleteModule} from '../auto-completes/ws-auto-complete/workstation-autocomplete-module';
import {ConfirmationService} from 'primeng/api';
import {PowerConsumptionService} from '../../services/dto-services/power-consumption/power-consumption-service';
import {ProductQuantityAnlyzComponent} from './workstation-analysis/production-quantity/production-quantity.component';
import {LoadTimeAnlyzComponent} from './workstation-analysis/load-time/load-time.component';
import {TotalTimesComponent} from './workstation-analysis/total-times/total-times.component';
import {WorkOeeComponent} from './work-oee/work-oee.component';
import {AllEmployeeAnalysisComponent} from './employee-analysis/all/all-employee-analysis.component';
import {AllWorkstationPowerAnalysisComponent} from './power-consuption/all-workstation/all-ws-power-analysis.component';
import {JoborderPowerAnalysisComponent} from './power-consuption/job-orders/job-order-power-analysis.component';
import {WorkstationPowerAnalysisComponent} from './power-consuption/workstation/workstation-power-analysis.component';
import {WorkstationStatusComponent} from './workstation-status/workstation-status.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {ModalModule} from 'ngx-bootstrap/modal';
import {WorkstationReportComponent} from './workstation-analysis/workstation-report.component';
import {WorkstationReportChartComponent} from './workstation-analysis/workstation-report-chart/workstation-report-chart.component';
import {OeeReportChartComponent} from './oee-analysis/oee-report-chart/oee-report-chart.component';
import { NewEmployeeAnalysisComponent } from './employee-analysis/new/new-employee-analysis.component';
import {EmployeeAutoCompleteModule} from '../auto-completes/employee-auto-complete/employee-autocomplete-module';
import { MachineStatusDailyComponent } from './machine-status-daily/machine-status-daily.component';

import { OeeJobOrderAnalysisComponent } from './oo-job-order-analysis/oee-job-order-analysis.component';
import { TreeTableModule } from 'primeng/treetable'
import { WorkstationDashboardService } from 'app/services/dto-services/workstation/workstation-dashboard.service';
import { JobOrderSharedModule } from './job-order-report/joborder-report-shared.module';
import { WorkStationStatusGraphComponent } from './machine-status-daily/workstation-status-graph/workstation-status-graph.component';
import { MachineStateGraphComponent } from './machine-status-daily/machine-state-graph/machine-state-graph.component';
import { WorkCenterAnalysisComponent } from './workcenter-analysis/workcenter-analysis.component';
import { WorkCenterAutocompleteModule } from '../auto-completes/workcenter-auto-complete/workcenter-autocomplete-module';
import { MachineStatusItemComponent } from './workcenter-analysis/machine-state/machine-status-item.component';
import { StopStateGraphComponent } from './workcenter-analysis/stops/stop-state-graph.component';
import { QuantityStateGraphComponent } from './workcenter-analysis/quantity/quantity-state-graph.component';
import { WorkstationStatusItemChart } from './workcenter-analysis/machine-state/workstation-status-item.component';
import { StopStateListItemComponent } from './workcenter-analysis/stops/stop-state-list.component';
import { QuantityStateLineGraphComponent } from './workcenter-analysis/quantity/quantity-state-line-graph.component';
import { ProductionStatusItemComponent } from './workcenter-analysis/production/production-state-item.component';
import { ProductionStateGraphComponent } from './workcenter-analysis/production/production-state-graph.component';
import { OeeJobOrderAnalysisReportingComponent } from './oo-job-order-analysis-reporting/oee-job-order-analysis-reporting.component';
import {CapacityThroughputGraphComponent} from './workcenter-analysis/bottleneck/capacity-throughput-graph.component';
import {BottleneckStopStateListItemComponent} from './workcenter-analysis/bottleneck/bottleneck-stop-state-list.component';
import {BottleneckStopGraphComponent} from './workcenter-analysis/bottleneck/bottleneck-stop-graph.component';
import {BottleneckListComponent} from './workcenter-analysis/bottleneck/bottleneck-list.component';
import { KpiReportModule } from '../kpi-report/kpi-report.module';
import { SkillMatrixReportComponent } from './skill-matrix-report/skill-matrix-report.component';
import { EmployeeSkillMatrixComponent } from './skill-matrix-report/employee-skill-matrix/employee-skill-matrix.component';
import { WorkstationSkillMatrixComponent } from './skill-matrix-report/workstation-skill-matrix/workstation-skill-matrix.component';
import { SkillMatrixReportService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-report.service';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
import { PanelModule } from 'primeng/panel';
import {EmployeeAnalysisJobsComponent} from './employee-analysis/new/job-detail/emp-jobs.component';
import { ProductionOrderReportSharedModule } from './production-order-report/prod-order-report-shared.module';
import { ServiceLocator } from 'app/services/dto-services/job-order/service-location.service';
import { EmployeeGeneralGroupAutoCompleteModule } from '../auto-completes/employee-general-group-auto-complete/employee-general-autocomplete-module';
import { StopCauseAutoCompleteModule } from '../auto-completes/stop-cause-auto-complete/stop-cause-autocomplete-module';
import { StopListComponent } from '../manufacturing-planning-system/basic-manufacturing/stop-list/list/stop-list.component';
import { StopListModule } from '../manufacturing-planning-system/basic-manufacturing/stop-list/stop-list.module';
import { EmployeeAnalysisJobsModule } from './employee-analysis/new/job-detail/emp-jobs.module';

@NgModule({
  imports: [

    AnalysisRoutingModule,
    FormsModule,
    MessagesModule,
    ModalModule.forRoot(),
    MessageModule,
    DassSharedModule,
    ConfirmDialogModule,
    RatingModule,
    TooltipModule,
    CommonModule,
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
    WorkCenterAutocompleteModule,
    EmployeeAutoCompleteModule,
    TreeTableModule,
    JobOrderSharedModule,
    KpiReportModule,
    PanelModule,
    EmployeeGeneralGroupAutoCompleteModule,
    StopCauseAutoCompleteModule,
    ProductionOrderReportSharedModule,
    StopListModule,
    EmployeeAnalysisJobsModule
  ],
  declarations: [
    WorkstationStatusComponent,
    WorkstationReportComponent,
    WorkstationReportChartComponent,
    StopDowntimeAnalysisComponent,
    CustomStopDowntimeAnalysisComponent,
    MachineStatusDailyComponent,

    OeeAnalysisComponent,
    OeeReportChartComponent,
    EmployeeAnalysisComponent,


    ProductQuantityAnlyzComponent,
    LoadTimeAnlyzComponent,
    TotalTimesComponent,
    WorkOeeComponent,
    AllEmployeeAnalysisComponent,

    // power anly
    AllWorkstationPowerAnalysisComponent,
    WorkstationPowerAnalysisComponent,
    JoborderPowerAnalysisComponent,

    NewEmployeeAnalysisComponent,

    // OEE Job Order Analysis
    OeeJobOrderAnalysisComponent,
    OeeJobOrderAnalysisReportingComponent,
    WorkStationStatusGraphComponent,
    MachineStateGraphComponent,

    // workcenter analysis
    WorkCenterAnalysisComponent,
    MachineStatusItemComponent,
    StopStateGraphComponent,
    QuantityStateGraphComponent,
    WorkstationStatusItemChart,
    StopStateListItemComponent,
    CapacityThroughputGraphComponent,
    BottleneckStopGraphComponent,
    BottleneckStopStateListItemComponent,
    BottleneckListComponent,
    QuantityStateLineGraphComponent,
    ProductionStatusItemComponent,
    ProductionStateGraphComponent,
    SkillMatrixReportComponent,
    EmployeeSkillMatrixComponent,
    WorkstationSkillMatrixComponent


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
    WorkstationDashboardService,
    SkillMatrixReportService,
    ScheduleReportService,
    SkillMatrixSamplingValueService
  ]
})
export class AnalysisModule {
  constructor(private injector: Injector){    // Create global Service Injector.
    ServiceLocator.injector = this.injector;
  }
}
