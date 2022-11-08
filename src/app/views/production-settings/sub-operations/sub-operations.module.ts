import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import { SubOperationsRoutingModule } from './sub-operations-routing.module';
import { NewSubOperationComponent } from './new/new.component';
import { EditSubOperationComponent } from './edit/edit.component';
import { DetailSubOperationComponent } from './detail/detail.component';
import { ListSubOperationComponent } from './list/list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmDialogModule } from 'primeng';
import { SubOperationService } from 'app/services/dto-services/operation/sub-operation.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    SubOperationsRoutingModule
  ],
  declarations: [
    NewSubOperationComponent,
    EditSubOperationComponent,
    DetailSubOperationComponent,
    ListSubOperationComponent
  ],
  exports: [
    NewSubOperationComponent,
    EditSubOperationComponent,
    DetailSubOperationComponent,
    ListSubOperationComponent
  ],
  providers: [SubOperationService]
})
export class SubOperationsModule {
}
