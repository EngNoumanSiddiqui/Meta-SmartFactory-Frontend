import {Component, OnInit, OnDestroy} from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ConvertUtil } from 'app/util/convert-util';
import { DatePipe } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { UtilitiesService } from 'app/services/utilities.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProjectService } from 'app/services/dto-services/project/project.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { ProjectStaticService } from 'app/services/dto-services/project/project-static.service';
import { AuthService } from 'app/services/auth/auth-service';
@Component({
  selector: 'project-auto-scheduler',
  templateUrl: './project-auto-scheduler.component.html',
  styleUrls: ['./project-auto-scheduler.component.scss'],
  providers: [DatePipe]
})
export class ProjectAutoSchedulerComponent implements OnInit, OnDestroy {
  sub: Subscription[] = [];
  calendarDate = null;
  searchBy = 'searchbyplanned';
  showBy='all';
  presetView = 'dayAndWeek';
  max: number = 0;
  selectedPlant: any;
  responseWorkCenterByWorkStationAndJobOrderDto: any;
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 100,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 200, 500, 1000],
    rows: 100,
    tag: ''
  };
  requestScheduleProjectDto = {
    pageNumber: 1,
    pageSize: 100,
    actualFinishDate: null,
    actualStartDate: null,
    code: null,
    description: null,
    employeeId: null,
    employeeName: null,
    employeeNo: null,
    finishDate: null,
    name: null,
    orderByDirection: 'projectId',
    orderByProperty: 'desc',
    plantId: null,
    projectId: null,
    query: null,
    erpPlannedStartDate: null,
    erpPlannedFinishDate: null,
    scheduledFinishDate: null,
    scheduledStartDate: null,
    startDate: null,
    status: null,
  };
  params = {
    dialog: {title: '', inputValue: '', visible: false},
  };
  weightValues = ['1', '2', '3', '4', '5'];
  stopCauseList;
  workcenters;
  loadedWorkCenter;
  selectedWorkCenters = [{workCenterName: 'All', workCenterId: -1}];
  filterWorkcenter = {pageNumber: 1, pageSize: 500, workCenterName: '', plantId: null};
  
  Data = null;

  private searchTerms = new Subject<any>();
  
  constructor( private appStateService: AppStateService, private utilities: UtilitiesService,
    private loaderService: LoaderService,
    private authService: AuthService,
     private projectService: ProjectService) {
     }

  ngOnInit() {
    this.authService.disableAuthChecking();
    this.sub.push(this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        // this.pageFilter.plantId = null;
        this.selectedPlant = res;
        this.filterWorkcenter.plantId = res.plantId;
        this.requestScheduleProjectDto.plantId = res.plantId;
        // this.filter();
      } else {
        this.selectedPlant = null;
        this.filterWorkcenter.plantId = null;
      }
    }));
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => this.projectService.filter(term))).subscribe((res: any) => {
        this.Data = res['content'];
        this.pagination.currentPage = res['currentPage'];
        this.pagination.totalElements = res['totalElements'];
        this.pagination.totalPages = res['totalPages'];
        this.loaderService.hideLoader();
      }, err => { 
        console.log(err);
        this.Data = null;
        this.loaderService.hideLoader(); 
      });
  }

  filter() {
    const temp = Object.assign({}, this.requestScheduleProjectDto);
    if (temp.startDate) {
      temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }
    if (temp.scheduledStartDate) {
      temp.scheduledStartDate = ConvertUtil.date2StartOfDay(temp.scheduledStartDate);
      temp.scheduledStartDate = ConvertUtil.localDateShiftAsUTC(temp.scheduledStartDate);
    }
    if (temp.scheduledFinishDate) {
      temp.scheduledFinishDate = ConvertUtil.date2EndOfDay(temp.scheduledFinishDate);
      temp.scheduledFinishDate = ConvertUtil.localDateShiftAsUTC(temp.scheduledFinishDate);
    }
    if (temp.erpPlannedStartDate) {
      temp.erpPlannedStartDate = ConvertUtil.date2StartOfDay(temp.erpPlannedStartDate);
      temp.erpPlannedStartDate = ConvertUtil.localDateShiftAsUTC(temp.erpPlannedStartDate);
    }
    if (temp.erpPlannedFinishDate) {
      temp.erpPlannedFinishDate = ConvertUtil.date2EndOfDay(temp.erpPlannedFinishDate);
      temp.erpPlannedFinishDate = ConvertUtil.localDateShiftAsUTC(temp.erpPlannedFinishDate);
    }

    this.loaderService.showLoader();
    this.searchTerms.next(temp);
    
  }

  

  ngOnDestroy() {
    this.authService.enableAuthChecking();
    this.sub.forEach(s => s.unsubscribe());
  }

  onSearchByChanged(event) {
    if(this.searchBy === 'searchbyplanned') {
      this.requestScheduleProjectDto.startDate = this.requestScheduleProjectDto.scheduledStartDate || this.requestScheduleProjectDto.erpPlannedStartDate;
      this.requestScheduleProjectDto.finishDate = this.requestScheduleProjectDto.scheduledFinishDate || this.requestScheduleProjectDto.erpPlannedFinishDate;
      this.requestScheduleProjectDto.scheduledStartDate = null;
      this.requestScheduleProjectDto.scheduledFinishDate = null;
      this.requestScheduleProjectDto.erpPlannedStartDate  = null;
      this.requestScheduleProjectDto.erpPlannedFinishDate = null;
    } else if(this.searchBy === 'searchbyscheduled') {
      this.requestScheduleProjectDto.scheduledStartDate = this.requestScheduleProjectDto.startDate || this.requestScheduleProjectDto.erpPlannedStartDate;
      this.requestScheduleProjectDto.scheduledFinishDate = this.requestScheduleProjectDto.finishDate || this.requestScheduleProjectDto.erpPlannedFinishDate;
      this.requestScheduleProjectDto.erpPlannedStartDate = null;
      this.requestScheduleProjectDto.erpPlannedFinishDate= null;
      this.requestScheduleProjectDto.startDate = null;
      this.requestScheduleProjectDto.finishDate = null;
    } else {
      this.requestScheduleProjectDto.erpPlannedStartDate = this.requestScheduleProjectDto.startDate || this.requestScheduleProjectDto.scheduledStartDate;
      this.requestScheduleProjectDto.erpPlannedFinishDate = this.requestScheduleProjectDto.finishDate || this.requestScheduleProjectDto.scheduledFinishDate;
      this.requestScheduleProjectDto.startDate = null;
      this.requestScheduleProjectDto.finishDate = null;
      this.requestScheduleProjectDto.scheduledStartDate = null;
      this.requestScheduleProjectDto.scheduledFinishDate = null;
    }
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;
    this.requestScheduleProjectDto.pageNumber = this.pagination.pageNumber;
    this.requestScheduleProjectDto.pageSize = this.pagination.pageSize;
    this.requestScheduleProjectDto.query = this.pagination.tag;
    this.filter();
  }


  exportToPDF() {
    ProjectStaticService.exportPDF();
  }

  exportToExcel() {
    ProjectStaticService.exportExcel();
  }

  filterEvents(name, value) {
    // ProjectStaticService.filterBy({name, value});
    this.requestScheduleProjectDto.code = value;
    this.filter();
  }
  
  onDateChange(date) {
    ProjectStaticService.navigateToDate(date);
  }
  

}
