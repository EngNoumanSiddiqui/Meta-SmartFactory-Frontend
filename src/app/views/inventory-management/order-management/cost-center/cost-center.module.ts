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
import { CostCenterRoutingModule } from './cost-center-routing.module';
import { CostCenterService } from 'app/services/dto-services/cost-center/cost-center.service';

@NgModule({
  declarations: [ ListComponent, NewComponent, EditComponent, DetailComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    CostCenterRoutingModule,
    TooltipModule,
  ], 
  providers: [CostCenterService],
  exports: [NewComponent, DetailComponent]
})
export class CostCenterModule { }
