import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPorderComponent } from './detail/detail.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { TreeModule, ConfirmDialogModule } from 'primeng';
import { POrderItemDetailsComponent } from './porder-items/item-details/item-details.component';
import { PorderService } from 'app/services/dto-services/porder/porder.service';
import { InvoiceModule } from '../invoice/invoice.module';

// import { ListPorderDetailComponent } from './porder-items/list.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    TreeModule,
    ConfirmDialogModule,
    InvoiceModule,

  ],
  declarations: [
    DetailPorderComponent,
    POrderItemDetailsComponent,
  ],
  providers: [
    PorderService,

  ],
  exports: [
    DetailPorderComponent,
    POrderItemDetailsComponent,

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PordersSharedModule {
}
