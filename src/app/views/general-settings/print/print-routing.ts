import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonTemplateTypeDetailComponent} from './common-template-types/detail/common-template-type-detail.component';
import {CommonTemplateTypeEditComponent} from './common-template-types/edit/common-template-type-edit.component';
import {CommonTemplateTypeListComponent} from './common-template-types/list/common-template-type-list.component';
import {CommonTemplateTypeNewComponent} from './common-template-types/new/common-template-type-new.component';
import {CommonTemplateDetailComponent} from './common-templates/detail/common-template-detail.component';
import {CommonTemplateEditComponent} from './common-templates/edit/common-template-edit.component';
import {CommonTemplateListComponent} from './common-templates/list/common-template-list.component';
import {CommonTemplateNewComponent} from './common-templates/new/common-template-new.component';

const routes: Routes = [
  {path: '', data: {title: 'print'}},
  {
    path: 'commontemplatetypes',
    children: [
      { path: '', component: CommonTemplateTypeListComponent, data: {title: 'common-template-types'}},
      { path: 'new', component: CommonTemplateTypeNewComponent, data: {title: 'common-template-type-new'}},
      { path: 'edit/:id', component: CommonTemplateTypeEditComponent, data: {title: 'common-template-type-edit'}},
      { path: 'detail/:id', component: CommonTemplateTypeDetailComponent, data: {title: 'common-template-type-detail'}},
    ]
  },
  {
    path: 'commontemplates',
    children: [
      { path: '', component: CommonTemplateListComponent, data: {title: 'common-templates'}},
      // { path: 'new', component: CommonTemplateNewComponent, data: {title: 'common-template-new'}},
      // { path: 'edit/:id', component: CommonTemplateEditComponent, data: {title: 'common-template-edit'}},
      // { path: 'detail/:id', component: CommonTemplateDetailComponent, data: {title: 'common-template-detail'}},
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintRoutingModule {
}
