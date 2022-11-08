import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoCompleteModule, ConfirmDialogModule, TooltipModule} from 'primeng';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {ListboxModule} from 'primeng/listbox';
import {ImageModule} from '../../image/image-module';
import {DetailWorkstationComponent} from './detail/detail.component';
import { BasicDetailComponent } from './detail/basic-detail/basic-detail.component';
import { CapacityDetailComponent } from './detail/capacity-detail/capacity-detail.component';
import { WorkstationGroupsComponent } from './workstation-groups/workstation-groups.component';
import { MaterialGroupAutoCompleteModule } from 'app/views/auto-completes/material-group-auto-complete/material-group-autocomplete-module';
@NgModule({
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    TooltipModule,
    AutoCompleteModule,
    MaterialGroupAutoCompleteModule
  ],
  declarations: [
    DetailWorkstationComponent, BasicDetailComponent,WorkstationGroupsComponent,
    CapacityDetailComponent
  ],
  providers: [],
  exports: [MaterialGroupAutoCompleteModule, DetailWorkstationComponent, BasicDetailComponent,
    CapacityDetailComponent, WorkstationGroupsComponent]
})
export class SharedWorkstationModule {
}
