import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ForkLiftService } from 'app/services/dto-services/forklift.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'forklift-auto-complete',
  templateUrl: './forklift-auto-complete.component.html',

})

export class ForkLiftAutoCompleteComponent implements OnInit {

  @Output() selectedForkLiftEvent = new EventEmitter<any>();
  selectedForkLift;
  @Input() required: boolean;
  @Input() dropdown = true;
  @Input('selectedForkLift')
  set in(selectedForkLift) {
    if (selectedForkLift) {
      this.selectedForkLift = selectedForkLift;
    } else {
      this.selectedForkLift = null;
    }
  }

  @Input('selectedForkLiftId')  set a(selectedForkLiftId) {
    if(selectedForkLiftId) {
      this.getForkLiftDetail(selectedForkLiftId);   
    }
    // this.ForkLiftFilter.forkliftId = selectedForkLiftId;
  
  }

 


  placeholder = 'no-data';
  filteredForkLift: Array<any>;

  ForkLiftFilter = {
    pageSize: 9999,
    forkliftId: null,
    forkliftName: null,
    forkliftNo: null,
    forkliftStatus: null,
    createDate: null,
    updateDate: null,
    plantId: null,
    query: null,
    wareHouseId: null,
    wareHouseName: null,
    pageNumber: 1,
    orderByProperty: 'forkliftId'
  };
  @Input() addIfMissing = false;
  @Input() disabled = false;

  modal = {active: false};

  private allForkLifts: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private forkLiftService: ForkLiftService, private loadingService: LoaderService,
    private _userSvc: UsersService,
     private utilities: UtilitiesService) {
      let selectedPlant = JSON.parse(this._userSvc.getPlant());
      this.ForkLiftFilter.plantId = selectedPlant ? selectedPlant.plantId : null;
  }

  modalShow() {
  }
  hasInt(ForkLiftCode): string {
    let i = 1;
    const a = ForkLiftCode.split(''); let b = '', c = '';
    a.forEach((e) => {
     if (!isNaN(e)) {
      //  console.log(`CONTAIN NUMBER «${e}» AT POSITION ${a.indexOf(e)} => TOTAL COUNT ${i}`)
       c += e
       i++
     } else {b += e}
   })
   console.log(`STRING IS «${b}», NUMBER IS «${c}»`)
   // tslint:disable-next-line: radix
   return b + '' + (parseInt(c) + 1).toString();
  //  if (i === 0) {
  //     return false
  //     // return b
  //  } else {
  //     return true
  //     // return +c
  //  }
  }

  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.forkLiftService.filterObservable(this.ForkLiftFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.ForkLiftFilter);
  }

  private getForkLiftDetail(forkId) {
    this.forkLiftService.getUpdateDetail(forkId).then(res => {
      this.selectedForkLift = res;
      this.onChangeForkLift(this.selectedForkLift);
    })
  }

  private  initResult(res) {
    // this.filteredForkLift = res;
    this.allForkLifts = res;
    if (res && res.length > 0) {
      this.placeholder = 'search-forklift';
    } else {
      this.placeholder = 'no-data';
      this.selectedForkLift = null;
      this.onChangeForkLift(this.selectedForkLift);
    }
  }


  onChangeForkLift(event) {
    if (event && event.hasOwnProperty('forkliftId')) {
      this.selectedForkLiftEvent.next(this.selectedForkLift);
    } else {
      this.selectedForkLiftEvent.next(null);
    }
  }

  searchForkLift(event) {
    this.filteredForkLift = this.filterMatched(event.query);
  }

  handleDropdownClickForForkLift() {
    this.filteredForkLift = [...this.allForkLifts];

    if (this.filteredForkLift.length == 0) {
      this.ForkLiftFilter.forkliftName = null;
      this.searchTerms.next(this.ForkLiftFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allForkLifts && this.allForkLifts.length > 0) {
      for (let i = 0; i < this.allForkLifts.length; i++) {
        const obj = this.allForkLifts[i];
        if (obj['forkliftName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.ForkLiftFilter.forkliftName = query;
      this.searchTerms.next(this.ForkLiftFilter);
    }
    return filtered;
  }

  setForkLift(ForkLift) {

    if (ForkLift) {
      this.selectedForkLift = ForkLift;
      this.allForkLifts.push(ForkLift);
      this.handleDropdownClickForForkLift()
      this.onChangeForkLift(this.selectedForkLift);
    }
  }

}
