import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
  ],
  declarations: [ DetailComponent ],
  exports: [ DetailComponent ],

})
export class ScrapTypeSharedModule { }
