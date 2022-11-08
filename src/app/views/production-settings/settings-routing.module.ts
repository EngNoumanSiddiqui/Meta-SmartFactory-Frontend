// import { ScrapReworkTypeModule } from './scrap-rework-type /scrap-rework-type.module';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { PowerConsuptionSettingsComponent } from '../general-settings/power-consuption-settings/power-consuption-settings.component';
const routes: Routes = [
  {path: 'general-settings', loadChildren: () => import('../general-settings/general-settings.module').then(m => m.GeneralSettingsModule), data: { title: 'General Settings'}},
  
  { path: 'cost/cost-centers', loadChildren: () => import('../inventory-management/order-management/cost-center/cost-center.module').then(m => m.CostCenterModule)},
  { path: 'cost/parities', loadChildren: () => import('../inventory-management/order-management/parities/parities.module').then(m => m.ParitiesModule)},
  { path: 'cost/exchange-rates', loadChildren: () => import('./exchange-rates/exchange-rates.module').then(m => m.ExchangeRateModule)},
  {path: 'production/workcenter-settings/workcenter', loadChildren: () => import('./workcenter/workcenter.module').then(m => m.WorkcenterModule)},
  {path: 'production/forklift', loadChildren: () => import('./forklift/forklift.module').then(m => m.ForkLiftModule)},
  {path: 'production/location', loadChildren: () => import('./location/location.module').then(m => m.LocationModule)},
  {path: 'production/workcenter-settings/workcenter-types', loadChildren: () => import('./workcenter-type/workcenter-type.module').then(m => m.WorkCenterTypeModule)},
  {path: 'production/workstation-settings/workstation', loadChildren: () => import('./workstation/workstation.module').then(m => m.WorkstationModule)},
  {path: 'production/workstation-settings/workstation-types', loadChildren: () => import('./workstation-type/workstation-type.module').then(m => m.WorkStationTypeModule)},
  {path: 'production/workstation-settings/workstation-categories', loadChildren: () => import('./workstation-category/workstation-category.module').then(m => m.WorkStationCategoryModule)},
  {path: 'production/workstation-settings/workstation-programs', loadChildren: () => import('./workstation-program/workstation-program.module').then(m => m.WorkStationProgramModule)},
  {path: 'production/operation-settings/operations', loadChildren: () => import('./operations/operations.module').then(m => m.OperationsModule)},
  {path: 'production/operation-settings/operation-type', loadChildren: () => import('./operation-type/operation-type.module').then(m => m.OperationTypeModule)},
  {path: 'production/warehouse-settings/wareHouses', loadChildren:() => import('../stocks/warehouse/warehouse.module').then(m => m.WarehouseModule)},
  { path: 'production/warehouse-settings/warehouse-locations', 
                loadChildren: () => import('../inventory-management/warehouse-management-system/advance-warehouse-management/warehouse-locations/warehouse-location.module')
                .then(m => m.WarehouseLocationModule)},
  {path: 'production/stop-settings/stop-cause-type', loadChildren: () => import('./stop-cause-type/stop-cause-type.module').then(m => m.StopCauseTypeModule)},
  {path: 'production/material-settings/material-group', loadChildren: () => import('./material-group/material-group.module').then(m => m.MaterialGroupsModule)},
  {path: 'production/operation-settings/operation-type-to-ws-type', loadChildren: () => import('./operation-type-to-ws-type/op-type-to-ws-type.module').then(m => m.OpTypeToWSTypeModule)},
  {path: 'production/stop-settings/causes', loadChildren: () => import('./causes/causes.module').then(m => m.CausesModule)},
  {path: 'production/material-settings/material-types', loadChildren: () => import('./material-types/material-types.module').then(m => m.MaterialTypesModule)},
  {path: 'production/material-settings/industry', loadChildren: () => import('./industry/industry.module').then(m => m.IndustryModule)},
  {path: 'production/warehouse-settings/pallets', loadChildren: () => import('./pallets/pallets.module').then(m => m.PalletsModule)},
  
  {path: 'parts', loadChildren: () => import('./part/part.module').then(m => m.PartModule)},
  
  {
    path: 'maintenance/power-consuption', data: {title: 'power-consumption-settings'},
    children: [
      {path: '', component: PowerConsuptionSettingsComponent, data: {title: 'power-consumption-settings'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
