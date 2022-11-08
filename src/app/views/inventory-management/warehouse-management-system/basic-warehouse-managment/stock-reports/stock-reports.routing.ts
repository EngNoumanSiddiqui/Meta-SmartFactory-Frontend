import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListStockReportComponent } from './list/stock-report-list.component';

const routes: Routes = [
    { path: '', data: { title: 'stock-reports' }, component: ListStockReportComponent }
];

@NgModule({
    imports: [ 
        RouterModule.forChild([
        {path: '', component: ListStockReportComponent, data: { title: 'stock-reports' }}
      ])
    ],
    exports: [RouterModule]
})
export class StockReportsRouting {
}