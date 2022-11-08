import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {environment} from '../../../../../../environments/environment';
import {TaskOperationComponentService} from '../../../../../services/dto-services/maintenance-equipment/task-operation-component.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'task-operation-component-new',
  templateUrl: './new.component.html'
})
export class NewTaskOperationComponentComponent implements OnInit {

  @Output() saveAction = new EventEmitter<any>();
  dataModel = {
    batch: null,
    equipmentTaskOperationId: null,
    stockId: null,
    plantId: null,
    componentQuantity: null,
    componentUnit: null
  };

  @Input() equipmentTaskOperationId;
  selectedPlant: any;

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
  save() {
    this.dataModel.equipmentTaskOperationId = this.equipmentTaskOperationId;
    this.loaderService.showLoader();
    this.mStrategyService.save(this.dataModel)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.equipmentTaskOperationId = null;
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
      equipmentTaskOperationId: null,
      stockId: null,
      plantId: this.dataModel.plantId,
      componentQuantity: null,
      componentUnit: null
    }
  }
}
