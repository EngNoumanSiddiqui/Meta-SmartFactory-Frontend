import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeComponent } from './list/list.component';

const routes:Routes=
[
  {path: '', data: {title: 'employee-groups'},
  children:
  [
    { path: '', component: ListEmployeeComponent, data:{ title: 'employee-groups'} },
  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class EmployeeGroupsRoutingModule { }
