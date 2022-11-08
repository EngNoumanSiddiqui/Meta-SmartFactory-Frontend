import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListQualityNotificationType } from './list/list.component'

const routes: Routes = [
  { path: '', data: { title: 'quality-notification-type' },
  children: [
    {path: '', component: ListQualityNotificationType, data: {title: 'quality-notification-type'}}
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualityNotificationTypeRoutingModule { }
