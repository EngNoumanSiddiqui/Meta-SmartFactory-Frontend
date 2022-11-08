import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'stop-cause-type'},
    children: [
     { path: '', component: ListComponent, data: { title: 'stop-cause-type'} },
      { path: 'new', component:NewComponent, data: { title: 'new-stop-cause-type'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-stop-cause-type'} },
      { path: 'detail/:id', component: DetailComponent, data: { title: 'stop-cause-type-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StopCauseRoutingModule {
}
