import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { ActService } from 'app/services/dto-services/act/act.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { InspectionService } from 'app/services/dto-services/inspection-charateristics/inspection.service';
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { PlantService } from 'app/services/dto-services/plant/plant.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { EnumService } from 'app/services/dto-services/enum/enum.service';

import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  templateUrl: 'list.component.html',
  selector: 'quality-inspection-list',
  styleUrls: ['./list.component.scss']
})
export class ListInspectionComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;

  inspCharModal = {
    modal: null,
    data: null,
    id: null
  };

  selectedColumns = [
    { field: 'inspectionCharacteristicId', header: 'insp-char-id', index: 1 },
    { field: 'inspectionCharacteristicCode', header: 'insp-char-code', index: 2 },
    { field: 'inspectionCharacteristicName', header: 'insp-char-name', index: 3 },
    { field: 'versionNo', header: 'versionNo', index: 4 },
    { field: 'plant', header: 'plant', index: 5 },
    { field: 'qualityInspectionCharacteristicType', header: 'insp-char-type', index: 6 },
    { field: 'validFrom', header: 'valid-from', index: 7 },
    { field: 'inspectionCharacteristicShortText', header: 'short-text', index: 8 },
    { field: 'qualityInspectionCharacteristicStatus', header: 'status', index: 9 }
  ];
  cols = [
    { field: 'inspectionCharacteristicId', header: 'insp-char-id', index: 1 },
    { field: 'inspectionCharacteristicCode', header: 'insp-char-code', index: 2 },
    { field: 'inspectionCharacteristicName', header: 'insp-char-name', index: 3 },
    { field: 'versionNo', header: 'versionNo', index: 4 },
    { field: 'plant', header: 'plant', index: 5 },
    { field: 'qualityInspectionCharacteristicType', header: 'insp-char-type', index: 6 },
    { field: 'validFrom', header: 'valid-from', index: 7 },
    { field: 'inspectionCharacteristicShortText', header: 'short-text', index: 8 },
    { field: 'qualityInspectionCharacteristicStatus', header: 'status', index: 9 }

];

  showLoader = false;
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize)
      ? Number(environment.filterRowSize)
      : 10,
    query: null,
    orderByProperty: 'inspectionCharacteristicId',
    orderByDirection: 'desc',
    createDate: null,
    inspectionCharacteristicCode: null,
    inspectionCharacteristicId: null,
    inspectionCharacteristicName: null,
    inspectionCharacteristicShortText: null,
    inspectionCharacteristicStatus: null,
    inspectionCharacteristicTypeCode: null,
    plantId: null,
    plantName: null,
    qualityInspectionCharacteristicTypeId: null,
    updateDate: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  inspChars = [];
  selectedInspChars = []; 
  modal = { active: false };
  display = false; 
  inspCharsTypes = [];
  
  inspCharsStatus = [];

  private searchTerms = new Subject<any>();
  isSaveAndNew: boolean;
  sub: Subscription;

  SaveActionFire(isSaveAndNew: boolean) {
    this._actSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalShow(id, mod: string) {
    console.log('modalShow: id: mod:', id, mod)
    this.inspCharModal.id = id;
    this.inspCharModal.modal = mod;
    this.modal.active = true;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.inspCharModal.modal = mod;
    this.inspCharModal.data = data[0].stockId;
    this.modal.active = true;
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter);
    if (this.isSaveAndNew) {
      this.modal.active = true;
      this.inspCharModal.modal = 'NEW';
      myModal.show();
    }
    this.inspCharModal.id = null;
    this.isSaveAndNew = false;
    this.selectedInspChars = null;
  }
  constructor(
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _actSvc: ActService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _inspSvc: InspectionService,
    public plantService: PlantService,
    private _enumSvc: EnumService
  ) {
   
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._inspSvc.filterInspCharacteristic(term))).subscribe(
      (result: any) => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.inspChars = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.inspChars = [];
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      }
    );

    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
        this.pageFilter.plantName = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      }
      
    });

    this._enumSvc.getInspectionCharactericStatusEnum().then((res: any) => {
      this.inspCharsStatus = res;
    });
    this._enumSvc.getQualityInspectionCharacteristicTypeEnum().then((res: any) => {
      this.inspCharsTypes = res;
    })
  
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();
    this.searchTerms.next(data);
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  // FILTERING AREA
  filtingAreaColumns (event) {
    this.selectedColumns.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;

    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;
    this.pageFilter.query = this.pagination.tag;

    this.search(this.pageFilter);
  }

  reOrderData(id, item: string) {
    this.pageFilter.orderByProperty = item;

    if (this.classReOrder[id] === 'asc') {
      this.classReOrder[id] = 'desc';
    } else {
      this.classReOrder[id] = 'asc';
    }

    this.pageFilter.orderByDirection = this.classReOrder[id];
    this.filter(this.pageFilter);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize)
        ? Number(environment.filterRowSize)
        : 10,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      createDate: null,
      inspectionCharacteristicCode: null,
      inspectionCharacteristicId: null,
      inspectionCharacteristicName: null,
      inspectionCharacteristicShortText: null,
      inspectionCharacteristicStatus: null,
      inspectionCharacteristicTypeCode: null,
      plantId: null,
      plantName: null,
      qualityInspectionCharacteristicTypeId: null,
      updateDate: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      key: 'inspection-characteristic',
      accept: () => {
          this._inspSvc.delete(id).subscribe(
            result => {
              this.pagination.currentPage = result['currentPage'];
              this.pagination.totalElements = result['totalElements'];
              this.pagination.totalPages = result['totalPages'];
              this.inspChars = result['content'];
              this.loaderService.hideLoader();

              this.utilities.showSuccessToast('deleted-success');
              this.filter(this.pageFilter);
            },
            error => {
              this.utilities.showErrorToast(error);
              this.loaderService.hideLoader();
              this.inspChars = [];
            });
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    });
  }
}
