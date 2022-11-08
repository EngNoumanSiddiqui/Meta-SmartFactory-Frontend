import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListJobOrderComponent} from '../job-order/list/list.component';
import {JobOrderPlanningComponent} from './planning/planing.component';
import {ProductionListComponent} from './production/list/list.component';
import { JobOrderFollowComponent } from './follow/follow.component';
import { AdminGuard } from 'app/guards/admin.guard';

const routes: Routes = [
  {
    path: '', data: {title: 'job-order-management'},
    children: [
      {path: 'job-order-planning', component: JobOrderPlanningComponent, data: {title: 'job-order-planning'}},
      {path: 'job-order-list', component: ListJobOrderComponent, data: {title: 'job-order-list'}},
      {path: 'prod-list', component: ProductionListComponent, data: {title: 'prod-order-list'}},
      {path: 'job-order-follow', component: JobOrderFollowComponent, data: {title: 'job-order-follow'}},
      {path: 'manual', loadChildren: () => import('../manual-job-order/manual-job-order.module')
      .then(m => m.ManualJobOrderModule), canActivate: [AdminGuard]},
      {path: 'stop', loadChildren: () => import('../stop-list/stop-list.module')
      .then(m => m.StopListModule), canActivate: [AdminGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobOrderRoutingModule {
}
