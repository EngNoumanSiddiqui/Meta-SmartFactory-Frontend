import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewPartComponent} from './new/new.component';
import { EditPartComponent} from './edit/edit.component';
import { DetailPartComponent} from './detail/detail.component';
import { ListPartComponent} from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'spare-parts'},
    children: [
      { path: 'new', component: NewPartComponent, data: { title: 'new-part'} },
      { path: 'edit/:id', component: EditPartComponent, data: { title: 'edit-part'} },
      { path: 'detail/:id', component: DetailPartComponent, data: { title: 'part-detail'} },
      { path: '', component: ListPartComponent, data: { title: 'spare-parts'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartRoutingModule {
}
