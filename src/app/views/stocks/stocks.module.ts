import { CommonModule } from '@angular/common';

import { PalletService } from 'app/services/dto-services/pallet/pallet.service';

import { StocksRoutingModule } from './stocks-routing.module';
import { FormsModule } from '@angular/forms';
import { DassSharedModule } from '../../shared/dass-shared.module';
import { CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule } from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ImageModule } from '../image/image-module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BatchAutoCompleteModule } from '../auto-completes/batch-auto-complete/batch-autocomplete-module';
import { WareHouseAutoCompleteModule } from '../auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { PlantAutoCompleteModule } from '../auto-completes/plant-auto-complete/plant-autocomplete-module';

import { JobOrderAutoCompleteModule } from '../auto-completes/job-order-auto-complete/job-order-autocomplete.module';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
import { PalletStockSettingsService } from 'app/services/dto-services/pallet/pallet-stock-settings.service';
import { PalletLogService } from 'app/services/dto-services/pallet/pallet.log.service';
import { StockAutoCompleteModule } from '../auto-completes/stock-auto-complete/stock-autocomplete-module';
import { StockReportsModule } from '../inventory-management/warehouse-management-system/basic-warehouse-managment/stock-reports/stock-reports-module';

@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    StocksRoutingModule,
    TooltipModule,
    ImageModule,
    KeyFilterModule,
    StockReportsModule,
    BatchAutoCompleteModule,
    WareHouseAutoCompleteModule,
    PlantAutoCompleteModule,
    JobOrderAutoCompleteModule,
    StockAutoCompleteModule,
    PanelModule,
    CardModule,
    NgCircleProgressModule.forRoot({
      'innerStrokeColor': '#ffffff',
      'innerStrokeWidth': 5,
    }),
  ],
  declarations: [

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    PalletService, 	
    PalletSettingsService, 	
    PalletStockSettingsService, 	
    PalletLogService	
  ]
})
export class StocksModule {
}
