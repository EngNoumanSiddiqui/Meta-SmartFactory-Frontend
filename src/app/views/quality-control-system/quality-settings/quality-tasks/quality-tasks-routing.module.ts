import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQualityTasks } from './list/list.component'
 
const routes: Routes = [
  { path: '', data: { title: 'quality-task-type' },
  children: [
    {path: '', component: ListQualityTasks, data: {title: 'quality-task-type'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityTasksRoutingModule { }
