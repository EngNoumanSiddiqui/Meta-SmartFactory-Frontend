import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ScrapCauseListComponent } from './list/list.component';
import { ScrapCauseNewComponent } from './new/new.component';
import { ScrapCauseEditComponent } from './edit/edit.component';
import { ScrapCauseDetailReworkComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'Cause'},
    children: [
     { path: '', component: ScrapCauseListComponent, data: { title: 'rework-cause'} },
      { path: 'new', component:ScrapCauseNewComponent, data: { title: 'new-rework-cause'} },
      { path: 'edit/:id', component: ScrapCauseEditComponent, data: { title: 'edit-rework-cause'} },
      { path: 'detail/:id', component: ScrapCauseDetailReworkComponent, data: { title: 'scrap-rework-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrapCauseReworkRoutingModule {
}
