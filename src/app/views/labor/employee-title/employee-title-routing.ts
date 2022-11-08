
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';

const routes:Routes=[
  {path: '', data: {title: 'employee-title'},
  children:
  [
    { path: '', component: ListComponent, data:{ title: 'employee-title'} },
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTitleRoutingModule {
}
