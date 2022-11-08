import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';

import {Subject, Subscription} from 'rxjs';
import {WarehouseService} from '../../../services/dto-services/warehouse/warehouse.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';


@Component({
  selector: 'warehouse-auto-complete',
  templateUrl: './warehouse-auto-complete.component.html',

})

export class WarehouseAutoCompleteComponent implements OnInit, OnDestroy {

  @Output() selectedWareHouseEvent = new EventEmitter<any>();
  selectedWareHouse: any;
  selectedWareHouseId: any;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() dropdown = true;
  sub: Subscription;
  @Input() addIfMissing = false;
  modal = {active: false};
  selectedPlant = null;
  isSetDefaultSelected: boolean = false;

  @Input('selectedWareHouse')  set in(selectedWareHouse) {
    this.selectedWareHouse = selectedWareHouse;
  }
  @Input('selectedWareHouseId')  set inId(selectedWareHouseId) {
    if (selectedWareHouseId) {
      this.selectedWareHouseId = +selectedWareHouseId;
      if(this.selectedWareHouse && this.selectedWareHouse.wareHouseId === this.selectedWareHouseId) {

      } else {
        this.getDetailWareHouse();
      }
    } else {
      this.selectedWareHouseId = null;
      this.selectedWareHouse = null;
    }
  }

  @Input('plantId')  set a(plantId) {
   if (plantId) {
    this.warehouseFilter.plantId = plantId;
    this.filteredWareHouse = null;
    this.allWarehouses = null;
    this.searchTerms.next(this.warehouseFilter);
   }
    
  }

  @Input('setDefaultSelected') set sfs(isSetDefaultSelected: boolean){
    this.isSetDefaultSelected = isSetDefaultSelected;
  }

  @Input('type')  set setType(type) {
    if (type && type === 'GOODS') {
      this.warehouseFilter.process = true;
      this.warehouseFilter.purchase = null;
      this.warehouseFilter.quality = null;
      this.warehouseFilter.query = null;
      this.warehouseFilter.rework = null;
      this.warehouseFilter.sales = null;
      this.warehouseFilter.scrap = null;

      this.searchTerms.next(this.warehouseFilter);
    } else if (type && type === 'SCRAP') {
      this.warehouseFilter.process = null;
      this.warehouseFilter.purchase = null;
      this.warehouseFilter.quality = null;
      this.warehouseFilter.query = null;
      this.warehouseFilter.rework = null;
      this.warehouseFilter.sales = null;
      this.warehouseFilter.scrap = true;

      this.searchTerms.next(this.warehouseFilter);
    } else if (type && type === 'REWORK') {
      this.warehouseFilter.process = null;
      this.warehouseFilter.purchase = null;
      this.warehouseFilter.quality = null;
      this.warehouseFilter.query = null;
      this.warehouseFilter.rework = true;
      this.warehouseFilter.sales = null;
      this.warehouseFilter.scrap = null;

      this.searchTerms.next(this.warehouseFilter);
    } else if (type && type === 'SALES') {
      this.warehouseFilter.process = null;
      this.warehouseFilter.purchase = null;
      this.warehouseFilter.quality = null;
      this.warehouseFilter.query = null;
      this.warehouseFilter.rework = null;
      this.warehouseFilter.sales = true;
      this.warehouseFilter.scrap = null;

      this.searchTerms.next(this.warehouseFilter);
    }else if (type && type === 'PURCHASE') {
      this.warehouseFilter.process = null;
      this.warehouseFilter.purchase = true;
      this.warehouseFilter.quality = null;
      this.warehouseFilter.query = null;
      this.warehouseFilter.rework = null;
      this.warehouseFilter.sales = null;
      this.warehouseFilter.scrap = null;

      this.searchTerms.next(this.warehouseFilter);
    }else if(type && type === 'DEFAULT'){
      this.warehouseFilter.process = null;
      this.warehouseFilter.purchase = null;
      this.warehouseFilter.quality = null;
      this.warehouseFilter.query = null;
      this.warehouseFilter.rework = null;
      this.warehouseFilter.sales = null;
      this.warehouseFilter.scrap = null;
      this.searchTerms.next(this.warehouseFilter);
      this.selectedWareHouse = null;
    }
     
   }
  eventFire = false;
  @Input('eventFire')
  set sdf(eventFire) {
    this.eventFire = eventFire;
    if (eventFire === true) {
      setTimeout(() => {
        if (this.selectedWareHouse) {
          this.selectedWareHouseEvent.next(this.selectedWareHouse);
        }
      }, 1000);
    }
  }

