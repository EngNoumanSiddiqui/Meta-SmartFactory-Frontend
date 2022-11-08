import {debounceTime, switchMap} from 'rxjs/operators';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';

import {StockCardService} from '../../../services/dto-services/stock/stock.service';
import {Subject} from 'rxjs';
import { UsersService } from 'app/services/users/users.service';
import { AutoComplete } from 'primeng';


@Component({
  selector: 'stock-auto-complete',
  templateUrl: './stock-auto-complete.component.html',
})

export class StockAutoCompleteComponent implements OnInit {

  @Output() selectedStockEvent = new EventEmitter<any>();
  @ViewChild('stockautocomplete') stockautocomplete: AutoComplete;
  selectedStock = null;
  disabled = false;

  @Input() dropdown = true;
  @Input() required = false;
  @Input() allowStockTypeName = false;
  @Input() fromProductTreeMaterial = false;
  requestSent = false;
  totalElement = 0;
  selectedPlant: any;
  query: any = null;
  @Input('selectedStock') set a(selectedStock) {
    if (selectedStock && (!this.selectedStock || !(selectedStock.stockId === this.selectedStock.stockId))) {
      this.selectedStock = selectedStock;
    } else if (!selectedStock) {
      this.selectedStock = null;
    }
  }
  @Input('plantId') set plantIdy(plantId) {
    if (plantId) {
      this.stockFilter.plantId = plantId;
      this.searchTerms.next(this.stockFilter);
    } else {
      this.stockFilter.plantId = null;
    }
  }
  @Input('stockTypeName') set stc (stockTypeName) {
    if (stockTypeName) {
      this.stockFilter.stockTypeName = stockTypeName;
      this.searchTerms.next(this.stockFilter);
    }
  } 
  @Input('excludeRawMaterial')
  set raw(excludeRawMaterial) {
    if (excludeRawMaterial) {
      this.stockFilter.excludeMaterialType = 1;
    } else {
      this.stockFilter.excludeMaterialType = null;
    }
    this.searchTerms.next(this.stockFilter);
  }
  
  @Input('excludeFinishedProduct')
  set finished(excludeFinishedProduct) {
    if (excludeFinishedProduct) {
      this.stockFilter.excludeMaterialType = 3;
    } else {
      this.stockFilter.excludeMaterialType = null;
    }
    this.searchTerms.next(this.stockFilter);
  }

  @Input('selectedStockId') set b(selectedStockId) {
    if (selectedStockId) {
      if (!this.selectedStock || !(this.selectedStock.stockId === selectedStockId)) {
        this.getStockDetail(selectedStockId);
      }
    }
  }

  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  
  placeholder = 'no-data';
  filteredStock;
  stockFilter = {
    stockNo: null,
    stockName: null,
    stockTypeName: null,
    excludeMaterialType: null,
    pageSize: 30,
    plantId: null,
    query: null,
    pageNumber: 1,
    orderByProperty: 'stockNo',
    orderByDirection: 'asc',
    includeMaterialTypeList: null
  };

  @Input('sortByFilter') set filter(property) {
    this.stockFilter.orderByProperty = property;
  }
  
  @Input('includeMaterials') set include(materials) {
    if (materials) {
      this.stockFilter.includeMaterialTypeList = materials;
    } else {
      this.stockFilter.includeMaterialTypeList = null;
    }
    this.searchTerms.next(this.stockFilter);
  }
  
  allStocks = [];
  private searchTerms = new Subject<any>();

