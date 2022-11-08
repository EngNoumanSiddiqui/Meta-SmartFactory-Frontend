import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewComponent} from './new/new.component';
import {DetailComponent} from './detail/detail.component';
import {AutoCompleteModule, ConfirmDialogModule, ListboxModule} from 'primeng';
import {DassSharedModule} from 'app/shared/dass-shared.module';
import {ImageModule} from 'app/views/image/image-module';
import {FormsModule} from '@angular/forms';
import { CompanyService } from 'app/services/dto-services/company/company.service';
import { EditComponent } from './edit/edit.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { CurrencyAutoCompleteModule } from 'app/views/auto-completes/currency-auto-complete/currency-autocomplete-module';
@NgModule({
  declarations: [NewComponent, DetailComponent, EditComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    TooltipModule,
    CurrencyAutoCompleteModule,
    AutoCompleteModule
  ],
  exports: [
    NewComponent,
    DetailComponent,
    EditComponent
  ], providers: [CompanyService]
})
export class SharedPlantModule {
}
