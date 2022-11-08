import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import {ModalDirective} from 'ngx-bootstrap/modal';
import { environment } from 'environments/environment';
import { Subject, Subscription } from 'rxjs';
import { ConvertUtil } from 'app/util/convert-util';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EnumService } from 'app/services/dto-services/enum/enum.service';
import { ProjectService } from 'app/services/dto-services/project/project.service';

@Component({
  selector: 'project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  modal2 = {active: false};
  pQuotationModal = {
    modal: null,
    id: null
  };
  showLoader = false;

  classReOrder = ['asc', 'asc', 'asc', 'asc'];

  projectList = [];
  selectedProjectList: any;
  ProjectStatuses = ['PLANNED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

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

  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    actualFinishDate: null,
    actualStartDate: null,
    code: null,
    description: null,
    employeeId: null,
    employeeName: null,
    employeeNo: null,
    finishDate: null,
    name: null,
    orderByDirection: 'projectId',
    orderByProperty: 'desc',
    plantId: null,
    projectId: null,
    query: null,
    scheduledFinishDate: null,
    scheduledStartDate: null,
    startDate: null,
    status: null,
  };

  selectedColumns = [
    {field: 'projectId', header: 'project_id'},
    {field: 'code', header: 'project_code'},
    {field: 'name', header: 'project_name'},
    {field: 'status', header: 'project_status'},
    {field: 'responsibleEmployee', header: 'responsible_employee'},
    {field: 'description', header: 'description'},
    {field: 'startDate', header: 'planned-start-date'},
    {field: 'finishDate', header: 'planned-finish-date'},
    {field: 'scheduledStartDate', header: 'scheduled-start-date'},
    {field: 'scheduledFinishDate', header: 'scheduled-finish-date'},
  ];

  cols = [
    {field: 'projectId', header: 'project_id'},
    {field: 'code', header: 'project_code'},
    {field: 'name', header: 'project_name'},
    {field: 'status', header: 'project_status'},
    {field: 'responsibleEmployee', header: 'responsible_employee'},
    {field: 'description', header: 'description'},
    {field: 'startDate', header: 'planned-start-date'},
    {field: 'finishDate', header: 'planned-finish-date'},
    {field: 'scheduledStartDate', header: 'scheduled-start-date'},
    {field: 'scheduledFinishDate', header: 'scheduled-finish-date'},
    {field: 'actualStartDate', header: 'actual-start-date'},
    {field: 'actualFinishDate', header: 'actual-finish-date'},
    {field: 'erpPlannedStartDate', header: 'erp-start-date'},
    {field: 'erpPlannedFinishDate', header: 'erp-finish-date'},
  ];

  sub: Subscription[] = [];
  searchTerms = new Subject<any>();

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private projectService: ProjectService,
              private loaderService: LoaderService,
              private enumService: EnumService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService) {

              


  }

  modalShow(id, mod: string) {
    this.modal2.active = true;
    this.pQuotationModal.id = id;
    this.pQuotationModal.modal = mod;
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.projectService.filter(term))).subscribe(
      result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.projectList = result['content'];
        this.loaderService.hideLoader();
      },
      error => {
        this.utilities.showErrorToast(error)
        this.loaderService.hideLoader();
      }
    );



    this.sub.push( this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.filter(this.pageFilter);
      }
    }));
    // this.enumService.getProjectStatusEnum().then(res => this.ProjectStatuses = res || []).catch(err => this.utilities.showErrorToast(err));

  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }

  filter(data) {
    this.pageFilter.pageNumber = 1;
    this.search(data);
  }

  search(data) {
    this.loaderService.showLoader();

    const temp = Object.assign({}, data);

    if (temp.createDate) {
      temp.createDate = ConvertUtil.localDateShiftAsUTC(temp.createDate);
    } if (temp.requiredDate) {

      // temp.requiredDate = ConvertUtil.date2EndOfDay(temp.requiredDate);
      temp.requiredDate = ConvertUtil.localDateShiftAsUTC(temp.requiredDate);
    }

    this.searchTerms.next(temp);
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

  showSupplierDetail(supplierId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.CUSTOMER, supplierId);
  }
  modalEmployeeShow(employeeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STAFF, employeeId);
  }

  resetFilter() {
    this.pageFilter = {
      pageNumber: 1,
      pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
      actualFinishDate: null,
      actualStartDate: null,
      code: null,
      description: null,
      employeeId: null,
      employeeName: null,
      employeeNo: null,
      finishDate: null,
      name: null,
      orderByDirection: 'projectId',
      orderByProperty: 'desc',
      plantId: this.pageFilter.plantId,
      projectId: null,
      query: null,
      scheduledFinishDate: null,
      scheduledStartDate: null,
      startDate: null,
      status: null,
    };
    this.filter(this.pageFilter);
  }

  showCostCenterDetailDialog(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.COSTCENTER, id);
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant('do-you-want-to-delete'),
      header: this._translateSvc.instant('delete-confirmation'),
      icon: 'fa fa-trash',
      accept: () => {
        this.projectService.delete(id)
          .then(() => {
            this.utilities.showSuccessToast('deleted-success');
            this.search(this.pageFilter);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }
}

