import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NewSubOperationComponent} from './new/new.component';
import {EditSubOperationComponent} from './edit/edit.component';
import {DetailSubOperationComponent} from './detail/detail.component';
import {ListSubOperationComponent} from './list/list.component';
const routes: Routes = [
  {
    path: '', data: {title: 'sub-opeations'},
    children: [
      { path: 'new', component: NewSubOperationComponent, data: { title: 'new-sub-operation'} },
      { path: 'edit/:id', component: EditSubOperationComponent, data: { title: 'edit-sub-operation'} },
      { path: 'detail/:id', component: DetailSubOperationComponent, data: { title: 'sub-operation-detail'} },
      { path: '', component: ListSubOperationComponent, data: { title: 'sub-operations'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubOperationsRoutingModule {
}
