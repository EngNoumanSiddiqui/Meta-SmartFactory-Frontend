import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', data: { title: 'inventory-managment' },
        children: [
            {path: '', redirectTo: 'order-management' , pathMatch: 'full'},
             { path: 'order-management', loadChildren: () => import('./order-management/order-management.module').then(m => m.OrderManagementModule)},
             { path: 'warehouse-management-system', loadChildren: () => import('./warehouse-management-system/warehouse-management-system.module').then(m => m.WarehouseManagementSystemModule)},
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class InventoryManagementModule { }
