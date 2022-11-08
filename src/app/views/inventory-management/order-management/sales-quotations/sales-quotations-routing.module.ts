import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListSalesQuotationsComponent} from './list/list.component';
import {ListSalesItemsQuotationsComponent} from './order-detail-items/list.component';


const routes: Routes = [
  { path: '', data: { title: 'sales' },
    children: [
      {path: '', redirectTo: 'base', pathMatch: 'full'},
      // { path: 'new',    component: NewSaleQuotationsComponent,    data: { title: 'new-sales-order' } },
      // { path: 'edit/:id',   component: EditSaleQuotationsComponent,   data: { title: 'edit-sales-order'} },
      // { path: 'detail/:id', component: DetailSaleQuotationsComponent, data: { title: 'sales-order-detail' } },
      { path: 'items', component: ListSalesItemsQuotationsComponent, data: { title: 'sales-quotations-items' } },
      { path: 'base',   component: ListSalesQuotationsComponent,  data: { title: 'sales-quotations'} }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesQuotationsRoutingModule {}
