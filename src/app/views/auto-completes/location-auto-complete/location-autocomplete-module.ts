import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { LocationService } from 'app/services/dto-services/location/location.service';
import { LocationAutoCompleteComponent } from './location-auto-complete.component';
import { LocationModule } from 'app/views/production-settings/location/location.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    LocationModule,
  ],
  declarations: [
    LocationAutoCompleteComponent,
  ],
  exports: [
    LocationAutoCompleteComponent,
  ]
  ,
  providers: [
    LocationService
  ]
})
export class LocationAutoCompleteModule {
}