  constructor(private stockService: StockCardService, private _userSvc: UsersService,
    private renderer: Renderer2,
    private cdx: ChangeDetectorRef) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.stockFilter.plantId = this.selectedPlant.plantId;
    }
  }


  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.stockService.filterObservable(this.stockFilter))).subscribe(
      cats =>  {
        this.initResult(cats['content']);
        this.totalElement = cats['totalElements'];
        if(this.query) {
          this.filteredStock = [...cats['content']];
          this.stockautocomplete.show();
        }
      },
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.stockFilter);
  }

  getStockDetail(stockId) {
    if (stockId) {
      this.stockService.getDetail(stockId).then(rs => {
        this.selectedStock = rs;
        this.checkAndAddSelectedStock();
      });
    }

  }

  private checkAndAddSelectedStock() {
    const me = this;
    if (this.selectedStock) {
      if (this.filteredStock) {
        const ex = this.filteredStock.find(it => it.stockId === me.selectedStock.stockId);
        const aex = this.allStocks.find(it => it.stockId === me.selectedStock.stockId);
        if (!aex) {
          this.filteredStock.push(this.selectedStock);
          this.filteredStock = [...this.filteredStock];
        }
        if (!ex) {
          this.allStocks.push(this.selectedStock);
        }
      }
      // this.selectedStockEvent.next(this.selectedStock);
    }
  }

  private  initResult(res) {
    if (this.stockFilter.pageNumber > 1) {
      this.allStocks = this.allStocks.concat(res);
      this.filteredStock = [...this.allStocks];
      this.cdx.markForCheck();
      setTimeout(() => {
          this.requestSent = false;
      }, 600);
    } else {
        this.allStocks = res;
    }
    if (res.length > 0) {
        this.placeholder = 'search-material';
        if (this.fromProductTreeMaterial) {
          this.allStocks = this.allStocks.filter(st => (st.stockTypeId === 2) || (st.stockTypeId === 3) || (st.stockTypeId === 9) || (st.stockTypeId === 10))
        }
    } else {
        this.placeholder = 'no-data';
        this.stockFilter.pageNumber = 1;
    }
    
    // this.checkAndAddSelectedStock();

  }

  // searchStock(event) {
  //   this.stockFilter.stockName = event.query;
  //   this.searchTerms.next(this.stockFilter);
  // }
  //
  //
  // handleDropdownClickForStock() {
  //   this.stockFilter.stockName = null;
  //   this.searchTerms.next(this.stockFilter);
  // }


  onChangeStock(event) {
    if (event && event.hasOwnProperty('stockId')) {
      this.selectedStockEvent.next(this.selectedStock);
    } else {
      this.selectedStockEvent.next(null);
    }
  }


  searchStock(eventData) {
    this.query = eventData.query;
    if(eventData.query && eventData.query.length > 0) {
      this.filteredStock = this.filterMatched(eventData.query);
    } else if(this.allStocks.length < 10) {
      this.stockFilter.pageNumber = 1;
      this.stockFilter.query = null;
      this.searchTerms.next(this.stockFilter);
    }
  }


  handleDropdownClickForStock() {

    this.filteredStock = [...this.allStocks];

    if (this.filteredStock.length === 0) {
      this.stockFilter.stockName = null;
      this.stockFilter.stockNo = null;
      this.stockFilter.pageNumber = 1;
      this.searchTerms.next(this.stockFilter);
    } else {
      setTimeout(() => {  
        const autocompletePanel = this.stockautocomplete.el.nativeElement.querySelector('.ui-autocomplete-panel');
        if (autocompletePanel) {
            this.renderer.listen(autocompletePanel, 'scroll', event => {
                if ((event.target.scrollHeight - event.target.clientHeight) === event.target.scrollTop) {
                    if (!this.requestSent && ((this.stockFilter.pageNumber * this.stockFilter.pageSize) < this.totalElement)) {
                        this.requestSent = true;
                        this.stockFilter.pageNumber = this.stockFilter.pageNumber + 1;
                        this.searchTerms.next(this.stockFilter);
                        
                        
                    }
                }
            });
        }
    }, 500);
    }

  }


  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allStocks && this.allStocks.length > 0) {
      for (let i = 0; i < this.allStocks.length; i++) {
        const obj = this.allStocks[i];
        if (obj && typeof(obj) !== 'string') {
          if (obj['stockName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(obj);
          } else if (obj['stockNo'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            filtered.push(obj);
          }
        }
      }
    }
    if (filtered.length == 0) {
      this.stockFilter.pageNumber = 1;
      this.stockFilter.query = query;
      this.searchTerms.next(this.stockFilter);
    }
    return filtered;
  }


}
