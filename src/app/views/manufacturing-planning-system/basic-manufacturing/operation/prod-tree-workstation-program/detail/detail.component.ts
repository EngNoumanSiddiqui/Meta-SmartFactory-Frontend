import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeComponentFeatureService } from 'app/services/dto-services/product-tree/product-tree-component-feature.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'product-tree-workstation-program-detail',
  templateUrl: './detail.component.html'
})
export class DetailProductTreeWorkstationProgramComponent implements OnInit {


  @Input() productTreeDetailId;
  @Input() productTreeDetailOperationId;

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
