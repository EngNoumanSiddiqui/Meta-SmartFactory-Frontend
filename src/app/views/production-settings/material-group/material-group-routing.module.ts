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
     { path: '', component: ListComponent, data: { title: 'material-group'} },
      { path: 'new', component:NewComponent, data: { title: 'new-material-group'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-material-group'} },
      { path: 'detail/:id', component: DetailComponent, data: { title: 'material-detail-group'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialGroupRoutingModule {
}
