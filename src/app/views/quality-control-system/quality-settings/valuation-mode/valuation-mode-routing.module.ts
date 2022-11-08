import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ListValuationMode} from './list/list.component'

const routes: Routes = [
  {path: '', data: {title: 'valuation-mode'},
  children: [
    {
      path: '', component: ListValuationMode, data: {title: 'valuation-mode'}
    }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValuationModeRoutingModule { }
