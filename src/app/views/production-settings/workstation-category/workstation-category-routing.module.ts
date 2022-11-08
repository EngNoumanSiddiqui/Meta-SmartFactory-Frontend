import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { WorkStationCategoryDetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'WorkStation Categories'},
    children: [
     { path: '', component: ListComponent, data: { title: 'workstation-category'} },
      { path: 'new', component: NewComponent, data: { title: 'new-workstation-category'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit-workstation-category'} },
      { path: 'detail/:id', component: WorkStationCategoryDetailComponent, data: { title: 'workstation-category-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkStationCategoryRoutingModule {
}