  placeholder = 'no-data';
  filteredWareHouse: Array<any>;

  warehouseFilter = {
    wareHouseId: null,
    wareHouseName: null,
    plantId: null,
    pageSize: 500,
    pageNumber: 1,
    process: null,
    purchase: null,
    quality: null,
    query: null,
    rework: null,
    sales: null,
    scrap: null,
    orderByProperty: 'wareHouseId',
    orderByDirection: 'desc'
  };
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
    'quality': false,
    'sales': false,
  };

  private allWarehouses: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private wareHouseService: WarehouseService,
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
     private appStateSvc: AppStateService) {
    
  }

  modalShow() {
    this.modal.active = true;
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.wareHouseService.filterObservable(this.warehouseFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    // this.searchTerms.next(this.warehouseFilter);
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.wareHouse.plantId  = res.plantId;
        this.warehouseFilter.plantId = res.plantId;
        this.searchTerms.next(this.warehouseFilter);
      } else {
        this.warehouseFilter.plantId = null;
      }
      
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private  initResult(res) {
    // this.filteredWareHouse = res;
    this.allWarehouses = res;
    
    if (res.length > 0) {
      // if (this.selectedWareHouseId) {
      //   const slctdwarehouse = (res as Array<any>).find(itm => this.selectedWareHouseId === itm.wareHouseId);
      //   this.selectedWareHouse = slctdwarehouse;
      // }
      this.placeholder = 'search-warehouse';
      if(this.isSetDefaultSelected){
        this.selectedWareHouse = this.allWarehouses.find(item => item.defaultSelected == true);
        this.onChangeWareHouse(this.selectedWareHouse);
      }
    } else {
      this.placeholder = 'no-data';

    }
  }

  getDetailWareHouse() {
    this.wareHouseService.getDetail(this.selectedWareHouseId).then(res => {
      this.selectedWareHouse = res;
      if(this.modal.active == true) {
        this.allWarehouses.unshift(this.selectedWareHouse);
        this.modal.active = false;
      }
    }).catch(Err => console.error(Err));
  }

  onChangeWareHouse(event) {
    console.log('@onChangeWarhouse', event);
    if (event && event.hasOwnProperty('wareHouseId')) {
      this.selectedWareHouseEvent.next(this.selectedWareHouse);
    } else {
      this.selectedWareHouseEvent.next(null);
    }
  }

  searchWareHouse(event) {
    this.filteredWareHouse = this.filterMatched(event.query);
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
  save() {

    this.loaderService.showLoader();
    this.wareHouseService.save(this.wareHouse)
      .then((result: any) => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        this.selectedWareHouseId = result;
        this.wareHouseService.getDetail(this.selectedWareHouseId).then(res => {
          this.selectedWareHouse = res;
          this.onChangeWareHouse(this.selectedWareHouse);
          if(this.modal.active == true) {
            this.allWarehouses.unshift(this.selectedWareHouse);
            this.modal.active = false;
          }
        }).catch(Err => console.error(Err));
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

  handleDropdownClickForWareHouse() {
    this.filteredWareHouse = [...this.allWarehouses];

    if (this.filteredWareHouse.length === 0) {
      this.warehouseFilter.wareHouseName = null;
      this.searchTerms.next(this.warehouseFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allWarehouses && this.allWarehouses.length > 0) {
      for (let i = 0; i < this.allWarehouses.length; i++) {
        const obj = this.allWarehouses[i];
        if (obj['wareHouseName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.warehouseFilter.wareHouseName = query;
      this.searchTerms.next(this.warehouseFilter);
    }
    return filtered;
  }
}
