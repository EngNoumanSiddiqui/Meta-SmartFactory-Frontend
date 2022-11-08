import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListInspectionOperations } from './list/list.component'

const routes: Routes = [
  {
    path: '', data:{ title: 'inspection-operation'},
    children: [
      {
        path: '', component: ListInspectionOperations, data: { title: 'inspection-operation'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionOperationRoutingModule { }
 