import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {ProductTreeCriteriaService} from '../../../services/dto-services/product-tree/prod-tree-criteria.service';


@Component({
  selector: 'product-tree-criteria-auto-complete',
  templateUrl: './product-tree-criteria-auto-complete.component.html',

})

export class ProductTreeCriteriaAutoCompleteComponent implements OnInit {

  @Output() selectedProductTreeCriteriaEvent = new EventEmitter();
  selectedProductTreeCriteria;
  @Input() required: boolean;
  @Input() dropdown = true;

  @Input('selectedProductTreeCriteria')

  set in(selectedProductTreeCriteria) {
    this.selectedProductTreeCriteria = selectedProductTreeCriteria;
  }

  placeholder = 'no-data';
  filteredProductTreeCriteria: Array<any>;

  productTreeCriteriaIdFilter = {
    description: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'description'
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allProductTreeCriterias: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private productTreeCriteriaIdService: ProductTreeCriteriaService) {

  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.productTreeCriteriaIdService.filterObservable(this.productTreeCriteriaIdFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.productTreeCriteriaIdFilter);
  }

  private  initResult(res) {
    // this.filteredProductTreeCriteria = res;
    this.allProductTreeCriterias = res;
    if (res.length > 0) {
      this.placeholder = 'search-maintenance-category';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeProductTreeCriteria(event) {
    if (event && event.hasOwnProperty('productTreeCriteriaId')) {
      this.selectedProductTreeCriteriaEvent.next(this.selectedProductTreeCriteria);
    } else {
      this.selectedProductTreeCriteriaEvent.next(null);
    }
  }

  searchProductTreeCriteria(event) {
    this.filteredProductTreeCriteria = this.filterMatched(event.query);
  }

  handleDropdownClickForProductTreeCriteria() {
    this.filteredProductTreeCriteria = [...this.allProductTreeCriterias];

    if (this.filteredProductTreeCriteria.length == 0) {
      this.productTreeCriteriaIdFilter.description = null;
      this.searchTerms.next(this.productTreeCriteriaIdFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allProductTreeCriterias && this.allProductTreeCriterias.length > 0) {
      for (let i = 0; i < this.allProductTreeCriterias.length; i++) {
        const obj = this.allProductTreeCriterias[i];
        if (obj['description'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.productTreeCriteriaIdFilter.description = query;
      this.searchTerms.next(this.productTreeCriteriaIdFilter);
    }
    return filtered;
  }

  setProductTreeCriteria(productTreeCriteriaId) {

    if (productTreeCriteriaId) {
      this.selectedProductTreeCriteria = productTreeCriteriaId;
      this.allProductTreeCriterias.push(productTreeCriteriaId);
      this.handleDropdownClickForProductTreeCriteria()
      this.onChangeProductTreeCriteria(this.selectedProductTreeCriteria);
    }
  }

}
