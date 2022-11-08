import { debounceTime, switchMap } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { InspectionLotService } from 'app/services/dto-services/quality-inspection/inspection-lot.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { SalesOrderService } from 'app/services/dto-services/sales-order/sales-order.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { QualityInfoRecordService } from 'app/services/dto-services/quality-info-record/quality-info-record.service';
import { InspectionOperationsService } from 'app/services/dto-services/inspection-operations/inspection-operations.service';


@Component({
  selector: 'quality-inspection-lot-auto-complete',
  templateUrl: './quality-inspection-lot-auto-complete.component.html',

})

export class QualityInspectionLotAutoCompleteComponent implements OnInit, OnDestroy {

  @Output() selectedInspectionLotEvent = new EventEmitter();

  selectedInspectionLot;

  selectedInspectionLotId;

  disabled = false;

  sub: Subscription;

  @Input() dropdown = true;

  @Input() required: boolean;

  @Input() addIfMissing = false;


  @Input('selectedInspectionLot')
  set a(selectedInspectionLot) {
    this.selectedInspectionLot = selectedInspectionLot;
  }

  @Input('selectedInspectionLotId') set b(selectedInspectionLotId) {
    if (this.selectedInspectionLotId !== selectedInspectionLotId) {
      this.getNotificationDetail(selectedInspectionLotId);
      this.selectedInspectionLotId = selectedInspectionLotId;
    }
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }

  placeholder = 'no-data';

  modal = { active: false };

  filterInspectionLot;

  inspectionLotFilter = {
    batch: null,
    createDate: null,
    inspectionLotId: null,
    inspectionLotCode: null,
    inspectionLotStatus: null,
    lotCreatedOn: null,
    lotCreatedTo: null,
    orderId: null,
    plantId: null,
    plantName:null,
    jobOrderId: null,
    prodOrderId: null,
    qualityInfoRecordId: null,
    qualityInspectionOperationId: null,
    qualityInspectionTypeId: null,
    stockId: null,
    updateDate: null,
    vendorId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    pageNumber: 1,
    pageSize: 1000
  };


  allInspections;

  private searchTerms = new Subject<any>();

  inspectionLotNewDto = {
    batch: null,
    createDate: null,
    inspectionLotCode: null,
    inspectionLotId: null,
    inspectionLotStatus: null,
    jobOrderId: null,
    lotCreatedOn: null,
    lotCreatedTo: null,
    orderId: null,
    plantId: null,
    plantName: null,
    prodOrderId: null,
    qualityInfoRecordId: null,
    qualityInspectionOperationId: null,
    qualityInspectionTypeId: null,
    stockId: null,
    updateDate: null,
    vendorId: null
  };

  inspectionLotStatusList = [];

  orders: [] = [];

  jobOrders: [] = [];

  infoRecords: [] = [];

  inspectionOperations: [] = [];

  constructor(private loaderService: LoaderService,
    private _utilities: UtilitiesService,
    private _appStateService: AppStateService,
    private _inspectionLotSvc: InspectionLotService,
    private _enumSvc: EnumService,
    private _orderSvc: SalesOrderService,
    private _jobOrderSvc: JobOrderService,
    private _qualityInfoRecordSvc: QualityInfoRecordService,
    private _inspectionOperationsSvc: InspectionOperationsService) {
    

    
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspectionLotSvc.filterInspectionLot(this.inspectionLotFilter))).subscribe(
        cats => this.initResult(cats['content']),
        error2 => this.initResult([])
      );

    this.sub = this._appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.inspectionLotFilter.plantId = res.plantId;
        this.inspectionLotFilter.plantName = res.plantName;
        this.inspectionLotNewDto.plantId = res.plantId;
        this.inspectionLotNewDto.plantName = res.plantName;
        this.searchTerms.next(this.inspectionLotFilter);
      } else {
        this.inspectionLotFilter.plantId = null;
        this.inspectionLotFilter.plantName = null;
      }
      
    });
  }

  getNotificationDetail(qualityNotificationId) {
    if (qualityNotificationId) {
      this._inspectionLotSvc.detailInspectionLot(qualityNotificationId).then(rs => {
        this.selectedInspectionLot = rs;
        this.checkAndAddselectedInspectionLot();
      });
    }

  }
  modalShow() {
    this.modal.active = true;
  }

  save(mymodal: any) {
    this.loaderService.showLoader();
    this._inspectionLotSvc.saveInspectionLot(this.inspectionLotNewDto).then(
      (result: any) => {
        this.loaderService.hideLoader();
        this._utilities.showSuccessToast('saved-success');
        if (result) {
          this.selectedInspectionLot = result;
          this.allInspections.push(result);
          this.handleDropdownClickForNotification()
          this.onChangeNotification(this.selectedInspectionLot);
          this.inspectionLotNewDto = {
            createDate: null,
            plantId: this.inspectionLotFilter.plantId,
            plantName: this.inspectionLotFilter.plantName,
            batch: null,
            inspectionLotCode: null,
            inspectionLotId: null,
            inspectionLotStatus: null,
            jobOrderId: null,
            lotCreatedOn: null,
            lotCreatedTo: null,
            orderId: null,
            prodOrderId: null,
            qualityInfoRecordId: null,
            qualityInspectionOperationId: null,
            qualityInspectionTypeId: null,
            stockId: null,
            updateDate: null,
            vendorId: null
          };
          mymodal.hide();
        }
      },
      error => {
        this._utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

  }


  private checkAndAddselectedInspectionLot() {
    const me = this;
    if (this.selectedInspectionLot) {
      if (this.filterInspectionLot) {
        const ex = this.filterInspectionLot.find(it => it.inspectionLotId == me.selectedInspectionLot.inspectionLotId);
        const aex = this.allInspections.find(it => it.inspectionLotId == me.selectedInspectionLot.inspectionLotId);
        if (!aex) {
          this.filterInspectionLot.push(this.selectedInspectionLot);
          this.filterInspectionLot = [...this.filterInspectionLot];
        }
        if (!ex) {
          this.allInspections.push(this.selectedInspectionLot);
        }
      }
      this.selectedInspectionLotEvent.next(this.selectedInspectionLot);
    }
  }

  private initResult(res) {
    // this.filterInspectionLot = res;
    this.allInspections = res;
    if (res.length > 0) {
      this.placeholder = 'search-inspection-lot';
    } else {
      this.placeholder = 'no-data';

    }
    this.checkAndAddselectedInspectionLot();

  }


  onChangeNotification(event) {
    if (event && event.hasOwnProperty('inspectionLotId')) {

      this.selectedInspectionLotEvent.next(this.selectedInspectionLot);
    } else {
      this.selectedInspectionLotEvent.next(null);
    }
  }


  searchNotification(event) {

    this.filterInspectionLot = this.filterMatched(event.query);

  }


  handleDropdownClickForNotification() {

    this.filterInspectionLot = [...this.allInspections];

    if (this.filterInspectionLot.length == 0) {
      this.inspectionLotFilter.inspectionLotCode = null;
      this.searchTerms.next(this.inspectionLotFilter);
    }

  }


  filterMatched(query): any[] {


    const filtered: any[] = [];
    if (this.allInspections && this.allInspections.length > 0) {
      for (let i = 0; i < this.allInspections.length; i++) {
        const obj = this.allInspections[i];
        if (obj['inspectionLotCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.inspectionLotFilter.inspectionLotCode = query;
      this.searchTerms.next(this.inspectionLotFilter);
    }
    return filtered;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
