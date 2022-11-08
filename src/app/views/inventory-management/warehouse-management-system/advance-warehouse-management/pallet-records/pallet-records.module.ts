import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PalletListComponent } from './list/pallet.list.component';
import { CardModule, CalendarModule, PanelModule, TooltipModule } from 'primeng';
import { PalletDetailComponent } from './detail/pallet.detail.component';
import { PalletRecordNewComponent } from './new/pallet.new.component';
import { PalletService } from 'app/services/dto-services/pallet/pallet.service';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
import { FormsModule } from '@angular/forms';
import { JobOrderAutoCompleteModule } from 'app/views/auto-completes/job-order-auto-complete/job-order-autocomplete.module';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { PalletRecordsRouting } from './pallet-records.routing';
import { PalletLogService } from 'app/services/dto-services/pallet/pallet.log.service';
import { JobOrderOperationPalletService } from 'app/services/dto-services/job-order/job-order-operation-pallet.service';


@NgModule({
    imports: [
        CommonModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        PalletRecordsRouting,
        TooltipModule,
        CardModule,
        CalendarModule,
        JobOrderAutoCompleteModule,
        StockAutoCompleteModule,
        WareHouseAutoCompleteModule,
        UnitAutoCompleteModule,
        BatchAutoCompleteModule,
        PanelModule,
    ],
    declarations: [PalletListComponent, PalletDetailComponent, PalletRecordNewComponent],
    providers: [PalletLogService, PalletService, PalletSettingsService,JobOrderOperationPalletService],
    exports: [PalletDetailComponent]
})
export class PalletRecordsModule { }

