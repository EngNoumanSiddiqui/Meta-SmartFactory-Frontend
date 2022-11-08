import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';
import { ConfirmDialogModule} from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceService } from 'app/services/dto-services/invoice/invoice.service';


@NgModule({
  declarations: [ ListComponent, NewComponent, EditComponent, DetailComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    InvoiceRoutingModule,
    TooltipModule,
  ], 
  providers: [InvoiceService],
  exports: [ ListComponent, NewComponent, EditComponent, DetailComponent ],
})
export class InvoiceModule { }
