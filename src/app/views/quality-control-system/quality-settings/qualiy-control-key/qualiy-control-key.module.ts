import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityControlKeyServiceService } from 'app/services/dto-services/quality-control-key/quality-control-key-service.service';
import { QualiyControlKeyRoutingModule } from './qualiy-control-key-routing.module';

import { ListQualityControlKey } from './list/list.component';


import { FormsModule } from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {
  RatingModule,
  SidebarModule,
  TooltipModule,
  TreeTableModule,
  ConfirmDialogModule
} from 'primeng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import { NewQualityControlKey } from './new/new.component';
import { EditQualityControlKey } from './edit/edit.component';
import { DetailQualityControlKey } from './detail/detail.component';



@NgModule({
  declarations: [ListQualityControlKey, NewQualityControlKey, EditQualityControlKey, DetailQualityControlKey],
  imports: [
    CommonModule,
    QualiyControlKeyRoutingModule,
    FormsModule,
    DassSharedModule,
    RatingModule,
    TooltipModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    SidebarModule,
    TableModule,
    TreeTableModule,
    CalendarModule,
  ],
  providers:[QualityControlKeyServiceService]
})
export class QualiyControlKeyModule { }
 