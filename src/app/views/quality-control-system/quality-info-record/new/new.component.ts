import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'environments/environment';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { ActService } from 'app/services/dto-services/act/act.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'new-quality-info-record',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [ActService]

})
export class NewQualityInfoRecord {

  @Input() fromAutoComplete = false;
  @Input() plantId = null;

  @Output() saveAction = new EventEmitter<any>();

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

  actList;

  sub: Subscription;

  constructor(
    private loaderService: LoaderService,
    private utilities: UtilitiesService,
    private _qualityInfoRecordService: QualityInfoRecordService,
    private _actSvc: ActService,
    private _enumSvc: EnumService,
    private _appStateSvc: AppStateService
  ) {
    // this.sub = this._appStateSvc.plantAnnounced$.subscribe(res => {
    //   if (!(res)) {
    //     this.qualityInfoRecord.plant = null;
    //   } else {
    //     this.qualityInfoRecord.plant = res.plantName;
    //   }
    // });
  }

  ngOnInit() {
    this._actSvc.getActSupplier().then(result => this.actList = result).catch(error => console.log(error));
    this._enumSvc.getQualityBlockFunctionEnum().then((result: any) => this.blockFunctionLists = result);
  }

  setSelectedPlant(event) {
    console.log('@setSelectedPlant', event)
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
    console.log('@setSelectedVendor', vndr)

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
        // this.qualityInfoRecord.qualityInfoRecordId = result.qualityInfoRecordId;
        this.loaderService.hideLoader();
        this.qualityInfoRecord.qualityInfoRecordId = result['qualityInfoRecordId'];
        this.utilities.showSuccessToast('saved-success');
        setTimeout(() => {
          // this.activeTab = 1;
          this.saveAction.emit('close');
        }, environment.DELAY);
      },
      error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );


    // this._qualityInfoRecordService.save(this.qualityInfoRecord).subscribe(
    //   result => {
    //     this.qualityInfoRecord.qualityInfoRecordId = result.qualityInfoRecordId;
    //     this.loaderService.hideLoader();
    //     this.utilities.showSuccessToast('saved-success');
    //     setTimeout(() => {
    //       // this.saveAction.emit('close');
    //       this.activeTab = 1;
    //     }, environment.DELAY);
    //   },
    //   error => {
    //     this.utilities.showErrorToast(error);
    //     this.loaderService.hideLoader();
    //   }
    // );
  }

}
