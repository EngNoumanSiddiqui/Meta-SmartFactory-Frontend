import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrapCauseNewComponent } from './new/new.component';
import { ScrapCauseEditComponent } from './edit/edit.component';
import {ScrapCauseListComponent } from './list/list.component';
import { ConfirmDialogModule, ListboxModule, PickListModule, ColorPickerModule, AutoCompleteModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ImageModule } from 'app/views/image/image-module';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ScrapCauseRoutingModule } from './scrap-cause-routing';
import { ScrapCauseSharedModule } from './scrap-cause.shared.module';
@NgModule({
  declarations: [ScrapCauseNewComponent, ScrapCauseEditComponent, ScrapCauseListComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DassSharedModule,
    ImageModule,
    FormsModule,
    ListboxModule,
    ModalModule.forRoot(),
    PickListModule,
    TooltipModule,
    ColorPickerModule,
    AutoCompleteModule,
    ScrapCauseRoutingModule,
    ScrapCauseSharedModule
  ]
})
export class ScrapCauseModule { }
