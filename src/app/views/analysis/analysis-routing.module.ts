import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StopDowntimeAnalysisComponent } from './stop-downtime-analysis/all/stop-downtime-analysis.component';
import { EmployeeAnalysisComponent } from './employee-analysis/custom/employee-analysis.component';
import { CustomStopDowntimeAnalysisComponent } from './stop-downtime-analysis/custom/custom-stop-downtime-analysis.component';
import { OeeAnalysisComponent } from './oee-analysis/oee-analysis.component';
import { AllEmployeeAnalysisComponent } from './employee-analysis/all/all-employee-analysis.component';
import { JoborderPowerAnalysisComponent } from './power-consuption/job-orders/job-order-power-analysis.component';
import { WorkstationPowerAnalysisComponent } from './power-consuption/workstation/workstation-power-analysis.component';
import { AllWorkstationPowerAnalysisComponent } from './power-consuption/all-workstation/all-ws-power-analysis.component';
import { WorkstationStatusComponent } from './workstation-status/workstation-status.component';
import { JobOrderReportComponent } from './job-order-report/joborder-report.component';
import { WorkstationReportComponent } from './workstation-analysis/workstation-report.component';
import { WorkOeeComponent } from './work-oee/work-oee.component';
import { NewEmployeeAnalysisComponent } from './employee-analysis/new/new-employee-analysis.component';
//OEE Job Order Analysis
import { OeeJobOrderAnalysisComponent } from './oo-job-order-analysis/oee-job-order-analysis.component';
import { MachineStatusDailyComponent } from './machine-status-daily/machine-status-daily.component';
import { WorkCenterAnalysisComponent } from './workcenter-analysis/workcenter-analysis.component';
import { OeeJobOrderAnalysisReportingComponent } from './oo-job-order-analysis-reporting/oee-job-order-analysis-reporting.component';
import { DashboardKpiComponent } from '../kpi-report/dashboard-kpi/dashboard.kpi.component';
import { SkillMatrixReportComponent } from './skill-matrix-report/skill-matrix-report.component';
import { ProductionOrderReportComponent } from './production-order-report/prod-order-report.component';
import { JobOrderProcessReportComponent } from './job-order-report/job-order-process-report/joborder-process-report.component';


