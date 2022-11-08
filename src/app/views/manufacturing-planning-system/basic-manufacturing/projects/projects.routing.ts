import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { ProjectListComponent } from './list/list.component';
const routes: Routes = [
  {
    // path: '', data: {title: 'projects'},
    // children: [
      path: '', component: ProjectListComponent, data: {title: 'projects'},
    // ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
