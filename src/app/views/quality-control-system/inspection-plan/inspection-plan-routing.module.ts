import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInspectionPlan } from './list/list.component';

const routes: Routes = [
  { path: '', data: { title: 'inspection-plan' },
    children: [
      { path: '', component: ListInspectionPlan, data: {title: 'inspection-plan'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionPlanRoutingModule {}
