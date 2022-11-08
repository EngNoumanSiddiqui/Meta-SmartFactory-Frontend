import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUsageDecisionType } from './list/list.component';

const routes: Routes = [
  {
    path: '', data: { title: 'quality-usage-decision-type' },
    children: [
      {
        path: '', component: ListUsageDecisionType, data: { title: 'quality-usage-decision-type' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsageDecisionTypeRoutingModule { }
