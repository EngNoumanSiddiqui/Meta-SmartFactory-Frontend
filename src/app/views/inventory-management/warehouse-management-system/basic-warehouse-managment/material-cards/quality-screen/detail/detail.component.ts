import { Component, Input } from '@angular/core';

@Component({
    selector: 'quality-screen-detail',
    templateUrl: './detail.component.html',
})
export class QualityScreenDetailComponent {

    stock: any;

    @Input('stock') set st(data) {
        this.stock = data;
        console.log('@qualityScreenDetail', this.stock)
    }

    constructor() { }

    ngOnInit() {}

}