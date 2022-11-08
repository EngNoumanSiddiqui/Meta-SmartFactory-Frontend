import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { UtilitiesService } from 'app/services/utilities.service';

@Component({
  selector: 'app-new-advance-stock-report',
  templateUrl: './new.component.html'
})
export class NewAdvanceStockReportsComponent implements OnInit {
  @Output() saveAction = new EventEmitter<any>();
  dataModal = {
    barcode: null,
    batch: null,
    bayNo: null,
    binNo: null,
    defected: null,
    dimensionUnit: null,
    freeze: null,
    height: null,
    integrationUpdateDate: null,
    locationNo: null,
    locationType: null,
    locationTypeDb: null,
    plantId: null,
    quantity: null,
    reservedQuantity: null,
    rowNo: null,
    stockId: null,
    tierNo: null,
    transferQuantity: null,
    warehouseId: null,
    warehouseStockId: null,
    width: null,
  }
  selectedPlant: any;

  modal = {active: false};

  constructor(private _userSvc: UsersService,
    private stockCardService: StockCardService,
    private utitlityservice: UtilitiesService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    this.dataModal.plantId = this.selectedPlant ? this.selectedPlant.plantId : null;
  }


  onSelectWarehouseLocation(event) {
    if(event) {
      this.dataModal.locationNo = event?.warehouseLocationNo;
    }
  }


  reset() {
    this.dataModal = {
      barcode: null,
      batch: null,
      bayNo: null,
      binNo: null,
      defected: null,
      dimensionUnit: null,
      freeze: null,
      height: null,
      integrationUpdateDate: null,
      locationNo: null,
      locationType: null,
      locationTypeDb: null,
      plantId: this.selectedPlant?.plantId,
      quantity: null,
      reservedQuantity: null,
      rowNo: null,
      stockId: null,
      tierNo: null,
      transferQuantity: null,
      warehouseId: null,
      warehouseStockId: null,
      width: null,
    }
  }


  save() {
    this.loaderService.showLoader();
    this.stockCardService.saveWarehouseStock(this.dataModal).then(res => {
      this.utitlityservice.showSuccessToast('successfully-saved');
      this.loaderService.hideLoader();
      this.saveAction.emit(res);
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utitlityservice.showErrorToast(err, 'Something went wrong!');
    })
  }
  

}
