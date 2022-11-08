import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'product-tree-quality-plan-operation',
  templateUrl: './detail.component.html'
})
export class ProductTreeQualityPlanOperationDetailComponent implements OnInit {


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
