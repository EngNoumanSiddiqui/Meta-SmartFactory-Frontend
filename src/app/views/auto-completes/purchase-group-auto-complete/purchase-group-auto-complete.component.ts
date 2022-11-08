import { debounceTime, switchMap } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Subject } from 'rxjs';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { CurrencyService } from 'app/services/dto-services/currency/currencyService';


@Component({
  selector: 'purchase-group-auto-complete',
  templateUrl: './purchase-group-auto-complete.component.html',

})

export class PurchaseGroupAutoCompleteComponent implements OnInit {

  @Output() selectedPurchaseGroupEvent = new EventEmitter();

  selectedPurchaseGroup;

  @Input() required: boolean;

  @Input() dropdown = true;

  noCurrency = false;

  requestCurrencyDto = {
    baseCurrency: true,
    countryId: null,
    currencyCode: null,
    currencyId: null,
    currencyName: null
  };

  @Input('selectedPurchaseGroup') set in(selectedPurchaseGroup) {
    if (selectedPurchaseGroup) {
      this.selectedPurchaseGroup = { currencyName: selectedPurchaseGroup };
    } else {
      this.selectedPurchaseGroup = null;
    }
  }

  placeholder = 'no-data';

  filteredCurrency: Array<any>;

  currencyFilter = {
    baseCurrency: true,
    currencyCode: null,
    currencyId: null,
    currencyName: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 1000,
    query: null
  };

  @Input() addIfMissing = true;

  modal = { active: false };

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
        this.selectedPurchaseGroup = result;
        this.onChangeCurrency(this.selectedPurchaseGroup);
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
      if (this.selectedPurchaseGroup) {
        this.noCurrency = false;
      } else {
        this.noCurrency = true;
      }
    }
  }

  setSelectedCountry(event){
    // console.log('@setSelectedCountry', event)
    this.requestCurrencyDto.countryId = event;
  }

  onChangeCurrency(event) {
    if (event && event.hasOwnProperty('currencyName')) {
      this.selectedPurchaseGroupEvent.next(this.selectedPurchaseGroup);
    } else {
      this.selectedPurchaseGroupEvent.next(null);
    }
  }

  searchCurrency(event) {
    this.filteredCurrency = this.filterMatched(event.query);
  }

  handleDropdownClickForBatch() {
    this.filteredCurrency = [...this.allCurrencies];

    if (this.filteredCurrency.length == 0) {
      this.currencyFilter.currencyName = null;
      this.searchTerms.next(this.currencyFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allCurrencies && this.allCurrencies.length > 0) {
      for (let i = 0; i < this.allCurrencies.length; i++) {
        const obj = this.allCurrencies[i];
        if (obj['currencyName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.currencyFilter.currencyName = query;
      this.searchTerms.next(this.currencyFilter);
    }
    return filtered;
  }

  setBatch(batch) {

    if (batch) {
      this.selectedPurchaseGroup = batch;
      this.allCurrencies.push(batch);
      this.handleDropdownClickForBatch()
      this.onChangeCurrency(this.selectedPurchaseGroup);
    }
  }

}
