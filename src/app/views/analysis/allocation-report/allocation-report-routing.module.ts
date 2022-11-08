import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AllocationReportComponent} from './allocation-report.component';

const routes: Routes = [
  {path: '', component: AllocationReportComponent, data: {title: 'allocation-report'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocationChartReportRoutingModule {
}
