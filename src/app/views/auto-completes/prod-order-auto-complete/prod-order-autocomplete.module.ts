import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';
import { AutoCompleteModule } from 'primeng';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProdOrderAutoCompleteComponent } from './prod-order-autocomplete.component';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';

@NgModule({
    imports: [
        CommonModule,
        DassSharedModule,
        ButtonModule,
        FormsModule,
        AutoCompleteModule,
        ModalModule.forRoot(),
    ],
    declarations: [
        ProdOrderAutoCompleteComponent
    ],
    exports: [
        ProdOrderAutoCompleteComponent
    ]
    ,
    providers: [ProductionOrderService]
})
export class ProdOrderAutoCompleteModule {
}
