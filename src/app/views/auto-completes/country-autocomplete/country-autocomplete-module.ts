import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {CountryAutoCompleteComponent} from './country-auto-complete.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    CountryAutoCompleteComponent,
  ],
  exports: [
    CountryAutoCompleteComponent,
  ]
  ,
  providers: [

  ]
})
export class CountryAutoCompleteModule {
}
