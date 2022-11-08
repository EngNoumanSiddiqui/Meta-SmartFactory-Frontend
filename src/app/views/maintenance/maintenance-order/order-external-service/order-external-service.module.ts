/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {OrderExternalServiceListComponent} from './list/list.component';
import {EditOrderExternalServiceComponent} from './edit/edit.component';
import {OrderExternalServiceDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {ExternalServiceAutoCompleteModule} from '../../../auto-completes/external-service-auto-complete/external-service-autocomplete-module';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';
import {NewOrderExternalServiceComponent} from './new/new.component';
import {OrderExternalServiceService} from '../../../../services/dto-services/maintenance-equipment/order-external-service.service';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    ExternalServiceAutoCompleteModule,
    UnitAutoCompleteModule
  ],
  declarations: [OrderExternalServiceListComponent, NewOrderExternalServiceComponent, EditOrderExternalServiceComponent, OrderExternalServiceDetailComponent],
  exports: [OrderExternalServiceListComponent],
  providers: [OrderExternalServiceService]
})
export class OrderExternalServiceModule {
}
