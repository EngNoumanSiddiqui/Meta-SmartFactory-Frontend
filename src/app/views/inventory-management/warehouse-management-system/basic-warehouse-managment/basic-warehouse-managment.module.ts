import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', data: { title: 'basic-warehouse-managment-system' },
        children: [
            { path: 'material-cards', 
                loadChildren: () => import('./material-cards/shared-material-module')
                .then(m => m.SharedMaterialModule)},
            { path: 'goods-movement', 
                loadChildren: () => import('./transfer/shared-transfer-module')
                .then(m => m.SharedStockTransferModule)},
            { path: 'stock-reports', 
                loadChildren: () => import('./stock-reports/stock-reports-module')
                .then(m => m.StockReportsModule)},
            
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class BasicWarehouseManagementModule { }
