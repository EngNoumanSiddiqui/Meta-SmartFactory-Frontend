import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'organizations'},
    children: [
       { path: '', component: ListComponent, data: { title: 'organizations'} },
      { path: 'new', component:NewComponent, data: { title: 'new-organizations'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-organizations'} },
      { path: 'detail/:id', component: DetailComponent, data: { title: 'organizations-detail'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
