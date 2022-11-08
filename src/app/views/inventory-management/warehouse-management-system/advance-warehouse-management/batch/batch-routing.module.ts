import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListBatchComponent} from './list/list.component';


const routes: Routes = [
  { path: '', component: ListBatchComponent, data: {title: 'batch'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule {}
