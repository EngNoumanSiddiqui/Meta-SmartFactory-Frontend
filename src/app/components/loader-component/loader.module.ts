import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LoaderSpinnerComponent} from './loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    LoaderSpinnerComponent,
  ],
  exports: [
    LoaderSpinnerComponent
  ]
  ,
  providers: [
  ]
})
export class LoaderModule {
}
