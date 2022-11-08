import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {EmployeeGeneralGroupListComponent} from './list/list.component';

const route: Routes = [
  {
    path: '', data: {title: 'employee-general-group'},
    children: [
      {path: '', component: EmployeeGeneralGroupListComponent, data: {title: 'employee-general-group'}},
    ]
  }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(route)
  ],
  exports: [RouterModule]
})
export class GenericGroupRoutingModule {
}
