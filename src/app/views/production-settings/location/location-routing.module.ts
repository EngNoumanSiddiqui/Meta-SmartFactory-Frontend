import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { LocationDetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'location'},
    children: [
     { path: '', component: ListComponent, data: { title: 'location'} },
      { path: 'new', component: NewComponent, data: { title: 'new-location'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-location'} },
      { path: 'detail/:id', component: LocationDetailComponent, data: { title: 'location-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule {
}
