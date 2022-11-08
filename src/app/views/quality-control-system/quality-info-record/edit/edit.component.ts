import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
 
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { environment } from 'environments/environment';
import {QualityInfoRecordService} from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';


@Component({
  selector: 'edit-quality-info-record',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditQualityInfoRecord {

  @Input() plantId = null;
  
  qualityInfoRecord = {
    createDate: null,
    plantId: null,
    purchaseOrderId: null,
    qualityInfoRecordCode: null,
    qualityInfoRecordId: null,
    stockId: null,
    updateDate: null,
    vendorId: null,
    quantityUnit:null,
    releaseDate: null,
    releaseQuantity: null,
    blockFunction: null,
    blockReason: null,
    inspCntrlId: null
  };

  blockFunctionLists = [];
  activeTab: number;

  id;

  @Input('id') set z(id) {
    this.id = id;
    if (id) {
      this.initialize(this.id);
    }
  };

  myModal;

  params = {
    cityDisabled: true,
    dialog: {
      title: '',
      inputText: '',
      inputValue: ''
    },
    displayDialog: false,
  };

  @Output() saveAction = new EventEmitter<any>();
  lastAccountNos;
  actList;
  selectedCustomer
  constructor(
              private _route: ActivatedRoute,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _actSvc: ActService,
              private _qualityInfoRecordService: QualityInfoRecordService,
              private _enumSvc: EnumService,
    ) {
  }

  ngOnInit() {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.qualityInfoRecord.qualityInfoRecordId = this.id;
        this.initialize(this.id);
      }
    });
    this._actSvc.getActSupplier().then(result => this.actList = result).catch(error => console.log(error));
    this._enumSvc.getQualityBlockFunctionEnum().then((result: any) => this.blockFunctionLists = result);
  }
 
  private initialize(id) {
    this.qualityInfoRecord.qualityInfoRecordId = this.id;
    this.loaderService.showLoader();

    this._qualityInfoRecordService.detailRecord(id).then(
      result => {
        this.selectedCustomer = {};
        // this.selectedCustomer = { actId: result.vendor, actName: result.vendor }
        
        this.loaderService.hideLoader();
        if ((result['qualityInfoRecordCode'])) {
          this.qualityInfoRecord.qualityInfoRecordCode = result['qualityInfoRecordCode'];
        }
        if ((result['stock'])) {
          this.qualityInfoRecord.stockId = result['stockId'];
        }
        
        if ((result['plant'])) {
          this.qualityInfoRecord.plantId = result['plantId'];
        }
        if ((result['vendorId'])) {
          this.qualityInfoRecord.vendorId = result['vendorId'];
        }
       
        if ((result['quantityUnit'])) {
          this.qualityInfoRecord.quantityUnit = result['quantityUnit'];
        }
       
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });
  }

  setSelectedPlant(event) {
    if (event) {
      this.qualityInfoRecord.plantId = event.plantId; 
    } else {
      this.qualityInfoRecord.plantId = null;
    }
  }
  selectQuantityUnit(quantityUnit) {
    this.qualityInfoRecord.quantityUnit = quantityUnit
  }
   selectMaterialChanged(event) { 
    if (event) {
      this.qualityInfoRecord.stockId = event.stockId;
    } else {
      this.qualityInfoRecord.stockId = null;
    }
  }
  setSelectedVendor(vndr) {
    console.log('checkCustomerService---', vndr);
    if (vndr) {
      this.qualityInfoRecord.vendorId = vndr.actId;
    } else {
      this.qualityInfoRecord.vendorId = null;
    }
  }

  save() {
    this.loaderService.showLoader();
    this.qualityInfoRecord.plantId = this.plantId;
    this._qualityInfoRecordService.saveRecord(this.qualityInfoRecord).then(
      result => {
        this.loaderService.hideLoader();
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          this.saveAction.emit('close');
          //this.activeTab = 1;
        }, environment.DELAY);
      },
      error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error);
      });
  }

  cancel() {
    this.saveAction.emit('close');
  }

}
