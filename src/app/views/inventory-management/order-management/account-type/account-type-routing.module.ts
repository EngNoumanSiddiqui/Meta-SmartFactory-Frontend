import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AccountTypeDetailComponent } from './detail/detail.component';
import { AccountListComponent } from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'industry'},
    children: [
     { path: '', component: AccountListComponent, data: { title: 'account-types'} },
      { path: 'detail/:id', component: AccountTypeDetailComponent, data: { title: 'account-type-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountTypeRoutingModule {
}
