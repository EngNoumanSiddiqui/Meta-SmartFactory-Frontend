import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../shared/dass-shared.module';

import {ProgressSpinnerModule} from 'primeng';
import {MediaService} from '../../services/media/media.service';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import { ImageUploadV2Component } from './image-upload-v2/image-upload-v2.component';
import { ImageAdderV2Component } from './image-adder/image-adder.component';
import { ImageViewerV2Component } from './image-viewer/image-viewer.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    CarouselModule.forRoot(),
    ProgressSpinnerModule,
  ],
  declarations: [
    ImageAdderV2Component,
    ImageUploadV2Component,
    ImageViewerV2Component
  ],
  exports: [
    ImageAdderV2Component,
    ImageViewerV2Component
    // ImageAdderComponent,
    // ImageViewerComponent,
    // MediaChooserComponent
  ]
  ,
  providers: [
    MediaService
  ]
})
export class ImageV2Module {
}
