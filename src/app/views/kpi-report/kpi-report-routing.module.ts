import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardKpiComponent } from './dashboard-kpi/dashboard.kpi.component';


const routes: Routes = [
  {
    path: 'analysis/advanced-report', data: { title: 'accounts' },
    children: [
      { path: 'dashboard-kpi', component: DashboardKpiComponent, data: { title: 'kpi-overview' } },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiReportRoutingModule { }
