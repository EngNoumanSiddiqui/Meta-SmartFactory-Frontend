import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PrintComponent } from './print.component';
import { ChooseCommonTemplateComponent } from 'app/views/choose-panes/choose-commontemplate-pane/choose-commontemplate-pane.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    AngularEditorModule
  ],
  declarations: [
    ChooseCommonTemplateComponent,
    PrintComponent,
  ],
  exports: [
    ChooseCommonTemplateComponent,
    PrintComponent,
  ]
})
export class PrintSharedModule {
}
