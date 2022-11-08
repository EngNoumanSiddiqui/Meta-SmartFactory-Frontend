import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { ForkLiftAutoCompleteComponent } from './forklift-auto-complete.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot()
  ],
  declarations: [
    ForkLiftAutoCompleteComponent,
  ],
  exports: [
    ForkLiftAutoCompleteComponent,
  ]
  ,
  providers: [ForkLiftService]
})
export class ForkLiftAutoCompleteModule {
}
