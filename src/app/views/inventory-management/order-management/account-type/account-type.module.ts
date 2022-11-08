import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, AutoCompleteModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { AccountTypeRoutingModule } from './account-type-routing.module';
import { AccountListComponent } from './list/list.component';
import { AccountTypeNewComponent } from './new/new.component';
import { AccountTypeEditComponent } from './edit/edit.component';
import { AccountTypeDetailComponent } from './detail/detail.component';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';

@NgModule({
  declarations: [AccountListComponent, AccountTypeNewComponent, AccountTypeEditComponent, AccountTypeDetailComponent],
  exports: [AccountTypeDetailComponent, AccountTypeNewComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    AutoCompleteModule,
    AccountTypeRoutingModule,
  ], providers: [ActTypeService]
})
export class AccountTypeModule { }
