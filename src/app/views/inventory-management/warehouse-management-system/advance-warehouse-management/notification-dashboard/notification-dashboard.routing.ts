import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationDashboardComponent } from './notification-dashboard';


const routes: Routes = [
    { path: '', data: { title: 'automatic_dispatching_dashboard' }, component: NotificationDashboardComponent },
    { path: 'dispatcher', data: { title: 'automatic_dispatching_dashboard_dispatcher' }, component: NotificationDashboardComponent }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationDashboardRouting {
}
