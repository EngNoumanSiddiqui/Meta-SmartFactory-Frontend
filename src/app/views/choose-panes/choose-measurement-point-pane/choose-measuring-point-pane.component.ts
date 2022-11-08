import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators'
import {environment} from '../../../../environments/environment';
import {MeasuringPointService} from '../../../services/dto-services/measuring/measuring-point.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {LoaderService} from '../../../services/shared/loader.service';
import {ConvertUtil} from '../../../util/convert-util';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'choose-measuring-point-pane',
  templateUrl: './choose-measuring-point-pane.component.html',
  styleUrls: ['./choose-measuring-point-pane.component.scss']
})
export class ChooseMeasuringPointPaneComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  selectedPlant: any;

  @Input('plantId') set plantIds(plantId) {
    if (plantId) {
      this.pageFilter.plantId = plantId;
      this.searchTerms.next(this.pageFilter);
    } else {
      this.pageFilter.plantId = null;
    }
  }

  measuringPointModal = {
    modal: null,
    id: null
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
    {field: 'equipmentMeasuringPointId', header: 'measuring-point-id'},
    {field: 'annualEstimate', header: 'annual-estimate'},
    {field: 'countBackwards', header: 'count-backwards'},
    {field: 'counterOverflowReading', header: 'counter-overflow-reading'},
    {field: 'targetValue', header: 'target-value'},
    {field: 'targetValueText', header: 'target-value-text'},
    {field: 'decimalPlaces', header: 'decimal-places'},
    {field: 'equipmentMeasuringPointNo', header: 'measuring-point-no'},
    {field: 'measurementPosition', header: 'measuring-position'},
    {field: 'measuringPointIsCounter', header: 'measuring-point-counter'},
    {field: 'codeGroup', header: 'code-group'},
    {field: 'equipmentCodeGroupHeader', header: 'code-group-header'},
    {field: 'equipment', header: 'equipment'},
    {field: 'maintenanceCharacteristic', header: 'characteristic'},
    {field: 'characteristicUnit', header: 'characteristic-unit'},

  ];
  cols = [
    {field: 'equipmentMeasuringPointId', header: 'measuring-point-id'},
    {field: 'annualEstimate', header: 'annual-estimate'},
    {field: 'countBackwards', header: 'count-backwards'},
    {field: 'counterOverflowReading', header: 'counter-overflow-reading'},
    {field: 'decimalPlaces', header: 'decimal-places'},
    {field: 'equipmentMeasuringPointNo', header: 'measuring-point-no'},
    {field: 'measurementPosition', header: 'measuring-position'},
    {field: 'measuringPointIsCounter', header: 'measuring-point-counter'},
    {field: 'codeGroup', header: 'code-group'},
    {field: 'equipmentCodeGroupHeader', header: 'code-group-header'},
    {field: 'equipment', header: 'equipment'},
    {field: 'maintenanceCharacteristic', header: 'characteristic'},
    {field: 'characteristicUnit', header: 'characteristic-unit'},
    {field: 'targetValue', header: 'target-value'},
    {field: 'targetValueText', header: 'target-value-text'},
  ];

  @Input() selectedMeasuringPoint;
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plantId: null,
    query: null,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  private searchTerms = new Subject<any>();
  measuringPoints = [];
  showLoader = false;
  @Output() selectedEvent = new EventEmitter();


  constructor(private _opSvc: MeasuringPointService,
              private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private _userSvc: UsersService,
              private loaderService: LoaderService) {
                const setPlant = this._userSvc.getPlant();
                this.selectedPlant = JSON.parse(setPlant);
                if (this.selectedPlant) {
                  this.pageFilter.plantId = this.selectedPlant.plantId;
                }
  }



  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._opSvc.filterObservable(this.pageFilter))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.measuringPoints = result['content'];
        this.loaderService.hideLoader();
      },
      error2 => {
        this.measuringPoints = [];
        this.utilities.showErrorToast(error2);
        this.loaderService.hideLoader();
      }
    );
    this.filter(this.pageFilter);
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

  modalShow(id, mod: string) {

    this.measuringPointModal.id = id;
    this.measuringPointModal.modal = mod;

    this.myModal.show();
  }
  onRowSelect(event) {
    // event.data
    if (event) {
      this.selectedEvent.next(event.data);
    }

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

    this.search(this.pageFilter)
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
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    console.log(id);
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
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}
