import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { FormsModule } from '@angular/forms';
import {ModalModule} from 'ngx-bootstrap/modal';
import { ProductTreePaneComponent } from './product-tree-pane.component';

@NgModule({
    imports: [
        CommonModule,
        ConfirmDialogModule,
        DassSharedModule,
        FormsModule,
        ModalModule.forRoot(),
    ],
    exports: [
        ProductTreePaneComponent
    ],
    declarations: [
        ProductTreePaneComponent
    ],
    providers: [],
})
export class ProductTreePaneModule { }
