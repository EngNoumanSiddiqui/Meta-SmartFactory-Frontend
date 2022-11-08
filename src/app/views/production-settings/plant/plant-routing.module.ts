import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'plants'},
    children: [
       { path: '', component: ListComponent, data: { title: 'plant'} },
      { path: 'new', component:NewComponent, data: { title: 'new-plant'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-plant'} },
      { path: 'detail/:id', component: DetailComponent, data: { title: 'plant-detail'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlantRoutingModule {
}
