import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewStaffComponent} from './new/new.component';
import {EditStaffComponent} from './edit/edit.component';
import {DetailStaffComponent} from './detail/detail.component';
import {ListStaffComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'personals'},
    children: [
      {path: 'new', component: NewStaffComponent, data: {title: 'new-personal'}},
      {path: 'edit/:id', component: EditStaffComponent, data: {title: 'edit-personal'}},
      {path: 'detail/:id', component: DetailStaffComponent, data: {title: 'personal-detail'}},
      {path: '', component: ListStaffComponent, data: {title: 'personals'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule {
}
