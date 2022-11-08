import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListSamplingType } from './list/list.component'

const routes: Routes = [
  { path: '', data: { title: 'sampling-type' },
  children: [
    {path: '', component: ListSamplingType, data: {title: 'sampling-type'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SamplingTypeRoutingModule { }
