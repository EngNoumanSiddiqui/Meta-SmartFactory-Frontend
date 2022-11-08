import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'stock-reports', data: {title: 'stock-reports'},
  //   children: [
  //     {path: '', component: ListStockReportComponent, data: {title: 'stock-reports'}}
  //   ]
  // },
  // {
  //   path: 'advanced-stock-reports', data: {title: 'advanced-stock-reports'},
  //   children: [
  //     {path: '', component: ListAdvancedStockReportComponent, data: {title: 'advanced-stock-reports'}}
  //   ]
  // },

  // { path: 'transfers-items', component: ListStockTransferReceiptItemsComponent, 
  // data: {title: 'goods-movement-items'} },

  // {
  //   path: 'transfers', data: {title: 'goods-movement'},
  //   children: [
  //     {path: 'new', component: NewStockTransferReceiptComponent, data: {title: 'new-stock-transfer'}},
  //     {path: 'edit/:id', component: EditStockTransferReceiptComponent, data: {title: 'edit-stock-transfer'}},
  //     {path: 'detail/:id', component: DetailStockTransferReceiptComponent, data: {title: 'stock-transfer-detail'}},
  //     {path: '', component: ListStockTransferReceiptComponent, data: {title: 'goods-movement'}},
  //   ]
  // },

  // {
  //   path: 'transfers-notifications', data: {title: 'automatic_dispatching_management'},
  //   children: [
  //     {path: '', component: ListStockTransferNotificationComponent, 
  //     data: {title: 'automatic_dispatching_management'}},
  //   ]
  // },
 
  {path: 'scrap', loadChildren: () => import('../production-settings/scrap/scrap.module').then(m => m.ScrapModule)},
  {path: 'rework', loadChildren: () => import('../production-settings/rework/rework.module').then(m => m.ReworkModule)},
  // {path: 'reservations', loadChildren:() => import('./reservation/reservation.module').then(m => m.ReservationModule)},
  // {path: 'batch', loadChildren:() => import('./batch/batch.module').then(m => m.BatchModule)},

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule {
}
