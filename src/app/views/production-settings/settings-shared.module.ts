import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';

//COMPONENTS
import { WorkStationTypeDetailComponent } from './workstation-type/detail/detail.component';
import { WorkStationCategoryDetailComponent } from './workstation-category/detail/detail.component';
import { OperationTypeDetailComponent } from './operation-type/detail/detail.component';
import { OperationTypeWsDetailComponent } from './operation-type-to-ws-type/detail/detail.component';
 

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
  ],
  declarations: [ 
    WorkStationTypeDetailComponent,
    WorkStationCategoryDetailComponent,
    OperationTypeDetailComponent,
    OperationTypeWsDetailComponent 
  ],
  exports: [ 
    WorkStationTypeDetailComponent,
    WorkStationCategoryDetailComponent,
    OperationTypeDetailComponent,
    OperationTypeWsDetailComponent 
  ],
  providers: []
})

export class SettingsSharedModule {
}
