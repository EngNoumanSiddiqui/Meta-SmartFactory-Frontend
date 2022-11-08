import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';

@Component({
  selector: 'pallet-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditPalletComponent implements OnInit {
  varieties = ["BOX", "PALLET"];
  palletdto = {
    createDate: null,
    height: null,
    maxQuantity: null,
    reservedStockQuantity: null,
    minQuantity: null,
     variety:null,
      requirementPalletQuantityForForklift: null,
      maxBoxQuantity: null,
    currentStockQuantity: null,
    operationId: null,
    palletCode: null,
    palletName: null,
    palletSettingId: null,
    plantId: null,
    updateDate: null,
    wareHouseId: null,
    width: null,
  };
  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };
  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;
  selectedOperation: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  planningPlant: any;

  constructor(private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _palletSettingSvc: PalletSettingsService) {
      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._palletSettingSvc.getDetail(id)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.palletdto = {
          createDate: result.createDate,
          height: result.height,
          maxQuantity: result.maxQuantity,
          minQuantity: result.minQuantity,
          currentStockQuantity: result.currentStockQuantity,
          reservedStockQuantity: result.reservedStockQuantity,
          operationId: result.operation ? result.operation.operationId : null,
          palletCode: result.palletCode,
          palletName: result.palletName,
          variety: result.variety,
          requirementPalletQuantityForForklift: result.requirementPalletQuantityForForklift,
          maxBoxQuantity: result.maxBoxQuantity,
          palletSettingId: result.palletSettingId,
          plantId: result.plant ? result.plant.plantId : this.selectedPlant.plantId,
          updateDate: result.updateDate,
          wareHouseId: result.wareHouse ? result.wareHouse.wareHouseId : null,
          width: result.width,
        };
        this.selectedOperation = result.operation ? result.operation : null;
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  ngOnInit() {
  }
  setSelectedOperation(operation) {
    if (operation) {
      this.palletdto.operationId = operation.operationId;
      this.selectedOperation = operation;
    } else {
      this.palletdto.operationId = null;
      this.selectedOperation = null;
    }
  }

  save() {

    this.loaderService.showLoader();
    this._palletSettingSvc.save(this.palletdto)
      .then(() => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('updated-success');
        setTimeout(() => {
          this.saveAction.emit('close');
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  setSelectedPlant(selectedPlantEvent) {
    if (selectedPlantEvent) {
      this.selectedPlant = selectedPlantEvent;
      this.palletdto.plantId = selectedPlantEvent.plantId;
    } else {
      this.palletdto.plantId = null;
    }
  }
  setSelectedWarehouse(wareHouse) {
    if (wareHouse) {
      this.palletdto.wareHouseId = wareHouse.wareHouseId;
    } else {
      this.palletdto.wareHouseId = null;
    }
  }


}
