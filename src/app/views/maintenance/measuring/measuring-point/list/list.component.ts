import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import {environment} from '../../../../../../environments/environment';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {ConvertUtil} from '../../../../../util/convert-util';
import {MeasuringPointService} from '../../../../../services/dto-services/measuring/measuring-point.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import {Subscription} from 'rxjs';
 
import {AppStateService} from '../../../../../services/dto-services/app-state.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListMeasuringPointComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  measuringPointModal = {
    modal: null,
    id: null,
    active: false,
    data: null
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
    {field: 'codeGroup', header: 'code-group'},
    {field: 'equipmentCodeGroupHeader', header: 'code-group-header'},
    {field: 'maintenanceFunctionalLocation', header: 'functional-location'},
    // {field: 'equipmentId', header: 'equipmentId'},
    {field: 'equipment', header: 'equipment'},
    {field: 'maintenanceCharacteristic', header: 'characteristic'},
    {field: 'characteristicUnit', header: 'characteristic-unit'},
    {field: 'measuringPointIsCounter', header: 'measuring-point-counter'},
    {field: 'countBackwards', header: 'count-backwards'},
    {field: 'annualEstimate', header: 'annual-estimate'},
    {field: 'annualEstimateUnit', header: 'annual-estimate-unit'}
  ];
  cols = [
    {field: 'equipmentMeasuringPointId', header: 'measuring-point-id'},
    {field: 'annualEstimate', header: 'annual-estimate'},
    {field: 'countBackwards', header: 'count-backwards'},
    {field: 'counterOverflowReading', header: 'counter-overflow-reading'},
    {field: 'maintenanceFunctionalLocation', header: 'functional-location'},
    {field: 'decimalPlaces', header: 'decimal-places'},
    {field: 'equipmentMeasuringPointNo', header: 'measuring-point-no'},
    {field: 'measurementPosition', header: 'measuring-position'},
    {field: 'measuringPointIsCounter', header: 'measuring-point-counter'},
    {field: 'codeGroup', header: 'code-group'},
    {field: 'equipmentCodeGroupHeader', header: 'code-group-header'},
    {field: 'equipmentId', header: 'equipmentId'},
    {field: 'equipment', header: 'equipment'},
    {field: 'maintenanceCharacteristic', header: 'characteristic'},
    {field: 'annualEstimateUnit', header: 'annual-estimate-unit'},
    {field: 'characteristicUnit', header: 'characteristic-unit'},
    {field: 'targetValue', header: 'target-value'},
    {field: 'targetValueText', header: 'target-value-text'},
  ];

  selectedMeasuringPoints = [];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    active: null,
    annualEstimate: null,
    characteristic: null,
    characteristicId: null,
    characteristicUnit: null,
    codeGroupId: null,
    countBackwards: true,
    counterOverflowReading: null,
    createDate: null,
    decimalPlaces: null,
    equipmentCodeGroupGroupCode: null,
    equipmentCodeGroupHeaderId: null,
    equipmentId: null,
    equipmentMeasuringPointId: null,
    equipmentMeasuringPointNo: null,
    equipmentName: null,
    measurementPosition: null,
    measuringPointIsCounter: true,
    targetValue: null,
    targetValueText: null,
    updateDate: null,
    query: null,
    orderByProperty: 'equipmentMeasuringPointId',
    orderByDirection: 'desc',
    plantId: null
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  measuringPoints = [];
  showLoader = false;

  sub: Subscription;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;

    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string, data) {

    this.measuringPointModal.id = id;
    this.measuringPointModal.active = true;
    this.measuringPointModal.data = data;
    this.measuringPointModal.modal = mod;

    // this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private _opSvc: MeasuringPointService,
              private utilities: UtilitiesService,
              private loaderService: LoaderService,
              private appStateSvc: AppStateService) {

    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if (!res) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
      }
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
        this.measuringPoints = result['content'];
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
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      active: null,
      annualEstimate: null,
      characteristic: null,
      characteristicId: null,
      characteristicUnit: null,
      codeGroupId: null,
      countBackwards: true,
      counterOverflowReading: null,
      createDate: null,
      decimalPlaces: null,
      equipmentCodeGroupGroupCode: null,
      equipmentCodeGroupHeaderId: null,
      equipmentId: null,
      equipmentMeasuringPointId: null,
      equipmentMeasuringPointNo: null,
      equipmentName: null,
      measurementPosition: null,
      measuringPointIsCounter: true,
      targetValue: null,
      targetValueText: null,
      updateDate: null,
      query: null,
      orderByProperty: null,
      orderByDirection: 'desc',
      plantId: null
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
        this.utilities.showInfoToast('cancelled-measuringPoint');
      }
    })
  }

  showEquipmentCodeGroupDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CODEGROUP, id);
  }

  showEquipmentDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.EQUIPMENT, id);
  }

  showFunctionalLocationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.FUNCTIONALLOCATION, id);
  }

  showEquipmentCodeGroupHeaderDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CODEGROUPHEADER, id);
  }

}
