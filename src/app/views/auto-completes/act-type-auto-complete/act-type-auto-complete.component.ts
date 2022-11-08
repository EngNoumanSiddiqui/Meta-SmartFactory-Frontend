import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { ActTypeService } from 'app/services/dto-services/act-type/act-type.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'act-type-auto-complete',
  templateUrl: './act-type-auto-complete.component.html',

})

export class ActTypeAutoCompleteComponent implements OnInit {

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

  // @Input('actTypeId') set ins(actTypeId) { // {actName,actId}
  //   this.actFilter.actTypeId = actTypeId;
  //   this.loaderService.showLoader();
  //   this.searchTerms.next(this.actFilter);
  // }

  placeholder = 'no-data';
  filteredAct: Array<any>;

  modal = {active: false};

  private allActs: Array<any>;
  private searchTerms = new Subject<any>();

  // actFilter = {
  //   "pageNumber": 1,
  //   "pageSize": 9999,
  //   actTypeId: null,
  //   "actStatus": "ACTIVE",
  //   "orderByDirection": "desc",
  //   accountPosition: this.customer? "CUSTOMER" : (this.supplier ? "SUPPLIER" : null),
  //   "plantId": this.plantId
  // }
  constructor(private _actTypes: ActTypeService,
    private loaderService: LoaderService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    // if (this.selectedPlant) {
    //   this.actFilter.plantId = this.selectedPlant.plantId;
    // }
  }

  modalShow() {
    this.modal.active = true;
  }

  ngOnInit() {
    if(this.supplier) {
      this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'SUPPLIER')
      .then((result: any) => this.initResult(result)).catch(error => console.log(error));
      // this.actFilter.accountPosition = "SUPPLIER";
    }else if(this.customer) {
      this._actTypes.getbyPlantId_AccountPosition(this.selectedPlant?.plantId, 'CUSTOMER')
      .then((result: any) => this.initResult(result)).catch(error => console.log(error));
      // this.actFilter.accountPosition = "CUSTOMER";
    }
    // this.actFilter.plantId = this.selectedPlant?.plantId || this.plantId;
    // this.searchTerms.pipe(
    //   debounceTime(400),
    //   switchMap(term => this.actService.filter(this.actFilter))).subscribe(
    //   res => this.initResult(res['content']),
    //   error2 => this.initResult([])
    // );

    // this.searchTerms.next(this.actFilter);

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
    if (event && event.hasOwnProperty('actTypeId')) {
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
        if (obj['actTypeName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }

    return filtered;
  }

  setCustomer(customer) {
    // if (this.both || (this.supplier && customer.accountPosition === 'SUPPLIER') || (!this.supplier && customer.accountPosition === 'CUSTOMER')) {
    // this.selectedAct = {actName: customer.actName, actId: customer.actId};
      this.allActs.unshift(this.customer);
      this.handleDropdownClickForAct();
      this.onChangeAct(this.selectedAct);
    // }
  }

}
