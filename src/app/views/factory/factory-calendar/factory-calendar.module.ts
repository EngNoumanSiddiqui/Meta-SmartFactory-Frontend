import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { FactoryCalendarListComponent } from './list/list.component';
import { FactoryCalendarNewComponent } from './new/new.component';
import { FactoryCalendarDetailsComponent } from './details/details.component';
import { FactoryCalendarEditComponent } from './edit/edit.component';
import { CheckboxModule, ConfirmDialogModule, KeyFilterModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { PlantAutoCompleteModule } from 'app/views/auto-completes/plant-auto-complete/plant-autocomplete-module';
import { WorkStationAutoCompleteModule } from 'app/views/auto-completes/ws-auto-complete/workstation-autocomplete-module';

const routes: Route[] = [
  {path : '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: FactoryCalendarListComponent, data: {title: 'factory-calendar-list'}},
  {path: 'new', component: FactoryCalendarNewComponent, data: {title: 'factory-calendar-new'}},
  {path: 'details/:id', component: FactoryCalendarDetailsComponent, data: {title: 'factory-calendar-detail'}},
  {path: 'edit/:id', component: FactoryCalendarEditComponent, data: {title: 'factory-calendar-edit'}}
]
@NgModule({
  imports: [
    CommonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DassSharedModule,
    FormsModule,
    PlantAutoCompleteModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    WorkStationAutoCompleteModule,
    RouterModule.forChild(routes)
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    FactoryCalendarNewComponent, FactoryCalendarDetailsComponent,
    FactoryCalendarEditComponent, FactoryCalendarListComponent
  ], 
  exports: [
    FactoryCalendarDetailsComponent
  ]
})
export class FactoryCalendarModule { }
