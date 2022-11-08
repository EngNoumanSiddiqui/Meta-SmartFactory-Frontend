import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAdvancedStockReportComponent } from './list/advanced-stock-report-list.component';


const routes: Routes = [
    { path: '', component: ListAdvancedStockReportComponent, data: { title: 'advanced-stock-reports' } }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdvancedStockReportsRouting {
}