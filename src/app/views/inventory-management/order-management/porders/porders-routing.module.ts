import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewPorderComponent} from './new/new.component';
import {ListPorderComponent} from './list/list.component';
import {ListPorderDetailComponent} from './porder-items/list.component';


const routes: Routes = [
  {
    path: '', data: {title: 'purchase-orders'},
    children: [
      {path: '', redirectTo: 'base', pathMatch: 'full'},
      {path: 'new', component: NewPorderComponent, data: {title: 'new-porder'}},
      {path: 'base/items', component: ListPorderDetailComponent, data: {title: 'purchase-orders-items'}},
      {path: 'base', component: ListPorderComponent, data: {title: 'purchase-orders'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PordersRoutingModule {
}
