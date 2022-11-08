import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewCustomerComponent} from './new/new.component';
import {EditCustomerComponent} from './edit/edit.component';
import {DetailCustomerComponent} from './detail/detail.component';
import {AccountTransactionsComponent} from './account-transactions/account-transactions.component';
import { ListCustomerComponent } from './list/list.component';

const routes: Routes = [
  { path: '', data: { title: 'accounts' },
    children: [
      { path: 'new', component: NewCustomerComponent, data: {title: 'new-account'}},
      { path: 'edit/:id', component: EditCustomerComponent, data: {title: 'edit-account'}},
      { path: 'detail/:id', component: DetailCustomerComponent, data: {title: 'account-detail'}},
      { path: 'customerTransactions/:id', component: AccountTransactionsComponent, data: {title: 'customer-transactions'}},
      { path: '', component: ListCustomerComponent, data: {title: 'account-list'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {}
