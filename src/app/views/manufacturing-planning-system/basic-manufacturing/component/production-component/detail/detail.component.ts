import {Component, Input, OnInit} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProductTreeComponentService } from 'app/services/dto-services/product-tree/prouduct-tree-component.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'product-tree-component-detail',
  templateUrl: './detail.component.html'
})
export class DetailProductTreeComponentComponent implements OnInit {

  @Input() manualProdOrder = false;
  @Input('data') set x(data) {
    if (data) {

      if (data.component) {
        data.componentId = data.component.stockId;
      }
      if (data.productTreeDetailComponentFeatureList) {
        data.productTreeDetailComponentFeatureList.forEach(item => {
          // const item = Object.assign({}, item);
          if (item.productTreeCriteria) {
            item['productTreeCriteriaId'] = item.productTreeCriteria.productTreeCriteriaId;
          }
        })
      }
      this.dataModel = JSON.parse(JSON.stringify(data));
      if(!data.extraProductionPercentage) {
        this.dataModel.extraProductionPercentage = 0;
      } else {
        this.dataModel.extraProductionPercentage = parseInt((this.dataModel.extraProductionPercentage * 100).toFixed(1))
      }
    }
  };


  dataModel;

  constructor(private loaderService: LoaderService,
              private _compSvc: ProductTreeComponentService,
              private utilities: UtilitiesService) {

  }

  ngOnInit() {

  }

  showProductTreeDetail(productTreeId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PRODUCTTREE, productTreeId);

  }
  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  featuresUpdated(event) {
    this.dataModel.productTreeDetailComponentFeatureList = event;
  }
}
