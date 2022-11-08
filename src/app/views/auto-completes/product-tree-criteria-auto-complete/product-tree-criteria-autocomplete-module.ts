import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DassSharedModule} from '../../../shared/dass-shared.module';
import {AutoCompleteModule} from 'primeng';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ProductTreeCriteriaAutoCompleteComponent} from './product-tree-criteria-auto-complete.component';
import {ProductTreeCriteriaService} from '../../../services/dto-services/product-tree/prod-tree-criteria.service';
import { SharedProductTreeCriteriaModule } from 'app/views/manufacturing-planning-system/basic-manufacturing/component/criteria/shared-prod-tree-criteria.module';

@NgModule({
  imports: [
    CommonModule,
    DassSharedModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
    ModalModule.forRoot(),
    SharedProductTreeCriteriaModule
  ],
  declarations: [
    ProductTreeCriteriaAutoCompleteComponent,
  ],
  exports: [
    ProductTreeCriteriaAutoCompleteComponent,
  ]
  ,
  providers: [ProductTreeCriteriaService

  ]
})
export class ProductTreeCriteriaAutoCompleteModule {
}
