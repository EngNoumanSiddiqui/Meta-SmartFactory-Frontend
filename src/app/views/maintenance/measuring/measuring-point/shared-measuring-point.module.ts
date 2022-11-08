import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ImageModule} from '../../../image/image-module';
import {NewMeasuringPointComponent} from './new/new.component';
import {EditMeasuringPointComponent} from './edit/edit.component';
import {ListMeasuringPointComponent} from './list/list.component';
import {EquipmentAutoCompleteModule} from '../../../auto-completes/equipment-auto-complete/equipment-autocomplete-module';
import {EquipmentCodeGroupAutoCompleteModule} from '../../../auto-completes/equipment-code-group-auto-complete/equipment-code-group-autocomplete-module';
import {CharacteristicAutoCompleteModule} from '../../../auto-completes/maintenance-characteristic-auto-complete/characteristic-autocomplete-module';
import {DetailMeasuringPointComponent} from './detail/detail.component';
import {MeasuringPointService} from '../../../../services/dto-services/measuring/measuring-point.service';
import {ChooseMeasuringPointPaneComponent} from '../../../choose-panes/choose-measurement-point-pane/choose-measuring-point-pane.component';
import {EquipmentCodeGroupHeaderService} from '../../../../services/dto-services/maintenance-equipment/code-group-header.service';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';

const COMPONENTS = [DetailMeasuringPointComponent,
  NewMeasuringPointComponent,
  EditMeasuringPointComponent,
  ListMeasuringPointComponent,
  ChooseMeasuringPointPaneComponent
];


@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    EquipmentAutoCompleteModule,
    ModalModule.forRoot(),
    TooltipModule,
    EquipmentCodeGroupAutoCompleteModule,
    AutoCompleteModule,
    CharacteristicAutoCompleteModule,
    UnitAutoCompleteModule,
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [...COMPONENTS],
  providers: [MeasuringPointService, EquipmentCodeGroupHeaderService]
})
export class SharedMeasuringPointModule {
}
