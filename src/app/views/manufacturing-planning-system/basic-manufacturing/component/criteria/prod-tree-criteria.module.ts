/**
 * Created by reis on 29.07.2019.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CheckboxModule, ConfirmDialogModule, KeyFilterModule, TooltipModule} from 'primeng';
import {FormsModule} from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import {ProductTreeCriteriaModuleRoutes} from './prod-tree-criteria-routing.module';
import {SharedProductTreeCriteriaModule} from './shared-prod-tree-criteria.module';
import {ProductTreeCriteriaListComponent} from './list/list.component';
import {EditProductTreeCriteriaComponent} from './edit/edit.component';
import {ProductTreeCriteriaDetailComponent} from './detail/detail.component';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { ProductTreeCriteriaService } from 'app/services/dto-services/product-tree/prod-tree-criteria.service';


@NgModule({
  imports: [
    CheckboxModule,
    ConfirmDialogModule,
    CommonModule,
    DassSharedModule,
    FormsModule,
    ModalModule.forRoot(),
    TooltipModule,
    KeyFilterModule,
    ProductTreeCriteriaModuleRoutes,
    SharedProductTreeCriteriaModule
  ],
  declarations: [ProductTreeCriteriaListComponent, EditProductTreeCriteriaComponent, ProductTreeCriteriaDetailComponent],
  providers: [ProductTreeCriteriaService]
})
export class ProductTreeCriteriaModule {
}