const routes: Routes = [


  {
    path: 'basic-report',
    children: [
      { path: 'job-order-operation-report', component: JobOrderReportComponent, data: { title: 'job-order-operation-report' } },
      { path: 'machine-status', component: WorkstationStatusComponent, data: { title: 'machine-status-analysis' } },
      { path: 'workstation', component: WorkstationReportComponent, data: { title: 'workstation-analysis' } },
      {
        path: 'stop-analysis',
        children: [
          { path: 'stop-down-times', component: StopDowntimeAnalysisComponent, data: { title: 'stop-down-times' } },
          { path: 'custom-stop-down-times', component: CustomStopDowntimeAnalysisComponent, data: { title: 'stop-causes-report' } }
        ]
      },
      { path: 'oee-workstaion-analysis', component: OeeAnalysisComponent, data: { title: 'oee-analysis' } },
      {
        path: 'employee-analysis',
        children: [
          { path: 'all', component: AllEmployeeAnalysisComponent, data: { title: 'all-employee-analysis' } },
          { path: 'custom', component: EmployeeAnalysisComponent, data: { title: 'custom-employee-analysis' } },
        ]
      },
      { path: 'ergonomy-analysis-report', component: SkillMatrixReportComponent, data: { title: 'ergonomy-analysis-report' } },
      { path: 'scrap-dashboard', loadChildren: () => import('../scrap-dashboard/scrap-dashboard.module').then(m => m.ScrapDashboardModule) },
      { path: 'rework-dashboard', loadChildren: () => import('./rework-dashboard/rework-dashboard.module').then(m => m.ReworkDashboardModule) },
      {
        path: 'power-consumption',
        children: [
          { path: 'joborder', component: JoborderPowerAnalysisComponent, data: { title: 'job-order-power-consumption' } },
          { path: 'workstation', component: WorkstationPowerAnalysisComponent, data: { title: 'workstation-job-order-power-consumption' } },
          { path: 'all', component: AllWorkstationPowerAnalysisComponent, data: { title: 'all-workstation-power-consumption' } }
        ]

      },
    ]
  },

  {
    path: 'advanced-report',
    children: [
      { path: 'dashboard-kpi', component: DashboardKpiComponent, data: { title: 'kpi-overview' } },
      { path: 'production-order-report', component: ProductionOrderReportComponent, data: { title: 'production-order-report' }},
      { path: 'machine-status-daily', component: MachineStatusDailyComponent, data: { title: 'machine-status-daily-analysis' } },
      { path: 'workcenter-analysis', component: WorkCenterAnalysisComponent, data: { title: 'workcenter-analysis' } },
      { path: 'oee-job-order', component: OeeJobOrderAnalysisComponent, data: { title: 'oee-job-order-analysis' } },
      { path: 'oee-job-order-reporting', component: OeeJobOrderAnalysisReportingComponent, data: { title: 'oee-job-order-analysis-reporting' } },
      { path: 'allocation-report', loadChildren: () => import('./allocation-report/allocation-report.module').then(m => m.AllocationChartReportModule) },
      { path: 'simulation-report', loadChildren: () => import('./simulation-report/simulation-report.module').then(m => m.SimulationReportModule) },
      { path: 'employee-efficiency', component: NewEmployeeAnalysisComponent, data: { title: 'employee-efficiency' } },
      { path: 'job-order-process-report', component: JobOrderProcessReportComponent, data: { title: 'job-order-process-report' } },
    ]
  },

  { path: 'work-oee', component: WorkOeeComponent, data: { title: 'work-oee-reports' } },
  // {path: 'job-order', component: JobOrderReportComponent, data: {title: 'production-order-reports'}},
  // {path: 'workstation', component: WorkstationReportComponent, data: {title: 'workstation-analysis'}},
  // {path: 'machine-status', component: WorkstationStatusComponent, data: {title: 'machine-status-analysis'}},
  // {path: 'machine-status-daily', component: MachineStatusDailyComponent, data: {title: 'machine-status-daily-analysis'}},
  // { path: 'workcenter-analysis', component: WorkCenterAnalysisComponent, data: { title: 'workcenter-analysis' } },
  // { path: 'scrap', loadChildren: () => import('../scrap-dashboard/scrap-dashboard.module').then(m => m.ScrapDashboardModule)},
  // {
  //   path: 'stop-downtime',
  //   children: [
  //     {path: 'all', component: StopDowntimeAnalysisComponent, data: {title: 'stop-down-times'}},
  //     {path: 'custom', component: CustomStopDowntimeAnalysisComponent, data: {title: 'custom-stop-down-times'}}
  //   ]
  // },
  // {path: 'oee-job-order', component: OeeJobOrderAnalysisComponent, data: { title: 'oee-job-order-analysis' }},
  // { path: 'oee-job-order-reporting', component: OeeJobOrderAnalysisReportingComponent, data: { title: 'oee-job-order-analysis-reporting' }},
  // {
  //   path: 'employee',
  //   children: [
  //     {path: 'all', component: AllEmployeeAnalysisComponent, data: {title: 'all-employee-analysis'}},
  //     {path: 'custom', component: EmployeeAnalysisComponent, data: {title: 'custom-employee-analysis'}},
  //     {path: 'new', component: NewEmployeeAnalysisComponent, data: {title: 'employee-efficiency'}}
  //   ]
  // },
  // {
  //   path: 'power-consumption',
  //   children: [
  //     {path: 'joborder', component: JoborderPowerAnalysisComponent, data: {title: 'job-order-power-consumption'}},
  //     {path: 'workstation', component: WorkstationPowerAnalysisComponent, data: {title: 'workstation-job-order-power-consumption'}},
  //     {path: 'all', component: AllWorkstationPowerAnalysisComponent, data: {title: 'all-workstation-power-consumption'}}
  //   ]

  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule {
}
