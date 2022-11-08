import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'industry'},
    children: [
     { path: '', component: ListComponent, data: { title: 'industry'} },
      { path: 'new', component:NewComponent, data: { title: 'new-industry'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-industry'} },
      { path: 'detail/:id', component: DetailComponent, data: { title: 'industry-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustryRoutingModule {
}
