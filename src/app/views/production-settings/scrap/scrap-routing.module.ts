import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ScrapListComponent } from './list/list.component';
import { ScrapNewComponent } from './new/new.component';
import { ScrapEditComponent } from './edit/edit.component';
import { ScrapDetailComponent } from './detail/detail.component';

const routes: Routes = [
  {
    path: '', data: {title: 'plants'},
    children: [
     { path: '', component: ScrapListComponent, data: { title: 'scrap'} },
      { path: 'new', component:ScrapNewComponent, data: { title: 'new-scrap'} },
      { path: 'edit/:id', component: ScrapEditComponent, data: { title: 'edit-scrap'} },
      { path: 'detail/:id', component: ScrapDetailComponent, data: { title: 'scrap-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrapRoutingModule {
}
