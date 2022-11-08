import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';
import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { JobOrderAutoCompleteComponent } from './job-order-autocomplete.component';
import { SharedBatchModule } from 'app/views/inventory-management/warehouse-management-system/advance-warehouse-management/batch/shared-batch.module';

@NgModule({
    imports: [
        CommonModule,
        DassSharedModule,
        ButtonModule,
        FormsModule,
        AutoCompleteModule,
        ModalModule.forRoot(),
        SharedBatchModule
    ],
    declarations: [
        JobOrderAutoCompleteComponent
    ],
    exports: [
        JobOrderAutoCompleteComponent
    ]
    ,
    providers: []
})
export class JobOrderAutoCompleteModule {
}
