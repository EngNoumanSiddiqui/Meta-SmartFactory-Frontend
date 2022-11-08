/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PlantAutoCompleteModule} from '../../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import {CharacteristicDetailComponent} from './detail/detail.component';
import {ListCharacteristicComponent} from './list/list.component';
import {SharedCharacteristicModule} from './shared-maintenance-characteristic-module';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {EditCharacteristicComponent} from './edit/edit.component';
import {MaintenanceCharacteristicModuleRoutes} from './maintenance-characteristic-routing.module';
import {CharacteristicService} from '../../../../services/dto-services/maintenance-equipment/characteristic.service';
import {CharacteristicDataTypeAutoCompleteModule} from '../../../auto-completes/characteristic-data-type-auto-complete/characteristic-data-type-autocomplete-module';
import {UnitAutoCompleteComponent} from '../../../auto-completes/unit-auto-complete/unit-list.component';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';


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
    PlantAutoCompleteModule,
    SharedCharacteristicModule,
    MaintenanceCharacteristicModuleRoutes,
    UnitAutoCompleteModule,
    CharacteristicDataTypeAutoCompleteModule
  ],
  declarations: [CharacteristicDetailComponent, EditCharacteristicComponent, ListCharacteristicComponent],
  providers: [CharacteristicService]
})
export class  MaintenanceCharacteristicModule {
}
