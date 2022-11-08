import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CheckboxModule, ConfirmDialogModule, ContextMenuModule, DialogModule, MenuModule, ProgressBarModule, ProgressSpinnerModule, SharedModule, TableModule, TabViewModule, TooltipModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { StopListRoutingModule } from './stop-list.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StopListComponent } from './list/stop-list.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ManualJobOrderRoutingModule } from '../manual-job-order/manual-job-order-routing.module';
import { StopService } from 'app/services/dto-services/stop/stop.service';

@NgModule({
  imports: [
    // CommonModule,
    // ConfirmDialogModule,
    // DassSharedModule,
    // FormsModule,
    // ModalModule.forRoot(),
    // SharedModule,
    // TableModule,
    // StopListRoutingModule
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
    StopListRoutingModule,
    SharedModule,
    TabsModule,
    TabViewModule,
    TooltipModule,
    TableModule,
  ],
  exports: [StopListComponent],
  declarations: [StopListComponent],
  providers: [StopService]
})
export class StopListModule { }
