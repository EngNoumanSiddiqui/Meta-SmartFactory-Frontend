import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { DropdownModule } from 'primeng/dropdown';
import { CountryRoutingModule } from './country-routing.module';
import { CountrySharedModule } from './country-shared.module';
//services
import { CountryService } from 'app/services/dto-services/country/country.service';
//components
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    ListComponent, NewComponent, EditComponent
  ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    AutoCompleteModule,
    CountryRoutingModule,
    DropdownModule,
    CountrySharedModule
  ],
  providers: [CountryService]
})
export class CountryModule { }
