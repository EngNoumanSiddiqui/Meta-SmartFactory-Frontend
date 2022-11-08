/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { NewProductTreeCriteriaComponent } from './new/new.component';
import { ProductTreeCriteriaService } from 'app/services/dto-services/product-tree/prod-tree-criteria.service';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [NewProductTreeCriteriaComponent],
  exports: [NewProductTreeCriteriaComponent],
  providers: [ProductTreeCriteriaService]
})
export class SharedProductTreeCriteriaModule {
}
