import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonTemplateTypeNewComponent} from './common-template-types/new/common-template-type-new.component';
import {CommonTemplateTypeListComponent} from './common-template-types/list/common-template-type-list.component';
import {CommonTemplateTypeDetailComponent} from './common-template-types/detail/common-template-type-detail.component';
import {CommonTemplateTypeEditComponent} from './common-template-types/edit/common-template-type-edit.component';
import {
  ConfirmDialogModule,
} from 'primeng';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {PrintRoutingModule} from './print-routing';
import {ActAutoCompleteModule} from '../../auto-completes/act-auto-complete/act-autocomplete-module';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { PrintSharedModule } from './print-component/print-shared.module';
import { CommonTemplateModule } from './common-templates.module';

@NgModule({
  declarations: [
    CommonTemplateTypeNewComponent,
    CommonTemplateTypeListComponent,
    CommonTemplateTypeDetailComponent,
    CommonTemplateTypeEditComponent,
  ],
  exports: [
  ],

  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    PrintRoutingModule,
    AngularEditorModule,
    CommonTemplateModule
  ]
})
export class PrintModule {
}
