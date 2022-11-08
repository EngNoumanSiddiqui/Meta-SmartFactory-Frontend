import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewRoleComponent} from './new/new.component';
import {EditRoleComponent} from './edit/edit.component';
import {ListRoleComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'roles'},
    children: [
      { path: 'new', component: NewRoleComponent, data: { title: 'new-role'} },
      { path: 'edit/:id', component: EditRoleComponent, data: { title: 'edit-role'} },
      { path: '', component: ListRoleComponent, data: { title: 'roles'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule {
}
