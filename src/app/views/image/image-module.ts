import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DassSharedModule} from '../../shared/dass-shared.module';

import {ProgressSpinnerModule} from 'primeng';
import {MediaService} from '../../services/media/media.service';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {CarouselModule} from 'ngx-bootstrap/carousel';

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
  ],
  exports: [
    // ImageAdderComponent,
    // ImageViewerComponent,
    // MediaChooserComponent
  ]
  ,
  providers: [
    MediaService
  ]
})
export class ImageModule {
}
