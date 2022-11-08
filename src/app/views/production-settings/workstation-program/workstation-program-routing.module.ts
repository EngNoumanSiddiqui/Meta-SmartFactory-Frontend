import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
//components
import { WorkstationProgramListComponent } from './list/list.component';
import { WorkstationProgramNewComponent } from './new/new.component';
import { WorkstationProgramEditComponent } from './edit/edit.component';
import { WorkStationProgramDetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '', data: { title: 'WorkStation Programs'},
    children: [
     { path: '', component: WorkstationProgramListComponent, data: { title: 'workstation-program'} },
      { path: 'new', component: WorkstationProgramNewComponent, data: { title: 'new-workstation-program'} },
      { path: 'edit/:id', component: WorkstationProgramEditComponent, data: { title: 'edit-workstation-program'} },
      { path: 'detail/:id', component: WorkStationProgramDetailComponent, data: { title: 'workstation-program-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkStationRoutingModule {
}
