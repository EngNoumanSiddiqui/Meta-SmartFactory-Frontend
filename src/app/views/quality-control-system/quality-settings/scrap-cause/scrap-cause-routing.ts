import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ScrapCauseListComponent } from './list/list.component';
import { ScrapCauseNewComponent } from './new/new.component';
import { ScrapCauseEditComponent } from './edit/edit.component';
import { ScrapCauseDetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'Cause'},
    children: [
     { path: '', component: ScrapCauseListComponent, data: { title: 'scrap-cause'} },
      { path: 'new', component:ScrapCauseNewComponent, data: { title: 'new-scrap-cause'} },
      { path: 'edit/:id', component: ScrapCauseEditComponent, data: { title: 'edit-scrap-cause'} },
      { path: 'detail/:id', component: ScrapCauseDetailComponent, data: { title: 'scrap-cause-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrapCauseRoutingModule {
}
