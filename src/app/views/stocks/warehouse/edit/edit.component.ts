import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
 
import {WarehouseService} from '../../../../services/dto-services/warehouse/warehouse.service';
import {LoaderService} from '../../../../services/shared/loader.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {environment} from '../../../../../environments/environment';
import { UsersService } from 'app/services/users/users.service';

@Component({
  selector: 'warehouse-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditWareHouseComponent implements OnInit {
  wareHouse = {
    wareHouseId: null,
    'wareHouseName': null,
    'wareHouseNo': null,
    'description': null,
    'plantId': null,
    'rework': false,
    factoryCalendarId: null,
    'scrap': false,
    'parentId': null,
    'process': false,
    'purchase': false,
    'quality': false,
    'sales': false,
    "defaultSelected": false

  };

  params = {
    buttonDisabled: false,
    dialog: {title: '', inputValue: ''}
  };
  @Output() saveAction = new EventEmitter<any>();
  id;
  selectedPlant: any;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private _wareHouseSvc: WarehouseService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                // if (this.selectedPlant) {
                //   this.wareHouse.plantId = this.selectedPlant.plantId;
                // }
    /*  this._route.params.subscribe((params) => {
     this.id = params['id'];
     this.wareHouse.wareHouseId = this.id;
     this.initialize(this.id);
     });*/
  }

  private initialize(id) {
    this.loaderService.showLoader();
    this._wareHouseSvc.getDetail(id)
      .then(result => {
        this.loaderService.hideLoader();
        this.wareHouse = {
          'wareHouseId': result['wareHouseId'],
          'wareHouseNo': result['wareHouseNo'],
          'wareHouseName': result['wareHouseName'],
          'plantId': result['plantId'],
          'description': result['description'],
          'rework': result['rework'],
          'scrap': result['scrap'],
          factoryCalendarId: result['factoryCalendar'] ? result['factoryCalendar'].factoryCalendarId : null,
          'parentId': result['parentId'],
          'process': result['process'] ,
          'purchase': result['purchase'] ,
          'quality': result['quality'] ,
          'sales': result['sales'] ,
          "defaultSelected": result['defaultSelected']
        };
      }).then()
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
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
  goPage() {
    this._router.navigate(['/stocks/wareHouses']);
  }


  save() {

    this.loaderService.showLoader();
    this._wareHouseSvc.update(this.wareHouse)
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


}
