import { FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CalendarModule, CheckboxModule, ConfirmDialogModule, TooltipModule, KeyFilterModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { PalletScreenNewComponent } from './new/new.componet';
import { PalletScreenEditComponent } from './edit/edit.componet';

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
        WareHouseAutoCompleteModule
    ],
    declarations: [
        PalletScreenNewComponent,
        PalletScreenEditComponent
        
    ],
    exports: [
        PalletScreenNewComponent,
        PalletScreenEditComponent
    ],
    providers: [],
})

export class PalletScreenSharedModule {
}
