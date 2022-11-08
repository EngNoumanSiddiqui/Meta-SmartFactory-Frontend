/**
 * Created by Saeed Murrad on 09.01.2020.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {NewCategoryComponent} from './new/new.component';
import {EquipmentCategoryService} from '../../../../services/dto-services/maintenance-equipment/equipment-category.service';

@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
  ],
  declarations: [NewCategoryComponent],
  exports: [
    NewCategoryComponent
  ],
  providers: [EquipmentCategoryService]
})
export class SharedCategoryModule {
}
