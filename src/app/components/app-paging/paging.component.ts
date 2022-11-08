import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-paging',
  templateUrl: './paging.component.html',
  providers: []
})
export class PagingComponent implements OnInit {

  public searchItem = '';


  @Input()showSearch=true;

  /*  Total items in list   */
  private _totalElements = 0;
  @Input() get TotalElements(): number { return this._totalElements; }
  set TotalElements(val: number) { this._totalElements = val; this.updatePageLinks(); }

  /* Current Page Number   */
  private _currentPage = 1;
  @Input() get CurrentPage(): number { return this._currentPage; }
  set CurrentPage(val: number) { this._currentPage = val; this.updatePageLinks(); }

  /*  Page Size   */
  private _pageSize = 10;
  @Input() get PageSize(): number { return this._pageSize; }
  set PageSize(val: number) { this._pageSize = val; this.updatePageLinks(); }

  // How many Page Link Buttons to be shown
  private _totalPageLinkButtons = 5;
  @Input() get TotalPageLinkButtons(): number { return this._totalPageLinkButtons; }
  set TotalPageLinkButtons(val: number) { this._totalPageLinkButtons = val; this.updatePageLinks(); }


  public pageLinks : number[];
  @Input() RowsPerPageOptions : number[]; // Number of Items to be shown on the page
  public _rows = 0;
  @Input() get rows(): number { return this._rows; }
  set rows(val: number) {
    this._rows = val;
    this.PageSize = val;
    this.updatePageLinks();
  }

  private _ulClass = '';
  get ulClass() { return this._ulClass; }
  set ulClass(value) { this._ulClass = value; }

  private _liClass = '';
  get liClass() { return this._liClass; }
  set liClass(value) { this._liClass = value; }


  private _aClass = '';
  get aClass() { return this._aClass; }
  set aClass(value) { this._aClass = value; }


  private _firstText = '<<';
  get FirstText() { return this._firstText; }
  set FirstText(value) { this._firstText = value; }


  private _lastText = '>>';
  get LastText() { return this._lastText  ; }
  set LastText(value) { this._lastText = value; }


  private _previousText = '<';
  get PreviousText() { return this._previousText ; }
  set PreviousText(value) { this._previousText = value; }


  private _nextText = '>';
  get NextText() { return this._nextText; }
  set NextText(value) { this._nextText = value; }


  public pager : any;

  @Output() onPageChange : EventEmitter<any> = new EventEmitter();

  onRppChange(event) {
    this.rows = this.RowsPerPageOptions[event.target.selectedIndex];
    this.setPage(1, event);
    this.updatePageLinks();
  }

  setPage(currentPage: number, event) {
    this.pager = this.getPaging(this.TotalElements, currentPage, this.PageSize, this.TotalPageLinkButtons);
    this.pageLinks = this.pager.pages;
    this.onPageChange.emit(this.pager);
    if (event) {
      event.preventDefault();
    }
  }

  updatePageLinks() {
    this.pager = this.getPaging(this.TotalElements, this.CurrentPage, this.PageSize, this.TotalPageLinkButtons);
    this.pageLinks = [];
    for (const item of this.pager.pages) {
      this.pageLinks.push(item);
    }
  }

  search (event) {
    this.searchItem = event;
    this.onPageChange.emit(this.getPaging(this.TotalElements, this.CurrentPage, this.PageSize, this.TotalPageLinkButtons) );
  }

  ngOnInit() {
    this.pager = this.getPaging(this.TotalElements, this.CurrentPage, this.PageSize, this.TotalPageLinkButtons);
  }


  /**
   * @param totalElements : Total items to be listed
   * @param currentPage : Current page number ( Pages starting from 1 not 0)
   * @param pageSize : The number of items in the page
   * @param totalPageLinkButtons : The number of total page link buttons
   * @returns {{
   * startPage: number,
   * endPage: number,
   * startIndex: number,
   * endIndex: number,
   * totalPageLinkButtons: number,
   * totalElements: number,
   * currentPage: number,
   * pageSize: number,
   * totalPages: number,
   * pages: (Observable<number>|any)
   * }}
   */
  getPaging(totalElements: number, currentPage: number = 1, pageSize: number = 10, totalPageLinkButtons: number = 5) {

    // Value checking for all items
    currentPage = currentPage || 1;
    pageSize = pageSize || 10;
    totalPageLinkButtons = totalPageLinkButtons || 5;

    // calculate total pages
    const totalPages = Math.ceil(totalElements / pageSize);

    let startPage: number; // start Page Button number
    let endPage: number;   // end Page Button number
    if (totalPages <= totalPageLinkButtons) {

      // less than totalPageButtons then show all
      // 1,2,3,.., totalPages are buttons
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than totalPageButtons then calculate start and end pages
      // currentPage will be on the center of the paging
      if (currentPage <= Math.ceil(totalPageLinkButtons / 2)) {
        startPage = 1;
        endPage = totalPageLinkButtons;
      } else if (currentPage + Math.ceil(totalPageLinkButtons / 2) > totalPages) {
        startPage = totalPages - totalPageLinkButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.ceil(totalPageLinkButtons / 2) + 1;
        endPage = startPage + totalPageLinkButtons - 1;
      }
    }

    // calculate start and end item indexes
    // Indexes are started from 0 ! It is important
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalElements - 1);

    const pages = [];
    // create an array of pages to ng-repeat in the pager control
    for ( let i = startPage; i <= endPage ; i++) {
      pages.push(i);
    }

    // return object with all pager properties required by the view
    return {
      startPage           : startPage,
      endPage             : endPage,
      startIndex          : startIndex,
      endIndex            : endIndex,
      totalPageLinkButtons: totalPageLinkButtons,
      totalElements       : totalElements,
      currentPage         : currentPage,
      pageNumber          : currentPage,
      pageSize            : pageSize,
      totalPages          : totalPages,
      pages               : pages,
      searchItem          : this.searchItem
    };
  }
}
