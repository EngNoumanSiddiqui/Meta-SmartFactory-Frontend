import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ListComponent } from './list/list.component';
import { OperationTypeDetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '', data: {title: 'industry'},
    children: [
     { path: '', component: ListComponent, data: { title: 'operation-type'} },
      { path: 'detail/:id', component: OperationTypeDetailComponent, data: { title: 'operation-type-detail'}},
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationTypeRoutingModule {
}
