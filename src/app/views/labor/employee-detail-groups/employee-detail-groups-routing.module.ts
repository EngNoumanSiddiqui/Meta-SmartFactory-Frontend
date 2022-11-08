import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDetailGroupsListComponent } from './list/list.component';
import { EmployeeDetailGroupsNewComponent } from './new/new.component';

const routes: Routes = [
  {path: '', data: {title: 'employee-detail-groups'},
  children:
  [
    // { path: '', component: EmployeeDetailGroupsListComponent, data: { title: 'employee-detail-groups-list'} }

  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmployeeDetailGroupsListRoutingModule { }
