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
import { ParitiesRoutingModule } from './parities-routing.module';
import { ParityService } from 'app/services/dto-services/parity/parity.service';


@NgModule({
  declarations: [ ListComponent, NewComponent, EditComponent, DetailComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ParitiesRoutingModule,
    TooltipModule,
  ], 
  providers: [ParityService],
  exports: [NewComponent, DetailComponent]
})
export class ParitiesModule { }
