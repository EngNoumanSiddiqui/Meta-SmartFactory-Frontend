import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListQualitySystems } from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'quality-systems'},
    children: [
      {
        path: '', component: ListQualitySystems, data: {title: 'quality-systems'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualitySystemsRoutingModule { }
