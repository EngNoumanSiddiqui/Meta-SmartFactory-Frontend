import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PurchaseQuotationListComponent } from './list/list.component';
import { PurchaseQuotationItemListComponent } from './purchase-quotation-items/list.component';


const routes: Routes = [
  {
    path: '', data: {title: 'purchase-quotations'},
    children: [
      {path: '', component: PurchaseQuotationListComponent, data: {title: 'purchase-quotations'}},
      {path: 'items', component: PurchaseQuotationItemListComponent, data: {title: 'purchase-quotation-items'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseQuotationRoutingModule {
}
