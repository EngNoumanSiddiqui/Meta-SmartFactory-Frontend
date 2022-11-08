import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CalendarModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, ContextMenuModule, DialogModule, MenuModule, ProgressSpinnerModule, SharedModule, TabViewModule, TooltipModule, ProgressBarModule} from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TableModule} from 'primeng/table';
import {ListManualJobOrderComponent} from './list/list.component';
import {EditManualJobOrderComponent} from './edit/edit.component';
import {NewManualJobOrderComponent} from './new/new.component';
import {DetailManualJobOrderComponent} from './detail/detail.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ManualJobOrderRoutingModule } from './manual-job-order-routing.module';
import { ManualJobOrderService } from 'app/services/dto-services/manual-job-order/manual-job-order.service';

@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    CommonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DassSharedModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    MenuModule,
    ModalModule.forRoot(),
    ManualJobOrderRoutingModule,
    SharedModule,
    TabsModule,
    TabViewModule,
    TooltipModule,
    TableModule,
  ],
  declarations: [
    ListManualJobOrderComponent,
    EditManualJobOrderComponent,
    NewManualJobOrderComponent,
    DetailManualJobOrderComponent
  ],
  providers: [
    ConfirmationService,
    ManualJobOrderService,
  ]
})
export class ManualJobOrderModule {
}
