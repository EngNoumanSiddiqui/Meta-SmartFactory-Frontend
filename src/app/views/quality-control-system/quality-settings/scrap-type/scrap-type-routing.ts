import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';

import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'scrap-type'},
    children: [
     { path: '', component: ListComponent, data: { title: 'scrap-and-rework-types'} },

      { path: 'new', component: NewComponent, data: { title: 'new-scraptype'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-scraptype'} },
      { path: 'detail/:id', component: DetailComponent, data: { title: 'scraptype-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScrapTypeRoutingModule {
}
