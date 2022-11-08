import { PlantAutoCompleteModule } from './../../auto-completes/plant-auto-complete/plant-autocomplete-module';
import { PlantAutoCompleteComponent } from './../../auto-completes/plant-auto-complete/plant-auto-complete.component';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {DetailOperationComponent} from './detail/detail.component';
import {ChooseOperationPaneComponent} from '../../choose-panes/choose-operation-pane/choose-operation-pane.component';
import {ListOperationComponent} from './list/list.component';
import {EditOperationComponent} from './edit/edit.component';
import {NewOperationComponent} from './new/new.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {AutoCompleteModule, ConfirmDialogModule} from 'primeng';
import { SubOperationsModule } from '../sub-operations/sub-operations.module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { LocationAutoCompleteModule } from 'app/views/auto-completes/location-auto-complete/location-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
@NgModule({
  imports: [
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    AutoCompleteModule,
    SubOperationsModule,
    CurrencyAutoCompleteModule,
    PlantAutoCompleteModule,
    LocationAutoCompleteModule,
    UnitAutoCompleteModule
  ],
  declarations: [
    DetailOperationComponent,
    ChooseOperationPaneComponent,
    NewOperationComponent,
    EditOperationComponent,
    ListOperationComponent,
  ],
  providers: [],
  exports: [DetailOperationComponent,
    ChooseOperationPaneComponent]
})
export class SharedOperationsModule {
}
