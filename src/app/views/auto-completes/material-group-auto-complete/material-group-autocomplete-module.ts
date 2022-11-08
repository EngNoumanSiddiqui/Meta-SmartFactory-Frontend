import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../../shared/dass-shared.module';

import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { LocationService } from 'app/services/dto-services/location/location.service';
import { MaterialGroupAutoCompleteComponent } from './material-group-auto-complete.component';
import { MaterialGroupsModule } from 'app/views/production-settings/material-group/material-group.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    MaterialGroupsModule,
  ],
  declarations: [
    MaterialGroupAutoCompleteComponent,
  ],
  exports: [
    MaterialGroupAutoCompleteComponent,
  ]
  ,
  providers: [
    LocationService
  ]
})
export class MaterialGroupAutoCompleteModule {
}
