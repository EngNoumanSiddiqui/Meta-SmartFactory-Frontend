import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {WorkCenterListDto} from '../../../dto/workcenter/workcenter.model';
import {WorkcenterService} from '../../../services/dto-services/workcenter/workcenter.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'workcenter-auto-complete',
  templateUrl: './workcenter-auto-complete.component.html',

})

export class WorkCenterAutoCompleteComponent implements OnInit {

  disabled = false;
  @Output() selectedWorkCenterEvent = new EventEmitter<any>();
  selectedWorkCenter: WorkCenterListDto;
  @Input() required: boolean;
  @Input() dropdown = true;
  workCenterId: any;
  @Input() addOption: boolean = false;

  @Input() addIfMissing = false;
  modal = {active: false};
  selectedPlant: any;

  @Input('plantId') set x (plantId) {
    if (plantId) {
      this.workcenterFilter.plantId = plantId;
      this.searchTerms.next(this.workcenterFilter);
    }
  }
  @Input('disabled')
  set y(disabled) {
    this.disabled = disabled;
  }
  @Input('selectedWorkCenter')

  set in(selectedWorkCenter) {
    this.selectedWorkCenter = selectedWorkCenter;
  }
  @Input('workCenterId') set inId(workCenterId) {
    console.log('workCenterId', workCenterId)
    this.workCenterId = workCenterId;
    if (this.workCenterId) {
      this.getDetailWorkCenter();
    } else {
      this.workCenterId = null;
    }
  }

  placeholder = 'no-data';
  filteredWorkCenter: Array<WorkCenterListDto>;

  workcenterFilter = {
    workCenterName: null,
    plantId: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'workCenterName'
  };

  private allWorkstations: Array<WorkCenterListDto>;
  private searchTerms = new Subject<any>();

  constructor(private workCenterService: WorkcenterService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.workcenterFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }

  setWorkCenter(workcenterId) {
    this.workCenterId = workcenterId;
    this.getDetailWorkCenter();
  }

  ngOnInit() {
    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.workCenterService.filterObservable(this.workcenterFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    if(this.workcenterFilter.plantId) {
      this.searchTerms.next(this.workcenterFilter);
    }
  }

  private  initResult(res) {
    // this.filteredWorkCenter = res;
    var workCenters = res;
    var option =  [{ workcenterId: '', workCenterName: 'All' }];
    
    if(this.addOption){
      this.allWorkstations = workCenters.concat(option).reverse();
    }else{
      this.allWorkstations = workCenters;
    }
    
    console.log('allWorkstations', this.allWorkstations)
    
    if (res.length > 0) {
      this.placeholder = 'search-workcenter';
    } else {
      this.placeholder = 'no-data';

    }
  }

  // searchWorkCenter(event) {
  //   this.workcenterFilter.workCenterName = event.query;
  //   this.searchTerms.next(this.workcenterFilter);
  // }
  //
  //
  // handleDropdownClickForWorkCenter() {
  //   this.workcenterFilter.workCenterName = null;
  //   this.searchTerms.next(this.workcenterFilter);
  // }
  //

  onChangeWorkCenter(event) {
    if (event && event.hasOwnProperty('workCenterId')) {
      this.selectedWorkCenterEvent.next(this.selectedWorkCenter);
    } else {
      this.selectedWorkCenterEvent.next(null);
    }
  }
  getDetailWorkCenter() {
    this.workCenterService.getDetail(this.workCenterId).then((res: any) => {
      this.selectedWorkCenter = res
      if(this.modal.active === true) {
        this.allWorkstations.unshift(this.selectedWorkCenter);
        this.modal.active = false;
      }
    }).catch(Err => console.error(Err));
  }
  searchWorkCenter(event) {
    this.filteredWorkCenter = this.filterMatched(event.query);
  }

  handleDropdownClickForWorkCenter() {
    this.filteredWorkCenter = [...this.allWorkstations];

    if ( this.filteredWorkCenter.length == 0) {
      this.workcenterFilter.workCenterName = null;
      this.searchTerms.next(this.workcenterFilter);
    }
  }
  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allWorkstations && this.allWorkstations.length > 0) {
      for (let i = 0; i < this.allWorkstations.length; i++) {
        const obj = this.allWorkstations[i];
        if (obj['workCenterName'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.workcenterFilter.workCenterName = query;
        this.searchTerms.next(this.workcenterFilter);
    }
    return filtered;
  }
}
