import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {BatchAutoCompleteComponent} from './batch-auto-complete.component';
import {BatchService} from '../../../services/dto-services/batch/batch.service';
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
    BatchAutoCompleteComponent,
  ],
  exports: [
    BatchAutoCompleteComponent,
  ]
  ,
  providers: [BatchService]
})
export class BatchAutoCompleteModule {
}
