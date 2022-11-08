import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeSkillsListComponent } from './list/list.component';

const routes: Routes = [
  {path: '', data: {title: 'employee-skills'},
  children:
  [
    { path: '', component: EmployeeSkillsListComponent, data: { title: 'employee-skills'} },
  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployeeSkillsRoutingModule { }
