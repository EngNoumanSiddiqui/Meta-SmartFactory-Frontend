import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { QualityControlSystemRoutingModule } from './quality-control-routing.module';
import { ConfirmDialogModule } from 'primeng';
@NgModule({
  imports: [
    CommonModule,
    QualityControlSystemRoutingModule,
    ConfirmDialogModule
    
  ],
  declarations: [],
  providers: [] 
})
export class QualityControlSystemModule {
}
