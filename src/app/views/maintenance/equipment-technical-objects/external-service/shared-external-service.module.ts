/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewExternalServiceComponent} from './new/new.component';
import {ExternalServiceService} from '../../../../services/dto-services/maintenance-equipment/external-service.service';


@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [NewExternalServiceComponent],
  exports: [NewExternalServiceComponent],
  providers: [ExternalServiceService]
})
export class SharedExternalServiceModule {
}
