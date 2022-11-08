import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {WorkstationService} from '../../../services/dto-services/workstation/workstation.service';
import { OperationService } from 'app/services/dto-services/operation/operation.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'choose-ws-pane',
  templateUrl: './choose-workstation-pane.component.html',
  styleUrls: ['./choose-workstation-pane.component.scss']
})
export class ChooseWorkstationPaneComponent implements OnInit {

  @Output() selectedEvent = new EventEmitter();

  private searchTerms = new Subject<any>();
  workstationList;

  searchingOperation;
  pageFilter = {pageNumber: 1, plantId: null, pageSize: 10, query: null, orderByProperty: 'workStationName', orderByDirection: 'desc', workStationName: null};
  operationId: any;

  @Input('plantId') set plantIds(plantId) {
    if (plantId) {
      this.pageFilter.plantId = plantId;
      setTimeout(() => {
        if (!this.operationId) {
          this.searchTerms.next(this.pageFilter);  
        }
      }, 1000);
      
    }
  }
  @Input('operationId') set setOperationId(operationId) {
    if (operationId) {
      this.operationId = operationId;
      this.operationServie.getOrderDetail(operationId).then((res: any ) => {
        this.workstationList = res.workStationIdList;
        if (!this.workstationList || this.workstationList.length === 0) {
          this.searchTerms.next(this.pageFilter);
        }
      });
    }
  }
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: 10,
    tag: ''
  };

  constructor(private _wsService: WorkstationService,
    private loadingService: LoaderService,
     private operationServie: OperationService) {
    
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._wsService.filterObservable(this.pageFilter))).subscribe(
      res => {
        this.initResult(res['content']);
        this.pagination.currentPage = res['currentPage'];
        this.pagination.totalElements = res['totalElements'];
        this.pagination.totalPages = res['totalPages'];
      },
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.pageFilter);
    this.searchingOperation = true
  }

  search(value) {
    this.pageFilter.workStationName = value;
    this.pageFilter.pageNumber = 1;
    this.filter();
  }

  filter() {
    this.searchingOperation = true
    this.searchTerms.next(this.pageFilter);
  }


  private  initResult(res) {
    this.searchingOperation = false
    this.workstationList = res;
  }


  sendSelectedItem(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.selectedEvent.next(event);
    } else {
      this.selectedEvent.next(null);
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
    this.filter();
  }
}
