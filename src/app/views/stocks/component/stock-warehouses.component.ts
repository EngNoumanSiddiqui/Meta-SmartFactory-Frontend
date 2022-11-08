import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoaderService} from '../../../services/shared/loader.service';
import {ResponseWareHouseStockFilterListDto} from '../../../dto/stock/stock-card.model';
import {WarehouseService} from '../../../services/dto-services/warehouse/warehouse.service';
import {UtilitiesService} from '../../../services/utilities.service';
@Component({
  selector: 'stock-warehouses',
  templateUrl: './stock-warehouses.component.html',
})
export class StockWarehousesComponent implements OnInit {

  warehouseList: ResponseWareHouseStockFilterListDto[];
  filterStock = {pageNumber: 1, pageSize: 20, stockId: null};

  @Input('stockId') set stock(stockId) {
    this.initialize(stockId);
  }

  @Output() selectAction = new EventEmitter<ResponseWareHouseStockFilterListDto>();


  constructor(private _wareHouseSvc: WarehouseService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService) {


  }

  private initialize(stockId) {
    this.filterStock.stockId = stockId;
    this.loaderService.showLoader();
    this._wareHouseSvc.filterStock(this.filterStock)
      .then(result => {
        this.loaderService.hideLoader();
        this.warehouseList = result['content'] as ResponseWareHouseStockFilterListDto[];
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.warehouseList = [];
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });


  }

  fireSelectedWarehouse(warehouse: ResponseWareHouseStockFilterListDto) {
    this.selectAction.next(warehouse);
  }

  ngOnInit() {
  }

}
