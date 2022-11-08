import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ModalDirective} from 'ngx-bootstrap/modal';

import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { SupplierListDto } from 'app/dto/customer/customer.model';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { BatchService } from 'app/services/dto-services/batch/batch.service';
import { CountryService } from 'app/services/dto-services/country/country.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { environment } from 'environments/environment';
/**
 * Created by reis on 11.06.2019.
 */
@Component({
  selector: 'batch-edit',
  templateUrl: './edit.component.html'
})
export class EditBatchComponent implements OnInit {
  batch = {
    'availableFrom': null,
    'batchCode': null,
    'batchId': null,
    batchLevel: null,
    requestedBy: null,
    'countryId': null,
    'createDate': null,
    'lastGoodsReceipt': null,
    'manufactureDate': null,
    'note': null,
    'plantId': null,
    'sledBbdDate': null,
    'stockId': null,
    'actId': null,
    'actType': null,
    'vendorBatch': null
  };
  SelectedBatchtype;
  id; // batch id
  disableDates = new Date();
  @Output() saveAction = new EventEmitter<any>();
  @ViewChild('myModal') public myModal: ModalDirective;
  @Input() noBatchRecords = false;
  listbatchLevel: any;
  employees: any;
  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };
  stock;
  material;
  plant;
  countries: any = [];
  selectedCountry: any;
  selectedStock: any = [];
  plants: any = [];
  vendorList: SupplierListDto[] = [];
  selectedVendor: SupplierListDto;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private _batchSrvc: BatchService,
    private _employeeSvc: EmployeeService,
    private enumService: EnumService,
    private countryService: CountryService,
    private actService: ActService) {
  }
  // batch;
  ngOnInit() {
    // this.plantService.getAllPlants().then(r => {
    //   this.plants = r;
    // });

    this.enumService.getBatchLevel().then((res: any) => {
      this.listbatchLevel = res;
    });
    this._employeeSvc.filter({ pageNumber: 1, pageSize: 1000 }).then(result => {
      this.employees = result['content'];
    }).catch(error => console.log(error));

  }

  private initialize(id) {
    this.batch.batchId = this.id;
    this.loaderService.showLoader();
    this._batchSrvc.getDetail(this.id).then(result => {
      this.loaderService.hideLoader();
      this.batch.batchCode = result['batchCode'];
      this.batch.countryId = result['countryId'];
      this.batch.actId = result['actId'];
      this.batch.actType = result['actType'] ? result['actType'] : null;
      this.batch.vendorBatch = result['vendorBatch'];
      this.batch.stockId = result['stockId'];
      this.batch.plantId = result['plantId'];
      this.batch.note = result['note'];
      this.batch.batchLevel = result['batchLevel'];
      this.batch.requestedBy = result['requestedByObj'] ? result['requestedByObj'].employeeId + '' : null;
      this.batch.availableFrom = (result['availableFrom'] && result['availableFrom'] !== 0) ? new Date(result['availableFrom']) : null;
      this.batch.manufactureDate = (result['manufactureDate'] && result['manufactureDate'] !== 0) ? new Date(result['manufactureDate']) : null;
      this.batch.lastGoodsReceipt = (result['lastGoodsReceipt'] && result['lastGoodsReceipt'] !== 0) ? new Date(result['lastGoodsReceipt']) : null;
      this.batch.createDate = result['createDate'] ? new Date(result['createDate']) : null;
      this.batch.sledBbdDate = result['sledBbdDate'] ? new Date(result['sledBbdDate']) : null;
      this.material = result['stockName'];
      this.plant = result['plantName'];

      if (result['vendorId'] && result['vendorName']) {
        this.selectedVendor = { actId: result['vendorId'], actName: result['vendorName'] };
      }
      // if (result['countryId'] && result['countryName']) {
      //   this.selectedCountry = {countryId: result['countryId'], countryName: result['countryName']};
      // }
      if (this.batch.actType === 'SUPPLIER') {
        this.SelectedBatchtype = '2';
        this.getSupplier();
      } else if (this.batch.actType === 'CUSTOMER') {
        this.SelectedBatchtype = '1';
        this.getCustomer();
      } else {
        this.SelectedBatchtype = '2';
        this.getSupplier();
      }
    }).then(() => {
      this.countryService.getIdNameList().then((r: any) => {
        this.selectedCountry = r.filter(cnt => this.batch.countryId === cnt.countryId)[0];
        this.countries = r;
      });
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  callCustomer(number: any) {
    this.vendorList = [];
    if (number === 2) {
      this.getSupplier();
      this.batch.actType = 'SUPPLIER';
    } else if (number === 1) {
      this.getCustomer();
      this.batch.actType = 'CUSTOMER';
    }
  }
  getSupplier() {
    this.actService.getActSupplier().
      then(res => {
        this.vendorList = res as SupplierListDto[];
        // this.vendorList
      })
      .catch(error => {
        this.utilities.showErrorToast(error);
      });
  }

  getCustomer() {
    this.actService.getActCustomer().
      then(res => { this.vendorList = res as SupplierListDto[] })
      .catch(error => {
        this.utilities.showErrorToast(error);
      });
  }
  goPage() {
    this._router.navigate(['/stocks/batch']);
  }

  reset() {

  }
  save() {
    this.loaderService.showLoader();
    if (this.selectedVendor) {
      this.batch.actId = this.selectedVendor.actId;
    }
    this.batch.countryId = this.selectedCountry ? this.selectedCountry.countryId : null;
    this._batchSrvc.update(this.batch)
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

  isValidString(data) {

    return data && data.length > 0 && data.trim();
  }

  cancel() {
    this.goPage();
  }

}
