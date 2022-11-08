import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DassSharedModule } from 'app/shared/dass-shared.module';
//components
import { CountryDetailComponent } from './detail/detail.component';

@NgModule({
    imports: [ CommonModule, DassSharedModule ],
    declarations: [ CountryDetailComponent ],
    exports: [ CountryDetailComponent ],
    providers: []
})
export class CountrySharedModule { }
