import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', data: { title: 'order-managment' },
        children: [
            { path: 'sales-dashboard', loadChildren: () => import('./sales-dashboard/sales-dashboard.module').then(m => m.SalesDashboardModule)},
            { path: 'invoices', loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule)},
            { path: 'account-management/accounts', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)},
            { path: 'account-management/account-types', loadChildren: () => import('./account-type/account-type.module').then(m => m.AccountTypeModule)},
            { path: 'sales-orders', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule)},
            { path: 'sales-orders/quotations', loadChildren: () => import('./sales-quotations/sales-quotations.module').then(m => m.SalesQuotationsModule)},
            { path: 'purchase-orders', loadChildren: () => import('./porders/porders.module').then(m => m.PordersModule)},
            { path: 'purchase-orders/quotations', loadChildren: () => import('./purchase-quotations/purchase-quotation.module').then(m => m.PurchaseQuotationModule)},
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class OrderManagementModule { }
