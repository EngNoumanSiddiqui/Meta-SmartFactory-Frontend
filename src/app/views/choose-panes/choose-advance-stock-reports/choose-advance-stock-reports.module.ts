import {NgModule} from '@angular/core';
import {ConfirmDialogModule} from 'primeng';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ChooseAdvancedStockReportComponent } from './advanced-stock-report-list.component';


@NgModule({
  imports: [
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    ChooseAdvancedStockReportComponent
  ],
 
  exports: [
    ChooseAdvancedStockReportComponent
  ],
})
export class ChooseAdvanceStockReportsModule {
}
