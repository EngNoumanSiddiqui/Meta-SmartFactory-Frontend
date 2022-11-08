import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCapabilityComponent } from './list/list.component';

const routes: Routes = [
  {path: '', data: {title: 'skill-matrix'},
  children:
  [
    { path: '', component: ListCapabilityComponent, data: { title: 'skill-matrix'} },
  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CapabilityRoutingModule { }
