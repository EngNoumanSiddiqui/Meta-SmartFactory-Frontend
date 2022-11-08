import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {MaintenanceOrderComponentService} from '../../../../../services/dto-services/maintenance-equipment/maintenance-order-component.service';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'maintenance-order-component-edit',
  templateUrl: './edit.component.html'
})
export class EditMaintenanceOrderComponentComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  dataModel = {
    maintenanceMaterialId: null,
    batch: null,
    maintenanceOrderId: null,
    stockId: null,
    stockName: null,
    quantity: null,
    quantityUnit: null,
    materialCost: null,
    finalCost: null
  };
  detailData;
  choosepaneModal = {active: false, modalType: null, }

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: MaintenanceOrderComponentService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
  }

  ngOnInit() {
    this.initialize(this.id);
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

  private initialize(id) {

    this.loaderService.showLoader();
    this.mStrategyService.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.detailData = result;
        if (result) {

          if (result['batch']) {
            this.dataModel.batch = result['batch'];
          }
          if (result['quantity']) {
            this.dataModel.quantity = result['quantity'];
          }
          if (result['quantityUnit']) {
            this.dataModel.quantityUnit = result['quantityUnit'];
          }
          if (result['materialCost']) {
            this.dataModel.materialCost = result['materialCost'];
          }
          if (result['finalCost']) {
            this.dataModel.finalCost = result['finalCost'];
          }
          if (result['maintenanceOrder']) {
            this.dataModel.maintenanceOrderId = result['maintenanceOrder'] ? result['maintenanceOrder'].maintenanceId : null;
          }
          if (result['maintenanceMaterialId']) {
            this.dataModel.maintenanceMaterialId = result['maintenanceMaterialId'];
          }
          if (result['stock']) {
            this.dataModel.stockId = result['stock'] ? result['stock'].stockId : null;
            this.dataModel.stockName = result['stock'] ? result['stock'].stockName : null;
          }
        }

      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  save() {
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.cancel();
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.dataModel = {
      maintenanceMaterialId: null,
      batch: null,
      maintenanceOrderId: null,
      stockId: null,
      stockName: null,
      quantity: null,
      quantityUnit: null,
      materialCost: null,
      finalCost: null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
