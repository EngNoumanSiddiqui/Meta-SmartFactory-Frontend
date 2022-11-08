import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { WorkStationTypeDetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'WorkStation Types'},
    children: [
     { path: '', component: ListComponent, data: { title: 'workstation-type'} },
      { path: 'new', component: NewComponent, data: { title: 'new-workstation-type'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-workstation-type'} },
      { path: 'detail/:id', component: WorkStationTypeDetailComponent, data: { title: 'workstation-type-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkStationTypeRoutingModule {
}
