import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ReworkListComponent } from './list/list.component';
import { ScrapNewComponent } from './new/new.component';
import { ScrapEditComponent } from './edit/edit.component';
import { ScrapDetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '', data: {title: 'plants'},
    children: [
     { path: '', component: ReworkListComponent, data: { title: 'rework'} },
      { path: 'new', component:ScrapNewComponent, data: { title: 'new-rework'} },
      { path: 'edit/:id', component: ScrapEditComponent, data: { title: 'edit-rework'} },
      { path: 'detail/:id', component: ScrapDetailComponent, data: { title: 'rework-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReworkRoutingModule {
}
