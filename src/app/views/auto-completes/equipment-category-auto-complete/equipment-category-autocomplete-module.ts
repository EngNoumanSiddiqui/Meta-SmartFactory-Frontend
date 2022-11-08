import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {AutoCompleteModule, ConfirmDialogModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {EquipmentCategoryAutoCompleteComponent} from './equipment-category-auto-complete.component';
import {EquipmentCategoryService} from '../../../services/dto-services/maintenance-equipment/equipment-category.service';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedCategoryModule} from '../../maintenance/equipment-technical-objects/category/shared-category.module';
@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ConfirmDialogModule,
    ButtonModule,
    FormsModule,
    ModalModule.forRoot(),
    AutoCompleteModule,
    SharedCategoryModule
  ],
  declarations: [
    EquipmentCategoryAutoCompleteComponent,
  ],
  exports: [
    EquipmentCategoryAutoCompleteComponent,
  ]
  ,
  providers: [
    EquipmentCategoryService
  ]
})
export class EquipmentCategoryAutoCompleteModule {
}
