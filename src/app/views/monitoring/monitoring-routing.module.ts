import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListMonitoringComponent} from './list/list.component';


const routes: Routes = [
      { path: '', component: ListMonitoringComponent, data: { title: 'factory-monitoring' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringRoutingModule {}
