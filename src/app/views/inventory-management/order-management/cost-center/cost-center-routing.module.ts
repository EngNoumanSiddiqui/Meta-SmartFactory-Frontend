import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
// import { NewComponent } from './new/new.component';
// import { EditComponent } from './edit/edit.component';
// import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'cost-center'},
    children: [
     { path: '', component: ListComponent, data: { title: 'cost-centers'} },
      // { path: 'new', component: NewComponent, data: { title: 'new-cost-center'} },
      // { path: 'edit/:id', component: EditComponent, data: { title: 'edit-cost-center'} },
      // { path: 'detail/:id', component: DetailComponent, data: { title: 'cost-center-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostCenterRoutingModule {
}
