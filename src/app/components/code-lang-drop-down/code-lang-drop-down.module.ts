import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeLangDropDownComponent } from './code-lang-drop-down.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng';
@NgModule({
  declarations: [CodeLangDropDownComponent],
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    DropdownModule,
  ],
  exports: [
    CodeLangDropDownComponent
  ]
})
export class CodeLangDropDownModule { }
