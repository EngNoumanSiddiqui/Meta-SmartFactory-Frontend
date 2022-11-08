import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import {ModalModule} from 'ngx-bootstrap/modal';

//components
import { ScrapCauseDetailReworkComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ModalModule.forRoot(),
  ],
  declarations: [ ScrapCauseDetailReworkComponent ],
  exports: [ ScrapCauseDetailReworkComponent ]

})
export class ScrapReworkCauseSharedModule { }
