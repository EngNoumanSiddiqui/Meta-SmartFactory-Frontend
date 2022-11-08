import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ForkLiftDetailComponent } from './detail/detail.component';
import { ForkLiftEditComponent } from './edit/edit.component';
import { ForkLiftListComponent } from './list/list.component';
import { ForkLiftNewComponent } from './new/new.component';


const routes: Routes = [
  {
    path: '', data: {title: 'vehicle'},
    children: [
     { path: '', component: ForkLiftListComponent, data: { title: 'vehicle'} },
      { path: 'new', component:ForkLiftNewComponent, data: { title: 'new-vehicle'} },
      { path: 'edit/:id', component: ForkLiftEditComponent, data: { title: 'edit-vehicle'} },
      { path: 'detail/:id', component: ForkLiftDetailComponent, data: { title: 'vehicle-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForkLiftRoutingModule {
}
