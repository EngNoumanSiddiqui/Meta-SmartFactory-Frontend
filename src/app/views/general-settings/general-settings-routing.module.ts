import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AlertMessageSettingsComponent} from './alert-message-settings/alert-message-settings.component';


const routes: Routes = [

  {path: 'countries', loadChildren: () => import('./country/country.module').then(m => m.CountryModule)},
  {path: 'cities', loadChildren: () => import('./city/city.module').then(m => m.CityModule)},
  {
    path: 'alert-message', data: {title: 'alert-message-settings'},
    children: [
      {path: '', component: AlertMessageSettingsComponent, data: {title: 'alert-message-settings'}},
    ]
  },
  { path: 'company', loadChildren: () => import('../company/company.module').then(m => m.CompanyModule)},
  { path: 'factory', loadChildren: () => import('../factory/factory.module').then(m => m.FactoryModule), data: { title: 'Factory'}},
  { path: 'workcenter-calendar', loadChildren: () => import('./workcenter-calendar/workcenter-calendar.module').then(m => m.WorkCenterCalendarModule)},
  {path: 'plants', loadChildren: () => import('../production-settings/plant/plant.module').then(m => m.PlantModule)},
  {path: 'organizations', loadChildren: () => import('../production-settings/organization/organization.module').then(m => m.OrganizationModule)},
  {path: 'measuring-unit', loadChildren: () => import('./measuring-unit/measuring-unit.module').then(m => m.MeasuringUnitModule)},
  {path: 'print', loadChildren: () => import('./print/print.module').then(m => m.PrintModule)},
  {path: 'preferences', loadChildren: () => import('./preferences/preference.module').then(m => m.PreferenceModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralSettingsRoutingModule {
}
