import {NgModule} from '@angular/core';
import {ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {FormsModule} from '@angular/forms';
import {NewCharacteristicComponent} from './new/new.component';
import {CharacteristicDataTypeAutoCompleteModule} from '../../../auto-completes/characteristic-data-type-auto-complete/characteristic-data-type-autocomplete-module';
import {CharacteristicService} from '../../../../services/dto-services/maintenance-equipment/characteristic.service';
import {UnitAutoCompleteModule} from '../../../auto-completes/unit-auto-complete/unit-autocomplete-module';


@NgModule({
  imports: [
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
    KeyFilterModule,
    CharacteristicDataTypeAutoCompleteModule,
    UnitAutoCompleteModule,
  ],
  declarations: [
    NewCharacteristicComponent
  ],
  providers: [
    CharacteristicService
  ],
  exports: [
    NewCharacteristicComponent
  ]
})
export class SharedCharacteristicModule {
}
