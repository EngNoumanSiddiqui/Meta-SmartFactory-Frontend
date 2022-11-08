import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EquipmentCodeGroupService} from '../../../services/dto-services/maintenance-equipment/code-group.service';
import { QualityCodeGroupAutoCompleteComponent } from './quality-code-group-auto-complete.component';
import { QualityCodeGroupService } from 'app/services/dto-services/quality-code-group/quality-code-group.service';
import {ModalModule} from 'ngx-bootstrap/modal';

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
    QualityCodeGroupAutoCompleteComponent,
  ],
  exports: [
    QualityCodeGroupAutoCompleteComponent,
  ]
  ,
  providers: [
    QualityCodeGroupService
  ]
})
export class QualityCodeGroupAutoCompleteModule {
}
