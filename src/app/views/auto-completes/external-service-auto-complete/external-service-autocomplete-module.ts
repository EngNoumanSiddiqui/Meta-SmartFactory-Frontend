import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedExternalServiceModule} from '../../maintenance/equipment-technical-objects/external-service/shared-external-service.module';
import {ExternalServiceAutoCompleteComponent} from './external-service-auto-complete.component';
import {ExternalServiceService} from '../../../services/dto-services/maintenance-equipment/external-service.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedExternalServiceModule
  ],
  declarations: [
    ExternalServiceAutoCompleteComponent,
  ],
  exports: [
    ExternalServiceAutoCompleteComponent,
  ]
  ,
  providers: [ExternalServiceService

  ]
})
export class ExternalServiceAutoCompleteModule {
}
