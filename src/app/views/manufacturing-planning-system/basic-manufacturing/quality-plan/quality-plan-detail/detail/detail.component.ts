import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'product-tree-quality-plan-detail',
  templateUrl: './detail.component.html'
})
export class ProductTreeQualityPlanDetailComponent implements OnInit {


  @Input() productTreeDetailId;
  @Input() productTreeDetailOperationId;

  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel;

  constructor() {}

  ngOnInit() {}

}
