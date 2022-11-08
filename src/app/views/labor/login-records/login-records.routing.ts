
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';

const routes:Routes=[
  {path: '', data: {title: 'login-records'},
  children:
  [
    { path: '', component: ListComponent, data:{ title: 'login-records'} },
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRecordsRoutingModule {
}
