import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PurchaseQuotationRoutingModule } from './purchase-quotation.routing';
import { PurchaseQuotationListComponent } from './list/list.component';
import { PurchaseQuotationEditComponent } from './edit/edit.component';
import { PurchaseQuotationItemDetailsComponent } from './purchase-quotation-items/item-details/item-details.component';
import { PurchaseQuotationItemListComponent } from './purchase-quotation-items/list.component';
import { PurchaseQuotationNewComponent } from './new/new.component';
import { PurchaseQuotationService } from 'app/services/dto-services/purchase-quotation/purchase-quotation.service';
import { ActAutoCompleteModule } from 'app/views/auto-completes/act-auto-complete/act-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { SharedMaterialModule } from '../../warehouse-management-system/basic-warehouse-managment/material-cards/shared-material-module';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { PurchaseQuotationFullDetailsComponent } from './detail/detail.component';
import { PordersModule } from '../porders/porders.module';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { CostCenterAutoCompleteModule } from 'app/views/auto-completes/cost-center-auto-complete/cost-center-autocomplete-module';
import { ActTypeAutoCompleteModule } from 'app/views/auto-completes/act-type-auto-complete/act-type-autocomplete-module';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';

@NgModule({
    imports: [
        CommonModule,
        ConfirmDialogModule,
        PurchaseQuotationRoutingModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ActAutoCompleteModule,
        BatchAutoCompleteModule,
        CurrencyAutoCompleteModule,
        CostCenterAutoCompleteModule,
        SharedMaterialModule,
        ActTypeAutoCompleteModule,
        PrintSharedModule,
        PordersModule
    ],
    exports: [],
    declarations: [
        PurchaseQuotationListComponent,
        PurchaseQuotationEditComponent,
        PurchaseQuotationNewComponent,
        PurchaseQuotationItemDetailsComponent,
        PurchaseQuotationItemListComponent,
        PurchaseQuotationFullDetailsComponent
    ],
    providers: [PurchaseQuotationService, StockCardService, ActTypeService],
})
export class PurchaseQuotationModule { }
