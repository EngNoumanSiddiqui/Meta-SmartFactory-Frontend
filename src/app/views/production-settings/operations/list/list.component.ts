import { Subscription, Subject } from 'rxjs';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {OperationService} from '../../../../services/dto-services/operation/operation.service';
import {ConfirmationService} from 'primeng';
import {EnumOperationStatusService} from '../../../../services/dto-services/enum/operation-status.service';
import {environment} from '../../../../../environments/environment';
import {LoaderService} from '../../../../services/shared/loader.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { debounceTime, switchMap } from 'rxjs/operators';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListOperationComponent implements OnInit, OnDestroy {
  @ViewChild('myModal') public myModal: ModalDirective;
  operationModal = {
    modal: null,
    data: null,
    id: null
  };

  plantList: any[] = [];
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
    {field: 'operationId', header: 'operation-id'},
    {field: 'operationNo', header: 'operation-no'},
    {field: 'operationName', header: 'operation-name'},
    // {field: 'plant', header: 'plant'},
    {field: 'operationType', header: 'operation-type'},
    {field: 'location', header: 'location'},
    {field: 'description', header: 'description'},

  ];
  cols = [
    {field: 'operationId', header: 'operation-id'},
    {field: 'operationNo', header: 'operation-no'},
    {field: 'operationName', header: 'operation-name'},
    {field: 'operationType', header: 'operation-type'},
    {field: 'location', header: 'location'},
    {field: 'unit', header: 'unit'},
    {field: 'plant', header: 'plant'},
    { field: 'plantId', header: 'plant-id' },
    {field: 'description', header: 'description'},
    {field: 'operationCostRate', header: 'costing'},
    {field: 'singleDuration', header: 'single-duration'},
    {field: 'singleSetupDuration', header: 'single-setup-duration'},
    {field: 'maxSingleStandbyDuration', header: 'max-single-standby-duration'},
  ];
  private searchTerms = new Subject<{ term: any, skipCache: boolean}>();

  selectedOperations = [];
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    operationNo: null,
    operationId: null,
    operationName: null,
    operationStatus: null,
    operationType: null,
    plantId: null,
    plantName: null,
    query: null,
    orderByProperty: 'operationId',
    orderByDirection: 'desc'
  };

  classReOrder = ['asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc', 'asc'];

  operations = [];
  listStatus;
  listTypes;
  sub: Subscription;
  groupTpeID = 4;
  showLoader = false;
  isSaveAndNew: boolean;

  filterByColumn(value, field) {
    if (ConvertUtil.isEmptyString(value)) {
      value = null;
    }
    this.pageFilter[field] = value;
    this.filter(this.pageFilter);
  }

  modalShow(id, mod: string) {

    this.operationModal.id = id;
    this.operationModal.modal = mod;

    this.myModal.show();
  }

  constructor(private _confirmationSvc: ConfirmationService,
              private _enumOperationStatus: EnumOperationStatusService,
              private _translateSvc: TranslateService,
              private appStateService: AppStateService,
              private _opSvc: OperationService, private utilities: UtilitiesService,
              private loaderService: LoaderService) {


  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(600),
      switchMap(({ term, skipCache }) => this._opSvc.filterObservable(term, skipCache))).subscribe(result => {
        this.pagination.currentPage = result['currentPage'];
        this.pagination.totalElements = result['totalElements'];
        this.pagination.totalPages = result['totalPages'];
        this.operations = result['content'];
        this.loaderService.hideLoader();

      }, error => {
        this.loaderService.hideLoader();

        this.utilities.showErrorToast(error)
      });
    // this.filter(this.pageFilter);
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
       this.pageFilter.plantId = null;
      } else {
        this.pageFilter.plantId = res.plantId;
        this.pageFilter.plantName = res.plantName;
        this.filter(this.pageFilter);
      }

    });
    this._enumOperationStatus.getEnumList().then(result => this.listStatus = result).catch(error => console.log(error));
    if (this.pageFilter.plantId) {
      this._opSvc.getDetailByPlantId(this.pageFilter.plantId).then(result => {
        this.listTypes = result
      // console.log("@tyle",this.listTypes);
      }).catch(error => console.log(error));
    }
  }


  filter(data, skipCache: boolean = false ) {
    this.loaderService.showLoader();
    this.searchTerms.next({
      term: data,
      skipCache,
    });
  }

  SaveActionFire(isSaveAndNew: boolean) {
    this._opSvc.saveAction$.next();
    this.isSaveAndNew = isSaveAndNew;
  }

  modalClone(mod: string, data) {
    // this.productTreeModal.id = id;
    this.operationModal.modal = mod;
    this.operationModal.data = data[0];
    // this.modal.active = true;
    this.myModal.show();
  }
  onSaveSuccessful(event, myModal) {
    myModal.hide();
    this.filter(this.pageFilter, true );
    if (this.isSaveAndNew) {
      // this.modal.active = true;
      this.operationModal.modal = 'NEW';
      myModal.show();
    }
    this.isSaveAndNew = false;
    this.selectedOperations.length = 0;
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
      operationNo: null,
      operationName: null,
      operationId: null,
      plantId: this.pageFilter.plantId,
      plantName: this.pageFilter.plantName,
      operationStatus: null,
      operationType: null,
      query: null,
      orderByProperty: null,
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
        this._opSvc.delete(id)
          .then(() => {
            this.utilities.showInfoToast('deleted-success');
            this.filter(this.pageFilter, true);
          })
          .catch(error => this.utilities.showErrorToast(error));
      },
      reject: () => {
        this.utilities.showInfoToast('cancelled-operation');
      }
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  showPlantDetail(plantId){
    this.loaderService.showDetailDialog(DialogTypeEnum.PLANT, plantId);
  }
  getdurationTime(time) {
    return ConvertUtil.longDuration2DHHMMSSsssTime(time);
  }

  showOperationTypeDetail(operationTypeId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.OPERATIONTYPE, operationTypeId);
  }
  showLocationDetail(id) {
    this.loaderService.showDetailDialog(DialogTypeEnum.LOCATION, id);
  }



  exportCSV(selected: boolean = false) {
    import('xlsx').then(xlsx => {
      const exportedjobOrders = selected ? this.selectedOperations : this.operations;
      const mappedDAta = exportedjobOrders.map(itm => {
        const obj = {};
        this.selectedColumns.forEach(col => {
          if(col.field === 'operationType') {
            obj[this._translateSvc.instant(col.header)] = itm.operationType ? itm.operationType?.operationTypeName : '';
          } else if(col.field === 'location') {
            obj[this._translateSvc.instant(col.header)] = itm.location ? itm.location?.locationName : '';
          } else if(col.field === 'plant') {
            obj[this._translateSvc.instant(col.header)] = itm.plant ? itm.plant?.plantName : '';
          } else if(itm.hasOwnProperty(col.field)) {
              obj[this._translateSvc.instant(col.header)] = itm[col.field];
          }
        });
        return (obj);
      })
        const worksheet =  xlsx.utils.json_to_sheet(mappedDAta);
        const header = Object.keys(mappedDAta[0]); // columns name
        let wscols = [];
        for (var i = 0; i < header.length; i++) {  // columns length added
          wscols.push({ wch: header[i].length + 10, width: header[i].length + 10, wpx: header[i].length + 10 })
        }
        worksheet["!cols"] = wscols;
        // worksheet["!cols"] = [{ width: 150, wch: 150 }, { wch: 150 }, { wch: 200 },
        //   { wch: 250 }, { wch: 150 }, { wch: 100 }, { wch: 100 }, { wch: 200 }, { wch: 200 } ]; ;
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        // XLSX.writeFile(wb, "SheetJS.xlsb", {compression:true});
        this.saveAsExcelFile(excelBuffer, "Operations");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
