import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SimulationReportComponent} from './simulation-report.component';

const routes: Routes = [
  {path: '', component: SimulationReportComponent, data: {title: 'simulation-report'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationChartReportRoutingModule {
}
