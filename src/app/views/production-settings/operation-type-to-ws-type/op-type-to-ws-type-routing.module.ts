import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { NewComponent } from './new/new.component';
import { OperationTypeWsDetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '', data: {title: 'Connecting Operation Type To WS Type'},
    children: [
      { path: 'new', component: NewComponent, data: { title: 'new'} },
      { path: 'edit/:id', component: EditComponent, data: { title: 'edit'} },
      { path: 'detail/:id', component: OperationTypeWsDetailComponent, data: { title: 'detail'} },
      { path: '', component: ListComponent, data: { title: 'Connecting Operation Type To WS Type'} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpTypeToWSTypeRoutingModule {
}
