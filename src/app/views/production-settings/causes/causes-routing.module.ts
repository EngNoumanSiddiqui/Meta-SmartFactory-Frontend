import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewCauseComponent} from './new/new.component';
import {EditCauseComponent} from './edit/edit.component';
import {DetailCauseComponent} from './detail/detail.component';
import {ListCauseComponent} from './list/list.component';

const routes: Routes = [
  { path: '', data: {title: 'stop-causes'},
    children: [
      {path: 'new', component: NewCauseComponent, data: {title: 'new-stop-cause'}},
      {path: 'edit/:id', component: EditCauseComponent, data: {title: 'edit-stop-cause'}},
      {path: 'detail/:id', component: DetailCauseComponent, data: {title: 'stop-cause-detail'}},
      {path: '', component: ListCauseComponent,  data: {title: 'stop-causes'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CausesRoutingModule {}
