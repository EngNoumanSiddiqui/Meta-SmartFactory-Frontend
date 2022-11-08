import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeComponentFeatureService } from 'app/services/dto-services/product-tree/product-tree-component-feature.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'prod-tree-component-feature-detail',
  templateUrl: './detail.component.html'
})
export class DetailProductTreeComponentFeatureComponent implements OnInit {


  @Input('data') set x(data) {
    if (data) {
      this.dataModel = data;
    }
  };


  dataModel;

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeComponentFeatureService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }
}
