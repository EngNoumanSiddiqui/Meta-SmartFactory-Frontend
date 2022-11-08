import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQualityNotification } from './list/list.component'

const routes: Routes = [
  {
    path: '', data: {title: 'quality-notification'},
    children: [
      {
        path: '', component: ListQualityNotification, data: {title: 'quality-notification'}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityNotificationRoutingModule { }
