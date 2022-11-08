import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {EquipmentPlannerGroupService} from '../../../services/dto-services/maintenance-equipment/planner-group.service';
import { UsersService } from 'app/services/users/users.service';


@Component({
  selector: 'planner-group-auto-complete',
  templateUrl: './planner-group-auto-complete.component.html',

})

export class PlannerGroupAutoCompleteComponent implements OnInit {

  @Output() selectedPlannerGroupEvent = new EventEmitter<any>();
  selectedPlannerGroup;
  @Input() required: boolean;
  @Input() dropdown=true;
  @Input() disabled = false;
  selectedPlant: any;
  @Input('selectedPlannerGroup') set in(selectedPlannerGroup) {
    if(selectedPlannerGroup) {
      this.selectedPlannerGroup = selectedPlannerGroup;
    }
  }

  @Input('selectedPlannerGroupId') set inID(selectedPlannerGroupId) {
    if(selectedPlannerGroupId) {
      const me =this;
      if(!this.selectedPlannerGroup || (selectedPlannerGroupId && this.selectedPlannerGroup && (this.selectedPlannerGroup.plannerGroupId !== selectedPlannerGroupId))) {
        me.details(selectedPlannerGroupId);
      }
    }
  }

  @Input('plantId') set setPlantId(plantId) {
    if (plantId) {
      this.plannerGroupFilter.plantId = plantId;
      this.searchTerms.next(this.plannerGroupFilter);
    } else {
      this.plannerGroupFilter.plantId = null;
    }
  }

  placeholder = 'no-data';
  filteredPlannerGroup: Array<any>;

  plannerGroupFilter = {
    plannerGroup: null,
    pageSize: 500,
    pageNumber: 1,
    orderByProperty: 'plannerGroup',
    plantId: null
  };
  @Input() addIfMissing = false;

  modal = {active: false};

  private allPlannerGroups: Array<any>;
  private searchTerms = new Subject<any>();

  constructor(private plannerGroupService: EquipmentPlannerGroupService, private _userSvc: UsersService) {
    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.plannerGroupFilter.plantId = this.selectedPlant.plantId;
    }
  }

  modalShow() {
    this.modal.active = true;
  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.plannerGroupService.filterSharedObservable(this.plannerGroupFilter))).subscribe(
      res => this.initResult(res['content']),
      error2 => this.initResult([])
    );
    this.searchTerms.next(this.plannerGroupFilter);
  }

  private  initResult(res) {
    // this.filteredPlannerGroup = res;
    this.allPlannerGroups = res;
    if (res.length > 0) {
      this.placeholder = 'search-planner-group';
    } else {
      this.placeholder = 'no-data';

    }
  }

  private details(id) {
    this.plannerGroupService.getDetail(id).then((res: any) => {
      this.selectedPlannerGroup = res;
      this.onChangePlannerGroup(res);
    }).catch(err => console.error(err));
  }


  onChangePlannerGroup(event) {
    if (event && event.hasOwnProperty('plannerGroupId')) {
      this.selectedPlannerGroupEvent.next(this.selectedPlannerGroup);
    } else {
      this.selectedPlannerGroupEvent.next(null);
    }
  }

  searchPlannerGroup(event) {
    this.filteredPlannerGroup = this.filterMatched(event.query);
  }

  handleDropdownClickForPlannerGroup() {
    this.filteredPlannerGroup = [...this.allPlannerGroups];

    if (this.filteredPlannerGroup.length == 0) {
      this.plannerGroupFilter.plannerGroup = null;
      this.searchTerms.next(this.plannerGroupFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allPlannerGroups && this.allPlannerGroups.length > 0) {
      for (let i = 0; i < this.allPlannerGroups.length; i++) {
        const obj = this.allPlannerGroups[i];
        if (obj['plannerGroup'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length == 0) {
      this.plannerGroupFilter.plannerGroup = query;
      this.searchTerms.next(this.plannerGroupFilter);
    }
    return filtered;
  }

  setPlannerGroup(plannerGroup) {

    if (plannerGroup) {
      this.selectedPlannerGroup = plannerGroup;
      this.allPlannerGroups.push(plannerGroup);
      this.handleDropdownClickForPlannerGroup()
      this.onChangePlannerGroup(this.selectedPlannerGroup);
    }
  }

}
