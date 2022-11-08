import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewWorkstationComponent} from './new/new.component';
import {EditWorkstationComponent} from './edit/edit.component';
import {DetailWorkstationComponent} from './detail/detail.component';
import {ListWorkstationComponent} from './list/list.component';


const routes: Routes = [
  {
    path: '', data: {title: 'workstations'},
    children: [
      { path: 'new', component: NewWorkstationComponent, data: { title: 'new-workstation'} },
      { path: 'edit/:id', component: EditWorkstationComponent, data: { title: 'edit-workstation'} },
      { path: 'detail/:id', component: DetailWorkstationComponent, data: { title: 'workstation-detail'} },
      { path: '', component: ListWorkstationComponent, data: { title: 'workstations'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkstationsRoutingModule {
}
