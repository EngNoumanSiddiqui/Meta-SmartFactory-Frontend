import {Component, EventEmitter, OnInit, Output, Input, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { UsersService } from 'app/services/users/users.service';
import { SupplierListDto } from 'app/dto/customer/customer.model';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'batch-new',
  templateUrl: './new.component.html'
})
export class NewBatchComponent implements OnInit, OnDestroy {
  sub: Subscription;
  listbatchLevel = [];
  employees: any;

  @Input('batchLevel') set bLevel(batchLevel){
    if(batchLevel){
      this.batch.batchLevel = batchLevel;
    }
  }

  @Input('PORData') set z(PORData) {
    if (PORData) {
      this.batch = {
        'availableFrom': PORData.availableFrom,
        'batchCode': PORData.batchCode,
        // "batchId": PORData,
        'countryId': PORData.countryId,
        batchLevel: null,
        requestedBy: null,
        /*"createDate": PORData,*/
        'lastGoodsReceipt': PORData.lastGoodsReceipt,
        'manufactureDate': PORData.manufactureDate,
        'note': PORData.note,
        'plantId': PORData.plantId,
        'sledBbdDate': PORData.sledBbdDate,
        'stockId': PORData.stockId,
        'actId': PORData.actId,
        'actType' : PORData.actType,
        'vendorBatch': PORData.vendorBatch
      };
    }
  };


  batch = {
    'availableFrom': null,
    'batchCode': null,
    // "batchId": null,
    batchLevel: null,
    requestedBy: null,
    'countryId': null,
    /*"createDate": null,*/
    'lastGoodsReceipt': null,
    'manufactureDate': null,
    'note': null,
    'plantId': null,
    'sledBbdDate': '2019-06-19T21:00:00.000Z',
    'stockId': null,
    'actId': null,
    'actType' : null,
    'vendorBatch': null
  };

  disableDates = new Date();

  SelectedBatchtype = '1' ;

  @Output() saveAction = new EventEmitter<any>();
  @Input() noBatchRecords = false;
  params = {
    dialog: {title: '', inputValue: ''},

  };
  selectedStock: any;
  selectedPlant: any;
  selectedCountry: any;
  countries: any = [];
  vendorList: SupplierListDto[] = [];
  selectedVendor: SupplierListDto;

  constructor(
    private _router: Router,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _employeeSvc: EmployeeService,
    private _batchSrvc: BatchService,
  private countryService: CountryService,
  private appStateService: AppStateService,
  private enumService: EnumService,
  private _userSvc: UsersService,
    private actService: ActService) {
      this.batch.actType = 'CUSTOMER';

      const setPlant = this._userSvc.getPlant();
      this.selectedPlant = JSON.parse(setPlant);
      if (this.selectedPlant) {
        this.batch.plantId = this.selectedPlant.plantId;
      }

  }

  ngOnInit() {
    this.countryService.getIdNameList().then(r => {
      this.countries = r;
    });
    this.getCustomer();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.selectedPlant = null;
      } else {
        this.selectedPlant = res;
        this.batch.plantId = res.plantId;
      }
    });
    this.enumService.getBatchLevel().then((res: any) => {
      this.listbatchLevel = res;
    });
    this._employeeSvc.filter({ pageNumber: 1, pageSize: 1000, plantId: this.selectedPlant.plantId }).then(result => {
      this.employees = result['content'];
    }).catch(error => console.log(error));
    // this.actService.getActSupplier().
    // then(res => {this.vendorList = res as SupplierListDto[]})
    //   .catch(error => {  this.utilities.showErrorToast(error);
    //   });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getSupplier() {
    this.actService.getActSupplier().
    then(res => {this.vendorList = res as SupplierListDto[]})
      .catch(error => {  this.utilities.showErrorToast(error);
      });
  }

  getCustomer() {
    this.actService.getActCustomer().
    then(res => {this.vendorList = res as SupplierListDto[]})
      .catch(error => {  this.utilities.showErrorToast(error);
      });
  }
  selectStockDropdown(event) {
    // this.selectedStock = event;
    this.batch.stockId = event.stockId;
    this.batch.plantId = event.plantId;
  }
  callCustomer(type: any) {
   this.vendorList = []; // make this empty on every call
    // fil the vendorList according to checbox selection,for example if user click on customer
    // fill vendorList from
    if ( type === 2) {
      this.getSupplier();
      this.batch.actType = 'SUPPLIER';
    } else if ( type === 1) {
      this.getCustomer();
      this.batch.actType = 'CUSTOMER';
    } else {

    }
    // this.batch.actType = {id : type};
  }
  save() {

    // this.batch.stockId = this.selectedStock.stockId;
    // this.batch.plantId = this.selectedPlant.plantId;
    this.batch.countryId = this.selectedCountry ? this.selectedCountry.countryId : null;
    this.batch.actId = this.selectedVendor ? this.selectedVendor.actId : null;
    this.loaderService.showLoader();
    this._batchSrvc.save(this.batch)
      .then((result) => {
        this.loaderService.hideLoader();
        console.log('ok');
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.reset();
          // this.saveAction.emit('close');
          this.saveAction.emit(result);
          this.reset();
        }, environment.DELAY);
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  reset() {
   this.batch = {
      'availableFrom': null,
      'batchCode': null,
     // "batchId": null,
     'countryId': null,
      // "createDate": null,
      'lastGoodsReceipt': null,
      batchLevel: null,
      requestedBy: null,
      'manufactureDate': null,
      'note': null,
      'plantId': null,
      'sledBbdDate': null,
      'stockId': null,
      'actId': null,
      'actType' : null,
      'vendorBatch': null
    };
  }

}
/**
 * Created by reis on 11.06.2019.
 */
