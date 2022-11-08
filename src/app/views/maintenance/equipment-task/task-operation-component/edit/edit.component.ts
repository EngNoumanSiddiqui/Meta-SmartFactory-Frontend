import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {TaskOperationComponentService} from '../../../../../services/dto-services/maintenance-equipment/task-operation-component.service';
import { UsersService } from 'app/services/users/users.service';
/**
 * Created by reis on 31.07.2019.
 */

@Component({
  selector: 'task-operation-component-edit',
  templateUrl: './edit.component.html'
})
export class EditTaskOperationComponentComponent implements OnInit {

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
    equipmentTaskOperationComponentId: null,
    batch: null,
    plantId: null,
    equipmentTaskOperationId: null,
    stockId: null,
    componentQuantity: null,
    componentUnit: null
  };
  detailData;

  constructor(private _router: Router,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private mStrategyService: TaskOperationComponentService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.dataModel.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
    // this.initialize(this.id);
  }


  setSelectedStock(stock) {
    if (stock) {
      this.dataModel.stockId = stock.stockId;
    } else {
      this.dataModel.stockId = null;
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
          if (result['componentQuantity']) {
            this.dataModel.componentQuantity = result['componentQuantity'];
          }
          if (result['componentUnit']) {
            this.dataModel.componentUnit = result['componentUnit'];
          }
          if (result['equipmentTaskOperation']) {
            this.dataModel.equipmentTaskOperationId = result['equipmentTaskOperation'].equipmentTaskOperationId;
          }
          if (result['equipmentTaskOperationComponentId']) {
            this.dataModel.equipmentTaskOperationComponentId = result['equipmentTaskOperationComponentId'];
          }
          if (result['stock']) {
            this.dataModel.stockId = result['stock'].stockId;
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
      equipmentTaskOperationComponentId: null,
      batch: null,
      equipmentTaskOperationId: null,
      stockId: null,
      plantId: this.dataModel.plantId,
      componentQuantity: null,
      componentUnit: null
    };
    this.detailData = null;
    this.saveAction.emit('close');
  }
}
