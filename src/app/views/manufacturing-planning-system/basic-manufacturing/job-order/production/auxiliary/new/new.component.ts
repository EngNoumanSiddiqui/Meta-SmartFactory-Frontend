import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
@Component({
  selector: 'auxiliary-component-new',
  templateUrl: './new.component.html'
})
export class AuxiliaryStockComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();

  @Input() direction;
  plantId = null;
  @Input('plantId') set plx(plantId) {
    if (plantId) {
      this.plantId = plantId;
    }
  }
  @Input('data') set x(data) {

    if (data) {
      if (data.requestJobOrderComponentFeatureList) {
        data.requestJobOrderComponentFeatureList.forEach(item => {
          if (item.productTreeCriteria) {
            item['productTreeCriteriaId'] = item.productTreeCriteria.productTreeCriteriaId;
          }
        })
      }
      this.dataModel = data;
    }
  };

  dataModel = {
    neededQuantity: 1,
    unit: null,
    jobOrderStockId: null,
    stockId: null,
    direction: 0,
    stockName: null,
    component: null,
    requestJobOrderComponentFeatureList: []

  };


  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {
    this.dataModel.direction = 0;
    console.log('DataModel', this.dataModel)
  }

  save() {

    if (this.direction) {
      this.dataModel.direction = this.direction;
    }

    if (!this.dataModel.stockId) {

      this.utilities.showWarningToast('component must be selected');
      return;
    }
    this.loaderService.showLoader();

    this.saveAction.emit(this.dataModel);
    this.loaderService.hideLoader();
    this.utilities.showSuccessToast('saved-success');


  }

  setSelectedStock(stock) {
    if (stock) {
      this.dataModel.stockId = stock.stockId;
      this.dataModel.stockName = stock.stockName;
      this.dataModel.component = stock;
      this.dataModel.unit = stock.baseUnit;
    } else {
      this.dataModel.stockId = null;
      this.dataModel.stockName = null;
      this.dataModel.component = null;
      this.dataModel.unit = null;
    }
  }

  featuresUpdated(event) {
    this.dataModel.requestJobOrderComponentFeatureList = event;
  }
}
