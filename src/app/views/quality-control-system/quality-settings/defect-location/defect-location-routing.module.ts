import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListDefectLocations} from './list/list.component'

const routes: Routes = [
  {
    path: '', data: {title : 'defect-location'},
    children: [
      {
        path: '', component: ListDefectLocations, data: {title: 'defect-location'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefectLocationRoutingModule { }
