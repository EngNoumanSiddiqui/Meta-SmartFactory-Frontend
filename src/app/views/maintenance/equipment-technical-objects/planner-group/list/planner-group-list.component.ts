/**
 * Created by reis on 29.07.2019.
 */
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {environment} from '../../../../../../environments/environment';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import {ConvertUtil} from '../../../../../util/convert-util';
import {EquipmentPlannerGroupService} from '../../../../../services/dto-services/maintenance-equipment/planner-group.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'planner-group-list',
  templateUrl: './planner-group-list.component.html',
  styleUrls: ['./planner-group-list.component.scss']
})
export class ListEquipmentPlannerGroupComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    id: null
  };


  tableData = [];
  selectedData = [];
  selectedColumns = [
    {field: 'plannerGroupId', header: 'planner-group-id'},
    {field: 'plannerGroup', header: 'planner-group'},
    {field: 'definition', header: 'definition'},
    {field: 'mail', header: 'mail'},
    {field: 'telephone', header: 'telephone'},
    {field: 'maintanencePlanningPlant', header: 'plant'}
  ];
  cols = [
    {field: 'plannerGroupId', header: 'planner-group-id'},
    {field: 'plannerGroup', header: 'planner-group'},
    {field: 'definition', header: 'definition'},
    {field: 'mail', header: 'mail'},
    {field: 'telephone', header: 'telephone'},
    {field: 'maintanencePlanningPlant', header: 'plant'}
  ];
  modal = {active: false};
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    tag: ''
  };
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    plannerGroupId: null,
    plannerGroup: null,
    plantName: null,
    telephone: null,
    plantId: null,
    definition: null,
    mail: null,
    query: null,
    orderByProperty: 'plannerGroupId',
    orderByDirection: 'desc'
  };
  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];
  sub: Subscription;

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private utilities: UtilitiesService,
              private appStateService: AppStateService,
              private loaderService: LoaderService,
              private equipmentPlannerGroupService: EquipmentPlannerGroupService) {
               

  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        // this.resetFilter();
        // this.filter(this.pageFilter);
      } else {
        // this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      }
    });
    // this.filter(this.pageFilter);
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  filter(data) {
    this.loaderService.showLoader();
    this.equipmentPlannerGroupService.filter(data)
      .then(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.tableData = result['content'];
        this.loaderService.hideLoader();
      })
      .catch(error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      });
  }

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = '';
    }
    this.pageFilter[field] = value;
    console.log(this.pageFilter.query);
    this.filter(this.pageFilter);
  }

  detailRowIndex;

  setDetailTableIndex(rowIndex) {
    this.detailRowIndex = rowIndex;
  }

  modalShow(id, mod: string) {

    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;

    this.modal.active = true;
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
    this.filter(this.pageFilter)
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
      plannerGroupId: null,
      plannerGroup: null,
      plantName: null,
      telephone: null,
      plantId: this.pageFilter.plantId,
      definition: null,
      mail: null,
      query: null,
      orderByProperty: 'plannerGroupId',
      orderByDirection: 'desc'
    };
    this.filter(this.pageFilter);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.equipmentPlannerGroupService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.filter(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  showPlantDetail(plantId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId)
  }
}
