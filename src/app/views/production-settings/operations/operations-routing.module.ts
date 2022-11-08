import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewOperationComponent} from './new/new.component';
import {EditOperationComponent} from './edit/edit.component';
import {DetailOperationComponent} from './detail/detail.component';
import {ListOperationComponent} from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'opeations'},
    children: [
      { path: 'new', component: NewOperationComponent, data: { title: 'new-operation'} },
      { path: 'edit/:id', component: EditOperationComponent, data: { title: 'edit-operation'} },
      { path: 'detail/:id', component: DetailOperationComponent, data: { title: 'operation-detail'} },
      { path: '', component: ListOperationComponent, data: { title: 'operations'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationsRoutingModule {
}
