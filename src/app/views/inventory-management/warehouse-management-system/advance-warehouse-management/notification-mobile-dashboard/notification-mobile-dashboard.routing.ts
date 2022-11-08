import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationMobileDashboardComponent } from './notification-mobile-dashboard';


const routes: Routes = [
    { path: '', data: { title: 'automatic_dispatching_mobile_dashboard' }, component: NotificationMobileDashboardComponent }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationMobileDashboardRouting {
}
