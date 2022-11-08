import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStockTransferNotificationComponent } from './list/list-transfer-notification.component';

const routes: Routes = [
    { path: '', component: ListStockTransferNotificationComponent, data: {title: 'automatic_dispatching_management'}},
    { path: 'dispatcher', component: ListStockTransferNotificationComponent, data: {title: 'automatic_dispatching_management_dispatcher'}}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransferNotificationRouting {
}
