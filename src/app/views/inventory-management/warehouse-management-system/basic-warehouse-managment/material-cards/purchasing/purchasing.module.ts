import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CalendarModule, CheckboxModule, ConfirmDialogModule, TooltipModule, KeyFilterModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { PurchasingNewComponent } from './new/new.componet';
import { PurchasingEditComponent } from './edit/edit.componet';
import { PurchasingDetailComponent } from './detail/detail.componet';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { PurchaseConditionRecordService } from 'app/services/dto-services/purchase-condition/purchase.condition.record';
import { PurchasingConditionDetailsComponent } from './purchasing-condition-details/purchasing.condition.details.component';
import { PurchaseConditionTypeService } from 'app/services/dto-services/purchase-condition/purchase.condition.type.service';

@NgModule({
    imports: [
        CommonModule,
        CalendarModule,
        CheckboxModule,
        ConfirmDialogModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule,
        KeyFilterModule,
        BatchAutoCompleteModule,
        UnitAutoCompleteModule,
        PlantAutoCompleteModule,
        WareHouseAutoCompleteModule,
        InputTextareaModule,
        CurrencyAutoCompleteModule
    ],
    declarations: [
        PurchasingNewComponent,
        PurchasingEditComponent,
        PurchasingDetailComponent,
        PurchasingConditionDetailsComponent
    ],
    exports: [
        PurchasingNewComponent,
        PurchasingEditComponent,
        PurchasingDetailComponent,
        PurchasingConditionDetailsComponent
    ],
    providers: [
        PurchaseConditionRecordService,
        PurchaseConditionTypeService
    ],
})

export class MaterialPurchasingModule {
}
