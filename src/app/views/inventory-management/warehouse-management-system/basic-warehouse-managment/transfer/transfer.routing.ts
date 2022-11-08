import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStockTransferReceiptComponent } from './list/list.component';
import { ListStockTransferReceiptItemsComponent } from './transfer-items/list.component';

const routes: Routes = [
    // {path: '', redirectTo: 'base', pathMatch: 'full'},
    {path: 'base', component: ListStockTransferReceiptComponent, data: { title: 'goods-movement' }},
    {path: 'items', component: ListStockTransferReceiptItemsComponent, data: { title: 'goods-movement-items' }}
  ]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransferGoodsRouting {
}