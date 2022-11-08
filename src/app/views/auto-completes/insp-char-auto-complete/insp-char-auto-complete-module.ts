import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {InspCharAutoCompleteComponent} from './insp-char-auto-complete.component';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { InspectionModule } from 'app/views/quality-control-system/inspection/inspection.module';
import {ModalModule} from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    InspectionModule,
    ModalModule.forRoot()
  ],
  declarations: [InspCharAutoCompleteComponent],
  exports: [InspCharAutoCompleteComponent],
  providers: [InspectionService]
})
export class InspCharAutoCompleteModule {
}
