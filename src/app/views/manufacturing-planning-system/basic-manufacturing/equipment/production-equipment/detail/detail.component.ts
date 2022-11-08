import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeEquipmentService } from 'app/services/dto-services/product-tree/prouduct-tree-equipment.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'product-tree-equipment-detail',
  templateUrl: './detail.component.html'
})
export class DetailProductTreeEquipmentComponent implements OnInit {


  dataModel;

  @Input('data') set x(data) {
    if (data) {
      if(data.stock) {
        data.stockId = data.stock.stockId;
      }
      this.dataModel = data;
    }
  };

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeEquipmentService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }


}
