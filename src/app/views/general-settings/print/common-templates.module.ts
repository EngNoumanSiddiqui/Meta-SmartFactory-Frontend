import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  ConfirmDialogModule,
 
} from 'primeng';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {CommonTemplateNewComponent} from './common-templates/new/common-template-new.component';
import {CommonTemplateEditComponent} from './common-templates/edit/common-template-edit.component';
import {CommonTemplateListComponent} from './common-templates/list/common-template-list.component';
import {CommonTemplateDetailComponent} from './common-templates/detail/common-template-detail.component';
import {ActAutoCompleteModule} from '../../auto-completes/act-auto-complete/act-autocomplete-module';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { PrintSharedModule } from './print-component/print-shared.module';

@NgModule({
  declarations: [
    CommonTemplateNewComponent,
    CommonTemplateListComponent,
    CommonTemplateDetailComponent,
    CommonTemplateEditComponent
  ],
  exports: [
    CommonTemplateListComponent,
  ],

  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    PrintSharedModule,
    ActAutoCompleteModule,
    AngularEditorModule
  ]
})
export class CommonTemplateModule {
}
