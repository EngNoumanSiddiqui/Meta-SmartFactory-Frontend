import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceOrderComponentService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order-component.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'maintenance-order-component-new',
  templateUrl: './new.component.html'
})
export class NewMaintenanceOrderComponentComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    batch: null,
    maintenanceOrderId: null,
    stockId: null,
    stockName: null,
    quantity: 1,
    quantityUnit: null,
    materialCost: null,
    finalCost: null
  };

  @Input() maintenanceOrderId;

  choosepaneModal = {active: false, modalType: null, }
  selectedPlant: any;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: MaintenanceOrderComponentService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
  }

  ngOnInit() {
  }

  setSelectedStock(stock) {
    if (stock) {
      this.dataModel.stockId = stock.stockId;
      this.dataModel.stockName = stock.stockName;
      this.dataModel.quantityUnit = stock.baseUnit;
    } else {
      this.dataModel.stockId = null;
      this.dataModel.stockName = null;
      this.dataModel.quantityUnit = null;
    }
  }
  setSelectedBatch(batch) {
    if (batch) {
      this.dataModel.batch = batch.batchCode;
    } else {
      this.dataModel.batch = null;
    }
  }
  save() {
    this.dataModel.maintenanceOrderId = this.maintenanceOrderId;
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.maintenanceOrderId = null;
          this.reset();
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {

    this.dataModel = {
      batch: null,
      maintenanceOrderId: null,
      stockId: null,
      stockName: null,
      quantity: null,
      quantityUnit: null,
      materialCost: null,
      finalCost: null
    }
  }
}
