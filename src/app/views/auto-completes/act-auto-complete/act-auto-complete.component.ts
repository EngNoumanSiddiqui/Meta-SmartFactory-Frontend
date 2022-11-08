import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import {ActService} from '../../../services/dto-services/act/act.service';


@Component({
  selector: 'act-auto-complete',
  templateUrl: './act-auto-complete.component.html',

})

export class ActAutoCompleteComponent implements OnInit {

  @Output() selectedActEvent = new EventEmitter();
  selectedAct: any;
  @Input() both = false;
  @Input() dropdown = true;
  @Input() required: boolean;
  @Input() plantId: number = null;
  @Input() customer: boolean = false;
  @Input() supplier: boolean = false;

  accountPosition = null;
  @Input() addIfMissing = false;
  selectedPlant: any;

  @Input('selectedAct')

  set in(selectedAct) { // {actName,actId}
    this.selectedAct = selectedAct;
  }

  @Input('actTypeId') set ins(actTypeId) { // {actName,actId}
    this.actFilter.actTypeId = actTypeId;
    this.loaderService.showLoader();
    this.searchTerms.next(this.actFilter);
  }

  placeholder = 'no-data';
  filteredAct: Array<any>;

  modal = {active: false};

  private allActs: Array<any>;
  private searchTerms = new Subject<any>();

  actFilter = {
    "pageNumber": 1,
    "pageSize": 9999,
    actTypeId: null,
    "actStatus": "ACTIVE",
    "orderByDirection": "desc",
    accountPosition: this.customer? "CUSTOMER" : (this.supplier ? "SUPPLIER" : null),
    "plantId": this.plantId
  }
  constructor(private actService: ActService, private loaderService: LoaderService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.actFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    if(this.both) {
      this.actFilter.accountPosition = null;
    } else if(this.supplier) {
      this.actFilter.accountPosition = "SUPPLIER";
    }else if(this.customer) {
      this.actFilter.accountPosition = "CUSTOMER";
    }
    this.actFilter.plantId = this.selectedPlant?.plantId || this.plantId;
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.actService.filter(this.actFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );

    this.searchTerms.next(this.actFilter);

    // if(this.plantId && this.both) {
    //   this.actService.filter().then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // } else if(this.plantId && this.customer) {

    //   this.accountPosition = "CUSTOMER";
    //   this.actService.getActCustomerByPlantId(this.plantId).then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // } else if(this.plantId && this.supplier) {
    //   this.accountPosition = "SUPPLIER";
    //   this.actService.getActSupplierByPlantId(this.plantId).then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // } else {
    //   this.actService.getActAll().then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // }
    // if (this.both) { // supplier and customer both list
    //   this.actService.getActAll().then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // } else if (this.supplier) {// only supplier list
    //   this.actService.getActSupplier().then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // } else {// only customer list
    //   this.actService.getActCustomer().then(res => {
    //     this.initResult(res);
    //   }).catch(err => {
    //     this.initResult([]);
    //   })
    // }

  }

  private  initResult(res) {
    // this.filteredAct = res;
    this.loaderService.hideLoader();
    this.allActs = res;
    if (res.length > 0) {
      this.placeholder = 'search';
    } else {
      this.placeholder = 'no-data';

    }
  }


  onChangeAct(event) {
    if (event && event.hasOwnProperty('actId')) {
      this.selectedActEvent.next(this.selectedAct);
    } else {
      this.selectedActEvent.next(null);
    }
  }

  searchAct(event) {
    this.filteredAct = this.filterMatched(event.query);
  }

  handleDropdownClickForAct() {
    this.filteredAct = [...this.allActs];
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allActs && this.allActs.length > 0) {
      for (let i = 0; i < this.allActs.length; i++) {
        const obj = this.allActs[i];
        if (obj['actName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }

    return filtered;
  }

  setCustomer(customer) {
    // if (this.both || (this.supplier && customer.accountPosition === 'SUPPLIER') || (!this.supplier && customer.accountPosition === 'CUSTOMER')) {
    this.selectedAct = {actName: customer.actName, actId: customer.actId};
      this.allActs.push(this.selectedAct);
      this.handleDropdownClickForAct();
      this.onChangeAct(this.selectedAct);
    // }
  }

}
