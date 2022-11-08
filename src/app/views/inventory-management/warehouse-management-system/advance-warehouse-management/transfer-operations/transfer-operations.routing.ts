import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStockTransferNotificationComponent } from './list/list-transfer-notification.component';

const routes: Routes = [
    { path: '', component: ListStockTransferNotificationComponent, data: {title: 'transfer_operations'}},
    // { path: 'dispatcher', component: ListStockTransferNotificationComponent, data: {title: 'transfer_operations'}}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransferOperationsRouting {
}
