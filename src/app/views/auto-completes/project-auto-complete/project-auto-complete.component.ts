import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
import { ProjectService } from 'app/services/dto-services/project/project.service';

@Component({
  selector: 'project-auto-complete',
  templateUrl: './project-auto-complete.component.html',

})

export class ProjectAutoCompleteComponent implements OnInit {

  @Output() selectedProjectEvent = new EventEmitter<any>();

  selectedProject;

  @Input() required: boolean;

  @Input() dropdown = true;
  @Input() disabled = false;

  selectedPlant: any;

  @Input('selectedProject') set in(selectedProject) {
    if (selectedProject) {
      this.selectedProject = selectedProject;
    } else {
      this.selectedProject = null;
    }
  }

  @Input('plantId') set inplantId(plantId) {
    if (plantId) {
      this.projectFilter.plantId = plantId;
      this.searchTerms.next(this.projectFilter);
    } else {
      this.projectFilter.plantId = null;
    }
  }

  @Input('projectId') set inProjectId(ProjectId) {
    if (ProjectId) {
      this.getProjectDetail(ProjectId);
    }
  }


  placeholder = 'no-data';

  filteredProject: Array<any>;

  projectFilter = {
    code: null,
    name: null,
    projectId: null,
    orderByDirection: 'desc',
    orderByProperty: 'projectId',
    plantId: null,
    pageNumber: 1,
    pageSize: 9999,
    query: null
  };

  @Input() addIfMissing = true;

  modal = {active: false};

  private allProjects: Array<any>;

  private searchTerms = new Subject<any>();

  constructor(
    private projectService: ProjectService,
    private loadingService: LoaderService,
    private _userSvc: UsersService,
    private utilities: UtilitiesService) {
      // const setPlant = this._userSvc.getPlant();
      // this.selectedPlant = JSON.parse(setPlant);
      // if (this.selectedPlant) {
      //   this.projectFilter.plantId = this.selectedPlant.plantId;
      // }

  }

  modalShow() {
    this.modal.active = true;
  }
  

  
  getProjectDetail(ProjectId) {
    if (ProjectId) {
      this.projectService.getDetail(ProjectId).then((rs: any) => {
        this.selectedProject = rs;
      });
    }

  }
  ngOnInit() {

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this.projectService.filter(this.projectFilter)))
      .subscribe( res => this.initResult(res['content']),error2 => this.initResult([])
    );

    const setPlant = this._userSvc.getPlant();
    this.selectedPlant = JSON.parse(setPlant);
    if (this.selectedPlant) {
      this.projectFilter.plantId = this.selectedPlant.plantId;
      this.searchTerms.next(this.projectFilter);
    }

    
    
  }

  private initResult(res) {
    // this.filteredProject = res;
    this.allProjects = res;
    if (res && res.length > 0) {
      this.placeholder = 'search-project';
    } else {
      this.placeholder = 'no-data';
    }
  }


  onChangeProject(event) {
    if (event && event.hasOwnProperty('projectId')) {
      this.selectedProjectEvent.next(this.selectedProject);
    } else {
      this.selectedProjectEvent.next(null);
    }
  }

  searchProject(event) {
    this.filteredProject = this.filterMatched(event.query);
    if (this.filteredProject.length == 0) {
      this.projectFilter.name = event.query;
      this.searchTerms.next(this.projectFilter);
    }
  }

  handleDropdownClickForBatch() {
    this.filteredProject = [...this.allProjects];
    if (this.filteredProject.length == 0) {
      this.projectFilter.name = null;
      this.projectFilter.code = null;
      this.searchTerms.next(this.projectFilter);
    }
  }

  filterMatched(query): any[] {
    const filtered: any[] = [];
    if (this.allProjects && this.allProjects.length > 0) {
      for (let i = 0; i < this.allProjects.length; i++) {
        const obj = this.allProjects[i];
        if (obj['name'].toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
          obj['code'].toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(obj);
        }
      }
    }
    return filtered;
  }

}
