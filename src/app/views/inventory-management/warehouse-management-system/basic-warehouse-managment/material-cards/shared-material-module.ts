import {NewMaterialCardComponent} from './new/new.component';
import {NgModule} from '@angular/core';
import {CalendarModule, CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ListMaterialCardComponent} from './list/list.component';
import {ModalModule} from 'ngx-bootstrap/modal';
import {EditMaterialCardComponent} from './edit/edit.component';
import { WareHouseAutoCompleteModule } from 'app/views/auto-completes/warehouse-auto-complete/warehouse-autocomplete-module';
import { MaterialPurchasingModule } from './purchasing/purchasing.module';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
import { QualityScreenSharedModule } from './quality-screen/quality-screen.module';
import { PalletScreenSharedModule } from './pallet/pallet-screen.module';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';
import { UnitAutoCompleteModule } from 'app/views/auto-completes/unit-auto-complete/unit-autocomplete-module';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { ChooseStockPaneComponent } from 'app/views/choose-panes/choose-stock-pane/choose-stock-pane.component';
import { MaterialCardsRouting } from './material-cards.routing';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';
import { ProductTreePaneModule } from 'app/views/choose-panes/choose-product-tree-pane/product-tree-pane.module';
import { CloneMaterialCardComponent } from './clone/clone.component';
import { CostCenterAutoCompleteModule } from 'app/views/auto-completes/cost-center-auto-complete/cost-center-autocomplete-module';
import { WarehouseLocationModule } from '../../advance-warehouse-management/warehouse-locations/warehouse-location.module';
import { StockStrategyComponent } from './stock-strategy/stock-strategy.component';
import { StockStrategyService } from 'app/services/dto-services/stock-stategy/stock-strategy.service';
import { StockAutoCompleteModule } from 'app/views/auto-completes/stock-auto-complete/stock-autocomplete-module';



@NgModule({
  imports: [
    CalendarModule,
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    MaterialCardsRouting,
    TooltipModule,
    KeyFilterModule,
    BatchAutoCompleteModule,
    UnitAutoCompleteModule,
    PlantAutoCompleteModule,
    CostCenterAutoCompleteModule,
    WareHouseAutoCompleteModule,
    MaterialPurchasingModule,
    CurrencyAutoCompleteModule,
    QualityScreenSharedModule,
    PalletScreenSharedModule,
    WarehouseLocationModule,
    StockAutoCompleteModule,
    ProductTreePaneModule
  ],
  declarations: [
    NewMaterialCardComponent,
    StockStrategyComponent,
    
    ListMaterialCardComponent,
    EditMaterialCardComponent,
    ChooseStockPaneComponent,
    CloneMaterialCardComponent
  ],
  providers: [
    PalletSettingsService,
    StockStrategyService
  ],
  exports: [
    ChooseStockPaneComponent,
    MaterialPurchasingModule
  ],
})
export class SharedMaterialModule {
}
