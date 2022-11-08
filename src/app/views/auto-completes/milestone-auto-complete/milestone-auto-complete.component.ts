import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { ProjectService } from 'app/services/dto-services/project/project.service';

@Component({
  selector: 'milestone-auto-complete',
  templateUrl: './milestone-auto-complete.component.html',

})

export class MilestoneAutoCompleteComponent implements OnInit {

  @Output() selectedMilestoneEvent = new EventEmitter<any>();

  selectedMilestone;

  @Input() required: boolean;

  @Input() dropdown = true;
  @Input() disabled = false;

  selectedPlant: any;

  @Input('selectedMilestone') set in(selectedMilestone) {
    if (selectedMilestone) {
      this.selectedMilestone = selectedMilestone;
    } else {
      this.selectedMilestone = null;
    }
  }

  @Input('plantId') set inplantId(plantId) {
    if (plantId) {
      this.milestoneFilter.plantId = plantId;
      this.searchTerms.next(this.milestoneFilter);
    } else {
      this.milestoneFilter.plantId = null;
    }
  }
  @Input('projectId') set inprojectId(projectId) {
    if (projectId) {
      this.milestoneFilter.projectId = projectId;
      this.searchTerms.next(this.milestoneFilter);
    } else {
      this.milestoneFilter.projectId = null;
    }
  }

  @Input('milestoneId') set inMilestoneId(MilestoneId) {
    if (MilestoneId) {
      this.getMilestoneDetail(MilestoneId);
    }
  }


  placeholder = 'no-data';

  filteredMilestone: Array<any>;

  milestoneFilter = {
    code: null,
    name: null,
    milestoneId: null,
    orderByDirection: 'desc',
    orderByProperty: 'milestoneId',
    plantId: null,
    projectId: null,
    pageNumber: 1,
    pageSize: 999999,
    query: null
  };

  @Input() addIfMissing = true;

  modal = {active: false};

  private allMilestones: Array<any>;

  private searchTerms = new Subject<any>();

  constructor(
    private projectService: ProjectService,
    private loadingService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService) {
      // const setPlant = this._userSvc.getPlant();
      // this.selectedPlant = JSON.parse(setPlant);
      // if (this.selectedPlant) {
      //   this.MilestoneFilter.plantId = this.selectedPlant.plantId;
      // }

  }

  modalShow() {
    this.modal.active = true;
  }
  

  
  getMilestoneDetail(MilestoneId) {
    if (MilestoneId) {
      this.projectService.getMilestoneDetail(MilestoneId).then((rs: any) => {
        this.selectedMilestone = rs;
      });
    }

  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.projectService.filterMilestone(this.milestoneFilter)))
      .subscribe( res => this.initResult(res['content']),error2 => this.initResult([])
    );

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.milestoneFilter.plantId = this.selectedPlant.plantId;
      this.searchTerms.next(this.milestoneFilter);
    }

    
    
  }

  private initResult(res) {
    // this.filteredMilestone = res;
    this.allMilestones = res;
    if (res && res.length > 0) {
      this.placeholder = 'search-milestone';
    } else {
      this.placeholder = 'no-data';
    }
  }


  onChangeMilestone(event) {
    if (event && event.hasOwnProperty('milestoneId')) {
      this.selectedMilestoneEvent.next(this.selectedMilestone);
    } else {
      this.selectedMilestoneEvent.next(null);
    }
  }

  searchMilestone(event) {
    this.filteredMilestone = this.filterMatched(event.query);
    if (this.filteredMilestone.length == 0) {
      this.milestoneFilter.name = event.query;
      this.searchTerms.next(this.milestoneFilter);
    }
  }

  handleDropdownClickForBatch() {
    this.filteredMilestone = [...this.allMilestones];
    if (this.filteredMilestone.length == 0) {
      this.milestoneFilter.name = null;
      this.milestoneFilter.code = null;
      this.searchTerms.next(this.milestoneFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allMilestones && this.allMilestones.length > 0) {
      for (let i = 0; i < this.allMilestones.length; i++) {
        const obj = this.allMilestones[i];
        if (obj['name'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          obj['code'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }

}
