import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
const routes: Routes = [
  // 1. Advance Quality Control
  // 1.1 Quality Setting
  {path: 'advance/qualitysettings', loadChildren: () => import('./quality-settings/quality-settings.module').then(m => m.QualitySettingsModule)},

  // 1.2 Quality Planning
  {path: 'advance/qualityplannig/inspectioncharacteristics', loadChildren: () => import('./inspection/inspection.module').then(m => m.InspectionModule)},
  {path: 'advance/qualityplannig/samplingprocedure', loadChildren: () => import('./sampling-procedure/sampling-procedure.module').then(m => m.SamplingProcedureModule)},
  {path: 'advance/qualityplannig/inspectionplan', loadChildren: () => import('./inspection-plan/inspection-plan.module').then(m => m.InspectionPlanModule)},
  {path: 'advance/qualityplannig/inspectionmethod', loadChildren: () => import('./inspection-method/inspection-method.module').then(m => m.InspectionMethodModule)},
  {path: 'advance/qualityplannig/qualityinforecord', loadChildren: () => import('./quality-info-record/quality-info-record.module').then(m => m.QualityInfoRecordModule)},
  

  // 1.3 Quality Inspection
  {path: 'advance/qualityinspection/inspectionlot', loadChildren: () => import('./quality-inspection/quality-inspection.module').then(m => m.QualityInspectionModule)},

  // 1.4 Quality Notification
  {path: 'advance/qualitynotification', loadChildren: () => import ('./quality-notification/quality-notification.module').then(m => m.QualityNotificationModule)},

  // 2 Basic Quality Control
  {path: 'basic/scrap-and-rework-types', loadChildren: () => import('./quality-settings/scrap-type/scrap-type.module').then(m => m.ScrapTypeModule)},
  {path: 'basic/scrap-rework-cause', loadChildren: () => import('./quality-settings/scrap-cause-rework/scrap-cause-rework.module').then(m => m.ScrapReworkCauseModule)},
  {path: 'basic/valuation-mode' , loadChildren: () => import('./quality-settings/valuation-mode/valuation-mode.module').then(m => m.ValuationModeModule)},
  {path: 'basic/defect-type' , loadChildren: () => import('./quality-settings/defect-type/defect-type.module').then(m => m.DefectTypeModule)},
  {path: 'basic/scrapcause', loadChildren: () => import('./quality-settings/scrap-cause/scrap-cause.module').then(m => m.ScrapCauseModule)},
  {path: 'basic/scrap', loadChildren: () => import('../production-settings/scrap/scrap.module').then(m => m.ScrapModule)},
  {path: 'basic/rework', loadChildren: () => import('../production-settings/rework/rework.module').then(m => m.ReworkModule)},
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class QualityControlSystemRoutingModule {
}
