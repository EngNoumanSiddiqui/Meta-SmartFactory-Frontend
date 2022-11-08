import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQualityControlKey } from './list/list.component'

const routes: Routes = [
  {
    path: '' , data: {title: 'quality-control-key'},
    children: [
      {
        path: '', component: ListQualityControlKey, data: {title: 'quality-control-key'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualiyControlKeyRoutingModule { }
