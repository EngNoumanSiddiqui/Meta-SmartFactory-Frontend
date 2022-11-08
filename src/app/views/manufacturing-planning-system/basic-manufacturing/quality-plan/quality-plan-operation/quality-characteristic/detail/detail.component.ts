import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'product-tree-quality-plan-characteristic-detail',
  templateUrl: './detail.component.html'
})
export class ProductTreeQualityPlanCharacteristicDetailComponent implements OnInit {


  @Input() productTreeDetailId;
  @Input() productTreeDetailOperationId;

  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel;

  constructor() {
  }

  ngOnInit() {

  }


}
