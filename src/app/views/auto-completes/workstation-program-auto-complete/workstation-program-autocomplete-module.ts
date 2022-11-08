import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {WorkstationProgramAutoCompleteComponent} from './workstation-program-auto-complete.component';
import {WorkstationProgramService} from '../../../services/dto-services/product-tree/worksation-program.service';
import { SharedWorkstationProgramModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/operation/workstation-program/shared-workstation-program.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedWorkstationProgramModule
  ],
  declarations: [
    WorkstationProgramAutoCompleteComponent,
  ],
  exports: [
    WorkstationProgramAutoCompleteComponent,
  ]
  ,
  providers: [WorkstationProgramService]
})
export class WorkstationProgramAutoCompleteModule {
}
