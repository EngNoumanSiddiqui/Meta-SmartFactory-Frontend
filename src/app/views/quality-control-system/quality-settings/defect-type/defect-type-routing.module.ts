import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListDefectType} from './list/list.component'

const routes: Routes = [
  {
    path: '', data: {title: 'defect-type'},
    children: [
      {
        path: '', component: ListDefectType, data:{title: 'defect-type'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectTypeRoutingModule { }
