import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {BatchService} from '../../../services/dto-services/batch/batch.service';
@Component({
  selector: 'choose-batch-pane',
  templateUrl: './choose-batch-pane.component.html',
  styleUrls: ['./choose-batch-pane.component.scss']
})
export class ChooseBatchPaneComponent implements OnInit {

  @Output() selectedEvent = new EventEmitter();

  private searchTerms = new Subject<any>();
  batchList;

  searchingOperation;
  pageFilter = {pageNumber: 1, pageSize: 10, query: null, orderByProperty: 'batchCode', orderByDirection: 'asc', batchCode: null};

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

  constructor(private _batchService: BatchService) {

  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._batchService.filterObservable(this.pageFilter))).subscribe(
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
    this.pageFilter.batchCode = value;
    this.pageFilter.pageNumber = 1;
    this.filter();
  }

  filter() {
    this.searchingOperation = true
    this.searchTerms.next(this.pageFilter);
  }


  private  initResult(res) {
    this.searchingOperation = false
    this.batchList = res;
  }


  sendSelectedItem(event) {
    if (event && event.hasOwnProperty('batchId')) {
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
