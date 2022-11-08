import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, AutoCompleteModule, TreeTableModule, TableModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { PreferancesListComponent } from './list/list.component';
import { PreferenceRoutingModule } from './preference-routing.module';
import { PreferenceService } from 'app/services/dto-services/general-setting-services/preferences.service';
import { GeneralSettingItemService } from 'app/services/dto-services/general-setting-services/general-setting-item.service';
import { GeneralSettingItemValueService } from 'app/services/dto-services/general-setting-services/general-setting-item-value.service';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';

@NgModule({
  declarations: [
    PreferancesListComponent
  ],
  imports: [
    CommonModule,
    TreeTableModule,
    TableModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    AutoCompleteModule,
    PreferenceRoutingModule,
    DropdownModule,
    WorkStationAutoCompleteModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [PreferenceService,   GeneralSettingItemService,
    GeneralSettingItemValueService]
})
export class PreferenceModule { }
