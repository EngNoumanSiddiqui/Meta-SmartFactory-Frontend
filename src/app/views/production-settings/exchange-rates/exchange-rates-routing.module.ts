import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'exchange-rates'},
    children: [
     { path: '', component: ListComponent, data: { title: 'exchange-rates'} }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRateRoutingModule {
}
