import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', data: { title: 'warehouse-managment-system' },
        children: [
            {
                path: '', redirectTo: 'advance', pathMatch: 'full'
            },
            { 
                path: 'advance', loadChildren: () => import('./advance-warehouse-management/advance-warehouse-management.module')
                .then(m => m.AdvanceWarehouseManagementModule)
            },
            {
                path: 'basic', loadChildren: () => import('./basic-warehouse-managment/basic-warehouse-managment.module')
                .then(m => m.BasicWarehouseManagementModule)
            }
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class WarehouseManagementSystemModule { }
