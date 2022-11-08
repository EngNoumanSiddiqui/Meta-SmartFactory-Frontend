import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShiftSettingsComponent} from './shift-settings/shift-settings.component';

const routes: Routes = [
  {path: 'general/role', loadChildren: () => import('./role/role.module').then(m => m.RoleModule)},

  {path: 'general/staff', loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)},
  {path: 'general/employee-groups', loadChildren: () => import('./employee-groups/employee-groups.module').then(m => m.EmployeeGroupsModule)},
  {path: 'general/employee-shift-exception', loadChildren: () => import('./employee-shift-exceptions/employee-shift-exceptions.module').then(m => m.EmployeeShiftExceptionsModule)},
 
  {path: 'general/employee-shift-groups', loadChildren: () => import('./employee-shift-groups/employee-shift-groups.module').then(m => m.EmployeeShiftGroupsModule)},
  {path: 'general/generic-group', loadChildren: () => import('./generic-group/generic-group.module').then(m => m.GenericGroupModule)},
  {path: 'skill-matrix/skill-matrix', loadChildren: () => import('./employee-capabilities/employee-capability.module').then(m => m.CapabilityModule)},
  {path: 'employee-skills', loadChildren: () => import('./employee-skills/employee-skills.module').then(m => m.EmployeeSkillsModule)},
  {path: 'employee-detail-groups', loadChildren: () => import('./employee-detail-groups/employee-detail-groups.module').then(m => m.EmployeeDetailGroupsListModule)},
  {path: 'skill-matrix/ergonomics-analysis', loadChildren: () => import('./key-value-skill-matrix/key-value-skill-matrix.module').then(m => m.KeyValueSKillModule)},
  {path: 'skill-matrix/skill-matrix-category', loadChildren: () => import('./skills-category/skill-category.module').then(m => m.SkillCategoryModule)},
  {path: 'skill-matrix/skill-matrix-sampling-value', loadChildren: () => import('./skill-matrix-sampling-value/skill-matrix-sampling-value.module').then(m => m.SkillMatrixSamplingValueModule)},
  {path: 'general/employee-title', loadChildren: () => import('./employee-title/employee-title.module').then(m => m.EmployeeTitleModule)},
  {path: 'general/login-records', loadChildren: () => import('./login-records/login-records.module').then(m => m.LoginRecordsModule)},
  {path: 'general/countries', loadChildren: () => import('../general-settings/country/country.module').then(m => m.CountryModule)},
  {path: 'general/organizational-employee', loadChildren: () => import('./organizational-employee/organizational-employee.module').then(m => m.OrganizationalEmployeeModule)},
  
  {
    path: 'general/shift-settings', data: {title: 'shift-settings'},
    children: [
      {path: '', component: ShiftSettingsComponent, data: {title: 'shift-settings'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaborRoutingModule {
}
