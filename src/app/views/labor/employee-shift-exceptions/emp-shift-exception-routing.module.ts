import { NgModule } from '@angular/core';
//import { ListEmployeeShiftExceptionComponent } from './list/list.component';
import { Routes, RouterModule } from '@angular/router';
import { ListEmployeeShiftExceptionComponent } from './list/list.component';
const routes:Routes=[
  {path: '', data: {title: 'employee-shift-exception'},
  children:
  [
    { path: '', component: ListEmployeeShiftExceptionComponent, data:{ title: 'employee-shift-exception'} },
  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class EmpShiftExceptionRoutingModule { }
