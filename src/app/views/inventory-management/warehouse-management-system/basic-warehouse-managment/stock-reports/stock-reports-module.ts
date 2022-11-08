import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { StockReportsRouting } from './stock-reports.routing';
import { StockReportsSharedModule } from './stock-reports-shared.module';


@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    StockReportsRouting,
    TooltipModule,
    KeyFilterModule,
    StockReportsSharedModule
  ]
})
export class StockReportsModule {
}
