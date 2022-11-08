import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { LocationDetailComponent } from './detail/detail.component';
import { ConfirmDialogModule} from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { LocationRoutingModule } from './location-routing.module';
import { LocationService } from 'app/services/dto-services/location/location.service';

@NgModule({
  declarations: [ ListComponent, NewComponent, EditComponent, LocationDetailComponent ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    LocationRoutingModule,
    TooltipModule,
  ], 
  providers: [LocationService],
  exports: [NewComponent, LocationDetailComponent]
})
export class LocationModule { }
