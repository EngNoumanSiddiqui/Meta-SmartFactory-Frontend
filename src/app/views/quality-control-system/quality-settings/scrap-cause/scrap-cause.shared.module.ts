import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrapCauseDetailComponent } from './detail/detail.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [ ScrapCauseDetailComponent ],
  exports: [ ScrapCauseDetailComponent ],

})
export class ScrapCauseSharedModule { }
