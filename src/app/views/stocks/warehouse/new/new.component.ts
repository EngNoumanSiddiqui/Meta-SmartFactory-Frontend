import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Message} from 'primeng';
import {WarehouseService} from '../../../../services/dto-services/warehouse/warehouse.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'warehouse-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewWareHouseComponent implements OnInit {
  msgs: Message[] = [];
@Output() saveAction = new EventEmitter<any>();
  wareHouse = {
    'wareHouseName': null,
    'wareHouseNo': null,
    'description': null,
    'plantId': null,
    'rework': false,
    'scrap': false,
    'parentId': null,
    'process': false,
    'purchase': false,
    factoryCalendarId: null,
    'quality': false,
    'sales': false,
    "defaultSelected": false
  };

  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };
  planningPlant: any;
  selectedPlant: any;


  constructor(private _router: Router,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _wareHouseSvc: WarehouseService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.wareHouse.plantId = this.selectedPlant.plantId;
                }
  }

  ngOnInit() {

  }

  formValid = (): boolean => {
    if (!this.wareHouse.wareHouseName) {
      return true
    }
    if (!this.wareHouse.scrap && !this.wareHouse.process && !this.wareHouse.sales && 
      !this.wareHouse.purchase && !this.wareHouse.quality && !this.wareHouse.rework ) {
      return true
    }
    return false;
  }


  reset() {
    this.wareHouse = {
      'wareHouseName': null,
      'wareHouseNo': null,
      'description': null,
      'plantId': null,
      'rework': false,
      'scrap': false,
      'parentId': null,
      factoryCalendarId: null,
      'process': false,
      'purchase': false,
      'quality': false,
      'sales': false,
      "defaultSelected": false
    };
  }

  goPage() {
    this._router.navigate(['/stocks/wareHouses']);
  }


  save() {

    // console.log('@beforeSave', this.wareHouse); return
    this.loaderService.showLoader();
    this._wareHouseSvc.save(this.wareHouse)
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

  onTypeChanged(prop, event) {
    // if (prop === 'scrap' && event === true) {
    //   this.wareHouse.rework = false;
    //   this.wareHouse.process = false;
    //   this.wareHouse.purchase = false;
    //   this.wareHouse.sales = false;
    //   this.wareHouse.quality = false;
    // }
    // if (prop === 'rework' && event === true) {
    //   this.wareHouse.scrap = false;
    //   this.wareHouse.process = false;
    //   this.wareHouse.purchase = false;
    //   this.wareHouse.sales = false;
    //   this.wareHouse.quality = false;
    // }
    // if (prop === 'process' && event === true) {
    //   this.wareHouse.scrap = false;
    //   this.wareHouse.rework = false;
    //   this.wareHouse.purchase = false;
    //   this.wareHouse.sales = false;
    //   this.wareHouse.quality = false;
    // }
    // if (prop === 'purchase' && event === true) {
    //   this.wareHouse.scrap = false;
    //   this.wareHouse.rework = false;
    //   this.wareHouse.process = false;
    //   this.wareHouse.sales = false;
    //   this.wareHouse.quality = false;
    // }
    // if (prop === 'sales' && event === true) {
    //   this.wareHouse.scrap = false;
    //   this.wareHouse.rework = false;
    //   this.wareHouse.process = false;
    //   this.wareHouse.purchase = false;
    //   this.wareHouse.quality = false;
    // }
    // if (prop === 'quality' && event === true) {
    //   this.wareHouse.scrap = false;
    //   this.wareHouse.rework = false;
    //   this.wareHouse.process = false;
    //   this.wareHouse.purchase = false;
    //   this.wareHouse.sales = false;
    // }
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
      this.wareHouse.plantId = selectedPlantEvent.plantId;
    } else {
      this.wareHouse.plantId = null;
    }
  }

  setSelectedWarehouse(event) {
    console.log('selectedWarehouse', event)
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.wareHouse.parentId = event.wareHouseId;
    } else {
      this.wareHouse.parentId = null;
    }

  }
}
