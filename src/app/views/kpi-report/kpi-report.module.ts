import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { DassSharedModule } from 'app/shared/dass-shared.module';
import { DashboardKpiComponent } from './dashboard-kpi/dashboard.kpi.component';
import { KpiReportRoutingModule } from './kpi-report-routing.module';

@NgModule({
  imports: [
    DassSharedModule,
    KpiReportRoutingModule
  ],
  providers: [],
  declarations: [DashboardKpiComponent],
  exports: [DashboardKpiComponent],
})

export class KpiReportModule {
}
