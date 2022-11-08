import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeyValueSKillListComponent } from './list/list.component';

const routes: Routes = [
  {path: '', data: {title: 'ergonomics-analysis'},
  children:
  [
    { path: '', component: KeyValueSKillListComponent, data: { title: 'ergonomics-analysis'} },
  ]
}];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class KeyValueSKillRoutingModule { }
