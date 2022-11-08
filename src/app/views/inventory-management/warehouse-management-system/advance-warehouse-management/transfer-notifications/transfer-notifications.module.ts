import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CardModule, CalendarModule, PanelModule, CheckboxModule, ConfirmDialogModule } from 'primeng';
import { ListStockTransferNotificationComponent } from './list/list-transfer-notification.component';
import { EditStockTransferNotificationComponent } from './edit/edit-transfer-notification.component';
import { DetailStockTransferNotificationComponent } from './detail/detail-transfer-notification.component';
import { NewStockTransferNotificationComponent } from './new/new-transfer-notification.component';
import { FormsModule } from '@angular/forms';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { StockReportsModule } from '../../basic-warehouse-managment/stock-reports/stock-reports-module';
import { TransferNotificationRouting } from './transfer-notifications.routing';
import { SharedMaterialModule } from '../../basic-warehouse-managment/material-cards/shared-material-module';
import { StockReportsSharedModule } from '../../basic-warehouse-managment/stock-reports/stock-reports-shared.module';
import { ScrapModule } from 'app/views/production-settings/scrap/scrap.module';
import { TransferNotificationDispatcherModule } from './transfer-notifications-dispatcher.module';
import { PrintSharedModule } from 'app/views/general-settings/print/print-component/print-shared.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TransferNotificationRouting,
        CheckboxModule,
        ConfirmDialogModule,
        DassSharedModule,
        ModalModule.forRoot(),
        CardModule,
        CalendarModule,
        PanelModule,
        PlantAutoCompleteModule,
        BatchAutoCompleteModule,
        WareHouseAutoCompleteModule,
        StockReportsModule,
        SharedMaterialModule,
        StockReportsSharedModule,
        ScrapModule,
        PrintSharedModule,
        TransferNotificationDispatcherModule
    ],
    declarations: [],
    exports: [
        ListStockTransferNotificationComponent,
        DetailStockTransferNotificationComponent
    ]
})
export class TransferNotificationModule { }

