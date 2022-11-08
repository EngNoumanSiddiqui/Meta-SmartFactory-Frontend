import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {CurrencyService} from 'app/services/dto-services/currency/currencyService';


@Component({
  selector: 'currency-auto-complete',
  templateUrl: './currency-auto-complete.component.html',

})

export class CurrencyAutoCompleteComponent implements OnInit {

  @Output() selectedCurrencyEvent = new EventEmitter<any>();

  selectedCurrency;

  @Input() required: boolean;

  @Input() dropdown = true;
  @Input() disabled = false;

  noCurrency = false;

  requestCurrencyDto = {
    baseCurrency: true,
    countryId: null,
    currencyCode: null,
    currencyId: null,
    currencyName: null
  };
  countryName: any;

  @Input('selectedCurrency') set in(selectedCurrency) {
    if (selectedCurrency) {
      this.selectedCurrency = {currencyCode: selectedCurrency};
    } else {
      this.selectedCurrency = null;
    }
  }



  @Input('countryName') set setcountryName(countryName) {
    if (countryName) {
      this.countryName = countryName;
      this.currencyFilter.countryName = countryName;
    } else {
      this.currencyFilter.countryName = null;
    }
  }

  placeholder = 'no-data';

  filteredCurrency: Array<any>;

  currencyFilter = {
    baseCurrency: true,
    currencyCode: null,
    currencyId: null,
    countryName: null,
    currencyName: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 9999,
    query: null
  };

  @Input() addIfMissing = true;

  modal = {active: false};

  private allCurrencies: Array<any>;

  private searchTerms = new Subject<any>();

  constructor(
    private _currencySvc: CurrencyService,
    private loadingService: LoaderService,
    private utilities: UtilitiesService) {

  }

  modalShow() {
    this.modal.active = true;
  }

  saveCurrency() {
    this._currencySvc.save(this.requestCurrencyDto).then((result) => {
      this.loadingService.hideLoader();
      this.searchTerms.next(this.currencyFilter);
      if (result) {
        this.selectedCurrency = result;
        this.onChangeCurrency(this.selectedCurrency);
        this.utilities.showSuccessToast('saved-success');
      }

    }).catch(error => {
      this.loadingService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._currencySvc.filterObservable(this.currencyFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.currencyFilter);
  }

  private initResult(res) {
    // this.filteredCurrency = res;
    this.allCurrencies = res;
    if (res && res.length > 0) {
      this.noCurrency = false;
      this.placeholder = 'search-currency';
    } else {
      this.placeholder = 'no-data';
      this.currencyFilter.countryName = null;
      if (this.selectedCurrency) {
        this.noCurrency = false;
      } else {
        this.noCurrency = true;
      }
    }
  }

  setSelectedCountry(event) {
    // console.log('@setSelectedCountry', event)
    this.requestCurrencyDto.countryId = event;
  }

  onChangeCurrency(event) {
    if (event && event.hasOwnProperty('currencyName')) {
      this.selectedCurrencyEvent.next(this.selectedCurrency);
    } else {
      this.selectedCurrencyEvent.next(null);
    }
  }

  searchCurrency(event) {
    this.filteredCurrency = this.filterMatched(event.query);
  }

  handleDropdownClickForBatch() {
    this.filteredCurrency = [...this.allCurrencies];

    if (this.filteredCurrency.length == 0) {
      this.currencyFilter.currencyName = null;
      this.currencyFilter.currencyCode = null;
      // if (this.countryName) {
      //   this.currencyFilter.countryName = this.countryName;
      // }
      this.searchTerms.next(this.currencyFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allCurrencies && this.allCurrencies.length > 0) {
      for (let i = 0; i < this.allCurrencies.length; i++) {
        const obj = this.allCurrencies[i];
        if (obj['currencyName'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          obj['currencyCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      // if (query.length > 3) {
      //   this.currencyFilter.currencyName = query;
      //   this.currencyFilter.currencyCode = null;
      // } else {
      //   this.currencyFilter.currencyCode = query;
      //   this.currencyFilter.currencyName = null;
      // }
      // if (this.currencyFilter.countryName) {
      //   this.currencyFilter.countryName = null;
      // }
      // this.searchTerms.next(this.currencyFilter);
    }
    return filtered;
  }

  setBatch(batch) {

    if (batch) {
      this.selectedCurrency = batch;
      this.allCurrencies.push(batch);
      this.handleDropdownClickForBatch()
      this.onChangeCurrency(this.selectedCurrency);
    }
  }

}
