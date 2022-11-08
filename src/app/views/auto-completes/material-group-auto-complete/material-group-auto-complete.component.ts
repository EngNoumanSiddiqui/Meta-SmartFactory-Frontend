import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { AppStateService } from 'app/services/dto-services/app-state.service';

import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { PlantService } from 'app/services/dto-services/plant/plant.service';


@Component({
  selector: 'material-group-auto-complete',
  templateUrl: './material-group-auto-complete.component.html',

})

export class MaterialGroupAutoCompleteComponent implements OnInit, OnDestroy {

  @Output() selectedMaterialGroupEvent = new EventEmitter<any>();
  selectedMaterialGroup: any;
  selectedMaterialGroupId: any;
  @Input() required: boolean = false;
  @Input() disabled: boolean;
  @Input() dropdown = true;
  sub: Subscription;
  @Input() addIfMissing = false;
  modal = {active: false};
  selectedPlant = null;
  isSetDefaultSelected: boolean = false;

  @Input('selectedMaterialGroup')  set in(selectedMaterialGroup) {
    this.selectedMaterialGroup = selectedMaterialGroup;
  }
  @Input('selectedMaterialGroupNo')  set inMaterialGroupNo(selectedMaterialGroupNo) {
    if(selectedMaterialGroupNo) {
      this.selectedMaterialGroup = {groupCode: selectedMaterialGroupNo};
    }
  }

  @Input('selectedMaterialGroupId')  set inId(selectedMaterialGroupId) {
    if(selectedMaterialGroupId) {
      this.selectedMaterialGroupId = selectedMaterialGroupId;
    }
  }

  placeholder = 'no-data';
  filteredMaterialGroups: Array<any>;
  private allMaterialGroups: Array<any>;
  private searchTermMaterialGroups = new Subject<any>();

  constructor(private materailGroupService: PlantService,
     private appStateSvc: AppStateService) {
    
  }

  modalShow() {
    this.modal.active = true;
  }


  ngOnInit() {
    this.searchTermMaterialGroups.pipe(
      debounceTime(400),
      switchMap(term => this.materailGroupService.getSelectedPlantMaterialGroup(this.selectedPlant?.plantId))).subscribe(
      res => this.initResult(res),
      error2 => this.initResult([])
    );
    
    this.sub = this.appStateSvc.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.searchTermMaterialGroups.next();  
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private  initResult(res) {
    this.allMaterialGroups = res;
    
    if (res.length > 0) {
      this.placeholder = 'search-material-group';
      if(this.selectedMaterialGroupId) {
        this.selectedMaterialGroup = this.allMaterialGroups.find(itm => itm.stockGroupId == this.selectedMaterialGroupId) || null;
      }
    } else {
      this.placeholder = 'no-data';
    }
  }

  // getDetailMaterialGroup() {
  //   this.materailGroupService.get(this.selectedMaterialGroupId).then(res => {
  //     this.selectedMaterialGroup = res;
  //   }).catch(Err => console.error(Err));
  // }

  onChangeMaterialGroup(event) {
    // console.log('@onChangeMaterialGroup', event);
    if (event && event.hasOwnProperty('stockGroupId')) {
      this.selectedMaterialGroupEvent.next(this.selectedMaterialGroup);
    } else {
      this.selectedMaterialGroupEvent.next(null);
    }
  }

  searchWareHouse(event) {
    this.filteredMaterialGroups = this.filterMatched(event.query);
  }

  onSave(res) {
    if(res) {
      this.selectedMaterialGroup = res;
      this.allMaterialGroups.unshift({...res});
      this.onChangeMaterialGroup(this.selectedMaterialGroup);
      this.modal.active = false;
    }
  }

  // getDetails(id) {
  //   if (id) {
  //     this.materailGroupService.getMilestoneDetail(MilestoneId).then((rs: any) => {
  //       this.selectedMilestone = rs;
  //     });
  //   }

  // }


  handleDropdownClickForWareHouse() {
    this.filteredMaterialGroups = [...this.allMaterialGroups];
    if (this.filteredMaterialGroups.length === 0) {
      this.searchTermMaterialGroups.next();
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMaterialGroups && this.allMaterialGroups.length > 0) {
      for (let i = 0; i < this.allMaterialGroups.length; i++) {
        const obj = this.allMaterialGroups[i];
        if (obj['groupCode'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
        obj['groupDescription'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    if (filtered.length === 0) {
      this.searchTermMaterialGroups.next();
    }
    return filtered;
  }
}
