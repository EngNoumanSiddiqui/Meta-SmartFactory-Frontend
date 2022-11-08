import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  {path: 'quality-control-key', loadChildren: () => import('./qualiy-control-key/qualiy-control-key.module').then(m => m.QualiyControlKeyModule)},
  {path: 'quality-systems', loadChildren: () => import('./quality-systems/quality-systems.module').then(m => m.QualitySystemsModule)},
  {path: 'sampling-type', loadChildren: () => import('./sampling-type/sampling-type.module').then(m => m.SamplingTypeModule)},
  {path: 'valuation-mode' , loadChildren: () => import('./valuation-mode/valuation-mode.module').then(m => m.ValuationModeModule)},
  {path: 'inspection-operation', loadChildren: () => import('./inspection-operation/inspection-operation.module').then(m => m.InspectionOperationModule)},
  {path: 'quality-notification-type', loadChildren: () => import('./quality-notification-type/quality-notification-type.module').then(m => m.QualityNotificationTypeModule)},
  {path: 'quality-report-type', loadChildren: () => import('./quality-report-type/quality-report-type.module').then(m => m.QualityReportType)},
  {path: 'defect-type' , loadChildren: () => import('./defect-type/defect-type.module').then(m => m.DefectTypeModule)},
  {path: 'defect-location', loadChildren: () => import('./defect-location/defect-location.module').then(m => m.DefectLocationModule)},
  {path: 'quality-causes', loadChildren: () => import('./quality-causes/quality-causes.module').then(m => m.QualityCausesModule)},
  {path: 'quality-tasks', loadChildren: () => import('./quality-tasks/quality-tasks.module').then(m => m.QualityTasksModule)},
  {path: 'quality-activities', loadChildren: () => import('./quality-activities/quality-activities.module').then(m => m.QualityActivitiesModule)},
  {path: 'usage-decision-type', loadChildren: () => import('./usage-decision-type/usage-decision-type.module').then(m => m.UsageDecisionTypeModule)},
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class QualitySettingsRoutingModule {
}
