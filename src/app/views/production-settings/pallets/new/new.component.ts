import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Message} from 'primeng';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';
import { PalletSettingsService } from 'app/services/dto-services/pallet/pallet-settings.service';

@Component({
  selector: 'pallet-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewPalletComponent implements OnInit {
  msgs: Message[] = [];
@Output() saveAction = new EventEmitter<any>();
  palletdto = {
    createDate: null,
    height: null,
    maxQuantity: null,
    minQuantity: null,
    variety:null,
    requirementPalletQuantityForForklift: null,
    maxBoxQuantity: null,
    operationId: null,
    palletCode: null,
    palletName: null,
    palletSettingId: null,
    plantId: null,
    updateDate: null,
    wareHouseId: null,
    reservedStockQuantity: null,
    width: null,
    currentStockQuantity: null,
  };


  varieties = ["BOX", "PALLET"];

  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };
  selectedPlant: any;
  selectedOperation: any;


  constructor(private _router: Router,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _palletSettingSvc: PalletSettingsService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.palletdto.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {
  }


  reset() {
    this.palletdto = {
      createDate: null,
      height: null,
      maxQuantity: null,
      minQuantity: null,
      operationId: null,
      palletCode: null,
      currentStockQuantity: null,
      reservedStockQuantity: null,
      palletName: null,
      palletSettingId: null,
      plantId: null,
      updateDate: null,
      variety:null,
      requirementPalletQuantityForForklift: null,
      maxBoxQuantity: null,
      wareHouseId: null,
      width: null,
    };
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
      .then(result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.reset();
         this.saveAction.emit(result);
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  /************************* TOASTR & PRIME NG Messages  *************************/
  // Prime NG Growl in other ways Toaster
  showMessage(severity: string, summary: string, detail: string) {
    this.msgs.push({
      severity: severity,
      summary: this._translateSvc.instant(summary),
      detail: this._translateSvc.instant(detail)
    });
    setTimeout(() => {
      this.clearMessage();
    }, 1500);
  }

  clearMessage() {
    this.msgs = [];
  }

  showError(error) {
    let mess = '';
    if (error.toString().indexOf('fieldErrors') > 0) {
      error = JSON.parse(error);
    }
    if (error['fieldErrors'] && error['fieldErrors'].length > 0) {
      for (const msg of error['fieldErrors']) {
        mess += this.msgs + '<strong>' + msg['field'].toString() + '</strong> :' + msg['message'].toString() + '</br>';
      }
      this.showMessage('error', 'error', mess);
    } else if (error['errorCode']) {
      this.showMessage('error', 'error', error['errorCode']);
    } else {
      this.showMessage('error', 'error', error);
    }
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
