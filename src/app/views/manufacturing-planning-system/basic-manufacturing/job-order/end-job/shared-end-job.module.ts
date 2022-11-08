import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule, ConfirmDialogModule, TooltipModule } from 'primeng';
import { ListboxModule } from 'primeng/listbox';
import { DassSharedModule } from 'app/shared/dass-shared.module';
import { EndJobComponent } from './end-job.component';
import { EndJobProducedComponent } from './produced/produced.component';
import { BatchAutoCompleteModule } from 'app/views/auto-completes/batch-auto-complete/batch-autocomplete-module';

@NgModule({
    imports: [
        CommonModule,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule,
        ListboxModule,
        TooltipModule,
        AutoCompleteModule,
        DassSharedModule,
        BatchAutoCompleteModule
    ],
    declarations: [
        EndJobComponent,
        EndJobProducedComponent
    ],
    exports: [
        EndJobComponent,
        EndJobProducedComponent
    ],
    providers: [],

})

export class SharedEndJobModule {}
