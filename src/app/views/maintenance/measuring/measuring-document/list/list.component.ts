import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { environment } from '../../../../../../environments/environment';
import { LoaderService } from '../../../../../services/shared/loader.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UtilitiesService } from '../../../../../services/utilities.service';
import { ConvertUtil } from '../../../../../util/convert-util';
import { MeasuringDocumentService } from '../../../../../services/dto-services/measuring/measuring-document.service';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../../../../services/dto-services/app-state.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMeasuringDocumentComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  measuringDocumentModal = {
    modal: null,
    id: null,
    data: null
  };
  dataModel = {
    'active': true,
    'counterReading': null,
    'employeeId': null,
    'measurementDocumentId': null,
    'equipmentCodeGroupHeaderId': null,
    'equipmentId': null,
    'equipmentMeasuringPointId': null,
    'measurementDate': null,
    'parameter': null,
    'valuationCode': '',
    plantId: null
  };

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };


  selectedColumns = [
    { field: 'measurementDocumentId', header: 'measuring-document-id' },
    { field: 'counterReading', header: 'counter-reading' },
    { field: 'employee', header: 'employee' },
    { field: 'equipmentMeasuringPointId', header: 'measuring-point-id' },
    { field: 'measurementDate', header: 'measuring-date' },
    { field: 'parameter', header: 'parameter' },
    { field: 'measurementPosition', header: 'measuring-position' },
    // { field: 'valuationCode', header: 'valuation-code' },
    { field: 'equipmentCodeGroupHeader', header: 'code-group-header' },
    { field: 'equipment', header: 'equipment' },
    // { field: 'maintenanceCharacteristic', header: 'characteristic' },
    // { field: 'characteristicUnit', header: 'characteristic-unit' },

  ];
  cols = [
    { field: 'measurementDocumentId', header: 'measuring-document-id' },
    { field: 'counterReading', header: 'counter-reading' },
    { field: 'employee', header: 'employee' },
    { field: 'equipmentMeasuringPointId', header: 'measuring-point-id' },
    { field: 'measurementDate', header: 'measuring-date' },
    { field: 'parameter', header: 'parameter' },
    { field: 'measurementPosition', header: 'measuring-position' },
    // { field: 'valuationCode', header: 'valuation-code' },
    { field: 'equipmentCodeGroupHeader', header: 'code-group-header' },
    { field: 'equipment', header: 'equipment' },
    // { field: 'maintenanceCharacteristic', header: 'characteristic' },
    // { field: 'characteristicUnit', header: 'characteristic-unit' },
  ];

  selectedMeasuringDocuments = [];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc',
    startMeasurementDate: null,
    finishMeasurementDate: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  measuringDocuments = [];
  showLoader = false;

  sub: Subscription;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    // this.pageFilter.startMeasurementDate = new Date();
    // this.pageFilter.finishMeasurementDate = new Date();
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {

    this.measuringDocumentModal.id = id;
    this.measuringDocumentModal.data = data;
    this.measuringDocumentModal.modal = mod;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _opSvc: MeasuringDocumentService,
    private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private appStateSvc: AppStateService) {

    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
      }
      this.pageFilter.startMeasurementDate = new Date();
      this.pageFilter.startMeasurementDate.setHours(0, 0, 0);
      this.pageFilter.finishMeasurementDate = new Date();
      this.pageFilter.finishMeasurementDate.setHours(23, 59, 0);
      this.filter(this.pageFilter);
    });
  }


  ngOnInit() {
    this.filter(this.pageFilter);
  }


  filter(data) {
    this.loaderService.showLoader();
    this._opSvc.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.measuringDocuments = result['content'];
        this.loaderService.hideLoader();
        console.log(result);
      })
      .catch(error => {
        this.loaderService.hideLoader();

        this.utilities.showErrorToast(error)
      });
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

    setTimeout(() => {
      this.filter(this.pageFilter)
    }, 500);
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
      pageSize: this.pageFilter.pageSize,
      plantId: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      startMeasurementDate: null,
      finishMeasurementDate: null
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this._opSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-measuringDocument');
      }
    })
  }


  showEditScreen() {
    this.measuringDocumentModal.id = this.measuringDocumentModal.data.measurementDocumentId;
    this.measuringDocumentModal.modal = 'EDIT';
  }
}
