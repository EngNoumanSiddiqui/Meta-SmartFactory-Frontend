import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreferancesListComponent } from './list/list.component';

const routes: Routes = [
  {path: '', component: PreferancesListComponent, data: { title: 'preferences'}}
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PreferenceRoutingModule { }
