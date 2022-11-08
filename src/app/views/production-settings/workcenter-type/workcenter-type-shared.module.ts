import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from '../../../shared/dass-shared.module';

//components
import { WorkCenterTypeDetailComponent } from './detail/detail.component';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
  ],
  declarations: [ WorkCenterTypeDetailComponent ],
  exports: [ WorkCenterTypeDetailComponent ],
  providers: []
})
export class WorkcenterTypeSharedModule {
}
