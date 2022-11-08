import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeShift } from './list/list.component';
const routes:Routes=[
  {path: '', data: {title: 'employee-shifts'},
  children:
  [
    { path: '', component: ListEmployeeShift, data:{ title: 'employee-shifts'} },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class EmpShiftRoutingModule { }
