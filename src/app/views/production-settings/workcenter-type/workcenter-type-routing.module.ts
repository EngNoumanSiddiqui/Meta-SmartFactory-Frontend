import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { WorkCenterTypeDetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '', data: {title: 'workcenter-types'},
    children: [
     { path: '', component: ListComponent, data: { title: 'workcenter-type'} },
      { path: 'new', component: NewComponent, data: { title: 'new-workcenter-type'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-workcenter-type'} },
      { path: 'detail/:id', component: WorkCenterTypeDetailComponent, data: { title: 'workcenter-type-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCenterTypeRoutingModule {
}
