import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSamplingProcedure } from './list/list.component';

const routes: Routes = [
  { path: '', data: { title: 'sampling-procedure' },
    children: [
      { path: '', component: ListSamplingProcedure, data: {title: 'sampling-procedure'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplingProcedureRoutingModule {}
