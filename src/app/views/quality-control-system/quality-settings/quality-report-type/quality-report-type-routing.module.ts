import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListQualityReportTypes} from './list/list.component'

const routes: Routes = [
  {
    path: '', data: {title : 'quality-report-type'},
    children: [
      {
        path: '', component: ListQualityReportTypes, data: {title: 'quality-report-type'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityReportTypeRoutingModule { }
