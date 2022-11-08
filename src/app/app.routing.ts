import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Containers
import { FullLayoutComponent,  SimpleLayoutComponent } from './containers';
import { AdminGuard } from './guards/admin.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', },
  { path: '', component: FullLayoutComponent, data: { title: 'Home' },
    children: [
      { path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AdminGuard]},
      { path: 'kpi-reports', loadChildren: () => import('./views/kpi-report/kpi-report.module').then(m => m.KpiReportModule), canActivate: [AdminGuard]},
      { path: 'home', loadChildren: () => import('./views/monitoring/monitoring.module').then(m => m.MonitoringModule), canActivate: [AdminGuard]},
      { path: 'equipment-monitoring', loadChildren: () => import('./views/monitoring-equipment/equipment-monitoring.module').then(m => m.EquipmentMonitoringModule), canActivate: [AdminGuard]},
      { path: 'inventory-management', loadChildren: () => import('./views/inventory-management/inventory-management.module').then(m => m.InventoryManagementModule), canActivate: [AdminGuard]},
      { path: 'manufacturing-planning', loadChildren: () =>
              import('./views/manufacturing-planning-system/manufacturing-planning-system.module')
              .then(m => m.ManufacturingPlanningSystemModule), canActivate: [AdminGuard]},
      // { path: 'contact-person', loadChildren: () => import('./views/customers/act-contact-person/act-contact-person.module').then(m => m.ActContactPersonModule), canActivate: [AdminGuard]},
      // { path: 'orders', loadChildren: () => import('./views/order/orders.module').then(m => m.OrdersModule), canActivate: [AdminGuard]},
      { path: 'stocks', loadChildren: () => import('./views/stocks/stocks.module').then(m => m.StocksModule), canActivate: [AdminGuard]},
      // { path: 'job-order', loadChildren: () => import('./views/job-order/job-order.module').then(m => m.JobOrderModule), canActivate: [AdminGuard]},
      { path: 'analysis', loadChildren: () => import('./views/analysis/analysis.module').then(m => m.AnalysisModule), canActivate: [AdminGuard]},
      // { path: 'production', loadChildren: () => import('./views/production/production.module').then(m => m.ProductionModule), canActivate: [AdminGuard]},
      { path: 'labor', loadChildren: () => import('./views/labor/labor.module').then(m => m.LaborModule), canActivate: [AdminGuard]},
      // { path: 'monitoring', loadChildren: () => import('./views/monitoring/monitoring.module').then(m => m.MonitoringModule), canActivate: [AdminGuard]},
      { path: 'settings', loadChildren: () => import('./views/production-settings/settings.module').then(m => m.SettingsModule), data: { title: 'Settings'}, canActivate: [AdminGuard]},
      { path: 'maintenance', loadChildren: () => import('./views/maintenance/maintenance.module').then(m => m.MaintenanceModule), data: { title: 'Maintenance'}, canActivate: [AdminGuard]},
      { path: 'factory', loadChildren: () => import('./views/factory/factory.module').then(m => m.FactoryModule), data: { title: 'Factory'}, canActivate: [AdminGuard]},
      { path: 'qualitycontrol', loadChildren: () => import('./views/quality-control-system/quality-control.module').then(m => m.QualityControlSystemModule), data: { title: 'Quality'}, canActivate: [AdminGuard]},
    ]
  },
  { path: '', component: SimpleLayoutComponent, data: { title: 'Pages'},
    children: [
      { path: '', loadChildren: () => import('./views/guest/guest.module').then(m => m.GuestModule)},
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
