import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng';
import {ModalModule} from 'ngx-bootstrap/modal';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { CityDetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    CityDetailComponent
  ],
  exports: [CityDetailComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),

  ],
  providers: [CountryService]
})
export class SharedCityModule { }
