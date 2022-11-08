/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ObjectTypesDetailComponent} from './detail/detail.component';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditObjectTypesComponent} from './edit/edit.component';
import {EquipmentObjectTypesModuleRoutes} from './object-types-routing.module';
import {NewObjectTypesComponent} from './new/new.component';
import {ObjectTypesListComponent} from './list/list.component';
import {EquipmentObjectTypesService} from '../../../../services/dto-services/maintenance-equipment/object-types.service';


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
    EquipmentObjectTypesModuleRoutes
  ],
  declarations: [ObjectTypesListComponent, NewObjectTypesComponent, EditObjectTypesComponent, ObjectTypesDetailComponent],
  providers: [EquipmentObjectTypesService]
})
export class EquipmentObjectTypesModule {
}
