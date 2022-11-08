import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {OrganizationalEmployeeListComponent} from './list/list.component';

const route: Routes = [
  {
    path: '', data: { title: 'organizational-employee'},
    children: [
      {path: '', component: OrganizationalEmployeeListComponent, data: {title: 'organizational-employee'}},
    ]
  }];

@NgModule({
  declarations: [],
  imports: [
    CommonModule, RouterModule.forChild(route)
  ],
  exports: [RouterModule]
})
export class OrganizationalEmployeeRoutingModule {
}
