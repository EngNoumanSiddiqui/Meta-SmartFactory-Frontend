import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQualityActivity } from './list/list.component'

const routes: Routes = [
  { path: '', data: { title: 'quality-activity-type' },
  children: [
    {path: '', component: ListQualityActivity, data: {title: 'quality-activity-type'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityActivityRoutingModule { }
