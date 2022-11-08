import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewWorkcenterComponent} from './new/new.component';
import {EditWorkcenterComponent} from './edit/edit.component';
import {DetailWorkcenterComponent} from './detail/detail.component';
import {ListWorkcenterComponent} from './list/list.component';


const routes: Routes = [
  {
    path: '', data: {title: 'workcenters'},
    children: [
      { path: 'new', component: NewWorkcenterComponent, data: { title: 'new-workcenter'} },
      { path: 'edit/:id', component: EditWorkcenterComponent, data: { title: 'edit-workcenter'} },
      { path: 'detail/:id', component: DetailWorkcenterComponent, data: { title: 'workcenter-detail'} },
      { path: '', component: ListWorkcenterComponent, data: { title: 'workcenters'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkcenterRoutingModule {
}
