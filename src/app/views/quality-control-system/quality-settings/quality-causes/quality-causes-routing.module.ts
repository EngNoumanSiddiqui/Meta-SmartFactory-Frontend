import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListQualityCauses} from './list/list.component'

const routes: Routes = [
  {
    path: '', data: {title : 'quality-cause-type'},
    children: [
      {
        path: '', component: ListQualityCauses, data: {title: 'quality-cause-type'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityCausesRoutingModule { }
