/**
 * Created by reis on 29.07.2019.
 */
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { JobOrderOperationPalletService } from 'app/services/dto-services/job-order/job-order-operation-pallet.service';
import { debounceTime, switchMap } from 'rxjs/operators';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'job-order-operation-pallet-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class JobOrderOperationPalletListComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  equipmentModal = {
    modal: null,
    data: null,
    id: null
  };
  @Input() detailMode = false;
  tableData = [];
  selectedPlant: any;
  @Input('tableData') set x(tableData) {
    if (tableData) {
      this.tableData = tableData;
    }
  }
  @Input('jobOrderOperationId') set setJobOrderOperationId(jobOrderOperationId) {
    if (jobOrderOperationId) {
      this.pageFilter.jobOrderOperationId = jobOrderOperationId;
      setTimeout(() => {
        this.filter();
      }, 700);
    }
  }


  cols = [
    {field: 'jobOrderOperationPalletId', header: 'job-order-operation-pallet-id'},
    {field: 'stockNo', header: 'stock-no'},
    {field: 'stockName', header: 'stock-name'},
    {field: 'jobOrderOperation', header: 'job-order-operation-id'},
    {field: 'palletSetting', header: 'pallet-setting-id'},
    {field: 'plannedQuantity', header: 'planned-quantity'},
    {field: 'reservedQuantity', header: 'reserved-quantity'},
    {field: 'createDate', header: 'create-date'},
  ];

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 200, 500, 1000],
    rows: 20,
    tag: ''
  };

  pageFilter = {
    // need to provide the prod-order filter
    pageNumber: 1,
    pageSize: 20,
    query: null,
    orderByProperty: 'jobOrderOperationPalletId',
    orderByDirection: 'desc',
    plantId: null,
    plantName: null,
    jobOrderOperationId: null,
    jobOrderOperationPalletId: null,
    palletSettingId: null,
  };

  modal = {active: false};

  private searchTerms = new Subject<any>();

  constructor(private _confirmationSvc: ConfirmationService,
              private _translateSvc: TranslateService,
              private loaderService: LoaderService,
              private jobOrderOperationPalletSerive: JobOrderOperationPalletService,
              private usersService: UsersService,
              private utilities: UtilitiesService) {

    const setPlant = this.usersService.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.pageFilter.plantId = this.selectedPlant.plantId;
    }
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(500),
      switchMap(term => this.jobOrderOperationPalletSerive.filterObservable(term))).subscribe(
        result => {
          this.tableData = result['content'];
          this.pagination.currentPage = result['currentPage'];
          this.pagination.totalElements = result['totalElements'];
          this.pagination.totalPages = result['totalPages'];
          this.loaderService.hideLoader();
        },
        error2 => {
          this.tableData = [];
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(error2)
    });
  }


  filter() {
    this.pageFilter.pageNumber = 1;
    this.search();
  }

  search() {
    this.loaderService.showLoader();
    const temp = Object.assign({}, this.pageFilter);
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
    this.search();
  }


  modalShow(id, mod: string, data) {
    this.equipmentModal.id = id;
    this.equipmentModal.modal = mod;
    this.equipmentModal.data = data;
    this.modal.active = true;
  }



  delete(id, index) {
      
      // this.tableData.splice(index, 1)
      // this.tableData = [...this.tableData];
      // this.onTableDataChange();

  }




  addOrUpdate(item) {
    console.log('item===========>', item)
    if (this.equipmentModal.data) {// edit event
      this.equipmentModal.data.neededQuantity = item.neededQuantity;
      this.equipmentModal.data.unit = item.unit;
      this.equipmentModal.data.component = item.component;
      this.equipmentModal.data.stockId = item.stockId;
      this.equipmentModal.data.stockName = (item.component)? item.component.stockName : item;
      this.equipmentModal.data.direction = item.direction;
      this.equipmentModal.data.stockNo = item.component.stockNo;
    } else {// new event
      this.tableData = [item, ...this.tableData];
    }
  }

  showPalletDetails(palletSettingId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.PALLET, palletSettingId);
  }

  showJobOrderOperationDetail(jobOrderOperationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDEROPERATION, jobOrderOperationId);
  }

  showStockDetail(stockId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

}
