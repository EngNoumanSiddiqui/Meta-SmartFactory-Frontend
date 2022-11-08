import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
const routes:Routes=[
  {path: '', data: {title: 'employee-shift-groups'},
  children:
  [
    { path: '', component: ListComponent, data:{ title: 'employee-shift-groups'} },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class EmployeeShiftGroupsRoutingModule { }
