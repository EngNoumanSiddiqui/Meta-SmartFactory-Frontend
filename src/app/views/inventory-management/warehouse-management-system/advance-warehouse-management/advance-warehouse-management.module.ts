import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    { path: '', data: { title: 'advance-warehouse-managment-system' },
        children: [
            { path: 'pallet-records', loadChildren: () => import('./pallet-records/pallet-records.module')
                .then(m => m.PalletRecordsModule)},
            { path: 'notification-dashboard', loadChildren: () => import('./notification-dashboard/notificaiton-dashboard.module')
                .then(m => m.NotificationDashboardModule)},
            { path: 'notification-dashboard-dispatcher', loadChildren: () => import('./notification-dashboard/notification-dashboard-dispatcher.module')
                .then(m => m.NotificationDashboardDispatcherModule)},
            { path: 'notification-dashboard-dispatcher-mobile', loadChildren: () => import('./notification-mobile-dashboard/notificaiton-mobile-dashboard.module')
                .then(m => m.NotificationMobileDashboardModule)},
            { path: 'notification-management', loadChildren: () => import('./transfer-notifications/transfer-notifications.module')
                .then(m => m.TransferNotificationModule)},
            { path: 'transfer-operations', loadChildren: () => import('./transfer-operations/transfer-operations.module')
                .then(m => m.TransferOperationsModule)},
            { path: 'notification-management-dispatcher', loadChildren: () => import('./transfer-notifications/transfer-notifications-dispatcher.module')
                .then(m => m.TransferNotificationDispatcherModule)},
                
            { path: 'batch', loadChildren: () => import('./batch/batch.module')
                .then(m => m.BatchModule)},
            { path: 'advanced-stock-reports', 
                loadChildren: () => import('./advanced-stock-reports/advance-stock-reports.module')
                .then(m => m.AdvanceStockReportsModule)},
            { path: 'warehouse-locations', 
                loadChildren: () => import('./warehouse-locations/warehouse-location.module')
                .then(m => m.WarehouseLocationModule)},
            { path: 'reservations', 
                loadChildren: () => import('./reservation/reservation.module')
                .then(m => m.ReservationModule)},
        ]
    }
]


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class AdvanceWarehouseManagementModule { }
