import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualitySystemsService } from 'app/services/dto-services/quality-systems/quality-systems.service';
import { QualitySystemsRoutingModule } from './quality-systems-routing.module';




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


import { ListQualitySystems } from './list/list.component';
import { NewQualitySystem } from './new/new.component';
import { EditQualitySystem } from './edit/edit.component';
import { DetailQualityStstem } from './detail/detail.component';
@NgModule({
  declarations: [ListQualitySystems, NewQualitySystem, EditQualitySystem, DetailQualityStstem],
  imports: [
    CommonModule,
    QualitySystemsRoutingModule,
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
  providers: [QualitySystemsService]
})
export class QualitySystemsModule { }
 