import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReworkDashboardComponent} from './rework-dashboard.component';

const routes: Routes = [
  {path: '', component: ReworkDashboardComponent, data: {title: 'rework-dashboard'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReworkDashboardRoutingModule {
}
