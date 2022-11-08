import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { ContactPersonAccountRoutingModule } from './act-contact-person-routing';
import { CalendarModule, ConfirmDialogModule } from 'primeng';

import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import { ActService } from 'app/services/dto-services/act/act.service';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { EnumActStatusService } from 'app/services/dto-services/enum/act-status.service';
import { TranslateService } from '@ngx-translate/core';
import { EnumActPositionService } from 'app/services/dto-services/enum/act-position.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { StockTransferReceiptService } from 'app/services/dto-services/stock-transfer-receipt/stock-transfer-receipt.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [NewComponent, EditComponent, DetailComponent, ListComponent],
  imports: [
    CommonModule,
    CalendarModule,
    ConfirmDialogModule,
    ContactPersonAccountRoutingModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
  ],
  providers: [
    ActService,
    ActTypeService,
    EnumActStatusService,
    TranslateService,
    EnumActPositionService,
    SalesOrderService,
    StockTransferReceiptService
  ],
  exports: [NewComponent, EditComponent, DetailComponent, ListComponent],

})
export class ActContactPersonModule { }
