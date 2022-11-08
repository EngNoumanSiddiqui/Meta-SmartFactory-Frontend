import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {DateHelper, EventHelper} from 'scheduler';
import zipcelx from 'zipcelx';

import { EmployeeService } from 'app/services/dto-services/employee/employee.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { ConvertUtil } from 'app/util/convert-util';
import { environment } from 'environments/environment';
import { DatePipe } from '@angular/common';
import { Subscription, Subject } from 'rxjs';
import { SchedulerComponent } from 'app/components/scheduler/scheduler.component';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StopCauseService } from 'app/services/dto-services/stop-cause/stop-cause.service';

import * as moment from 'moment';
import { debounceTime, switchMap } from 'rxjs/operators';
import { JobOrderStatusEnum } from 'app/dto/job-order/job-order.model';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';

declare var window: any;
@Component({
  selector: 'labor-auto-scheduler',
  templateUrl: './labor-auto-scheduler.component.html',
  styleUrls: ['./labor-auto-scheduler.component.scss'],
  providers: [DatePipe]
})
export class LaborAutoSchedulerComponent implements OnInit, AfterViewInit, OnDestroy {

  responseLaborSchedular: any = [];

  sub: Subscription;

  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
    rows: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    tag: ''
  };

  allocationParams = {
    dialog: {title: '', data: '', visible: false},
  };

  options: any;

  barData: any;
  max: number = 0;


  findTotalHeight() {
    var topDiv = document.getElementById("topDiv").offsetHeight;
    //var midDiv = document.getElementById("midDiv").offsetHeight;
    var allocationDiv = 35;
    var paddingContainer = 20;
    var header = 55;
    var footer = 50;
    var menuHeading = 50;

    var getTotalHeightWithoutScheduler = topDiv +  allocationDiv + paddingContainer +  header + footer + menuHeading;

    return getTotalHeightWithoutScheduler;

  }

  @ViewChild(SchedulerComponent)
  set ft(scheduler: SchedulerComponent) {
    this.scheduler = scheduler;
    if (scheduler) {
      const me = this;
      /**
       * With event helper we can add listener to specific cell template
       * in below example we add listener to button with id #concatEvent
       * */
      EventHelper.addListener({
        element: scheduler.getSchedulerEngine().element,
        delegate: '#concatEvent',
        click(event) {
          const record = scheduler.getSchedulerEngine().getRecordFromElement(event.target);
          if (record) {
            me.concatEventOfRecord(record);
          }
        }
      });
      EventHelper.addListener({
        element: scheduler.getSchedulerEngine().element,
        delegate: '#employeeId',
        click(event) {
          const record = scheduler.getSchedulerEngine().getRecordFromElement(event.target);
          if (record && record.employeeId) {
            me.loaderService.showDetailDialog(DialogTypeEnum.STAFF, record.employeeId);
          }
        }
      });
      EventHelper.addListener({
        element: scheduler.getSchedulerEngine().element,
        delegate: '#allocationByShift',
        click(event) {
          const record = scheduler.getSchedulerEngine().getRecordFromElement(event.target);
          if (record && record.data && record.data.id) {
              me.showAllcationByShiftGraph(record);
          }
        }
      });
    }
  };

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  @ViewChild('settingsModal') public settingsModal: ModalDirective;
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('allocationModal') public allocationModal: ModalDirective;

  selectedPlant: any;
  presetView = 'dayAndWeek';

  workstations;
  selectedRecord;

  responseWorkCenterByWorkStationAndJobOrderDto: any;
  requestScheduleLaborDto = {
      employeeAssignmentId: null,
      employeeId: null,
      employeeName: null,
      finishDate: null,
      jobOrderId: null,
      orderByDirection: 'desc',
      orderByProperty: 'employeeName',
      pageNumber: 1,
      pageSize: 100000,
      plantId: null,
      query: null,
      startDate: null,
      workStationId: null,
  };
  showEmptyJobs = false;
  params = {
    dialog: {title: '', inputValue: '', visible: false},
  };
  weightValues = ['1', '2', '3', '4', '5'];
  stopCauseList;

  shiftWeekend = false;
  workcenters;
  showLoader = false;
  loadedWorkCenter;
  selectedWorkCenters = [{workCenterName: 'All', workCenterId: -1}];
  filterWorkcenter = {pageNumber: 1, pageSize: 500, workCenterName: '', plantId: null};
  // bind properties from the application to the scheduler component
  rowHeight = 50;
  selectedEvent = '';
  resources = [];
  events = [];
  // timeRanges = [];
  featuretimeRanges: any;
  barMargin = 5;
  startDate;
  endDate;
  totalAllocationAverage = 0;
  columns = [
    {text: 'Workstation Id', field: 'id', hidden: true, width: 100},
    // {text: 'Employee Id', field: 'employeeId', width: 100, editor: false },
    {
      text: 'Employee Id', field: 'employeeId', type: 'template', editor: false, filterable: false, hidden: false,
      showEventCount: false, width: 100,
      template: ((value, record, field) => `<a href="javascript:void;" id="employeeId">${value.value}</a>`)
    },
    {text: 'Employee No', field: 'employeeNo', editor: false, showEventCount: false, width: 100},
    {text: 'Employee Name', field: 'employeeName', editor: false, showEventCount: false, flex: 1,
      renderer({cellElement, record}) {
        const eventColors = [
          // 'red', this is reserved for event not draggable
          'green', 'blue', 'yellow', 'purple', 'cyan', 'indigo', 'orange', 'lime', 'teal', 'pink', 'violet'];
        const resourceColors = [
          // '#EF5350',
          '#66BB6A',
          '#42A5F5',
          '#FDD835',
          '#AB47BC',
          '#26C6DA',
          '#5C6BC0',
          '#FFA726',
          '#c5d252',
          '#26A69A',
          '#EC407A',
          '#7E57C2'];
        const num = record?.employeeId % 11;
        const color = num ? eventColors[num] : eventColors[1];
        const rcolor = num ? resourceColors[num] : resourceColors[2];
        if (cellElement) {
        cellElement.style.backgroundColor = rcolor;
        cellElement.style.color = '#fff';
        cellElement.style.fontWeight = 400;
        // record.eventColor = color;
        }

        return record.employeeName;
      },

    },
    // {text: 'Workstation', field: 'workStationName', editor: false, showEventCount: false, width: 120},
    // {text: 'Start Date', field: 'startDate', editor: false, showEventCount: false},
    // {text: 'Finish Date', field: 'finishDate', editor: false, showEventCount: false},
    {
      text: 'Allocation', flex: 1,
      editor: false,
      filterable: false,
      field: 'employeeAllocation', showEventCount: false,
      type: 'percent'
    },
    {
      type    : 'action',
      text    : 'Action',
      width   : 45,
      align   : 'center',
      actions : [{
        cls     : 'b-fa b-fa-fw b-fa-line-chart',
        renderer : ({ action, record }) => {
          if(record.employeeAllocation > 0) {
            return `
              <button type="button" class="btn btn-primary" 
              data-toggle="tooltip" data-placement="top" title="Show Allocation By Shift"
              style="margin-left: 10%;" id="allocationByShift"><i class="fa fa-line-chart"></i></button>
            `
          } else {
            return '';
          }
        },
        tooltip : 'Report',
        onClick : ({ record }) => {
            // await schedulerPro.project.addEvent({
            //     name         : 'New task',
            //     startDate    : schedulerPro.startDate,
            //     duration     : 4,
            //     durationUnit : 'h',
            //     resourceId   : record.id
            // });

            // schedulerPro.editEvent(schedulerPro.eventStore.last);
        }
      }]
    }

    // {
    //   type: 'template',
    //   text: 'Concat',
    //   showEventCount: false,
    //   editor: false,
    //   template: (value, record, field) => `<button class="btn btn-info" id="concatEvent">Concat</button>`
    // },
  ];
  calendarDate;

  eventDrag = {
    validatorFn: (context) => {
      const task = context.draggedRecords[0],
        newResource = context.newResource;
      // if (newResource.get('workCenterName') !== task.resource.get('workCenterName')) {
      //   return {
      //     valid: false,
      //     message: 'allowed to drag in workcenter ' + task.resource.get('workCenterName')
      //   };
      // }
    }
  };
  eventResize = {
    validatorFn: (context) => {
      const task = context.eventRecord,
      originalDuration = task.endDate - task.startDate;

      // if (task.status === JobOrderStatusEnum.PROCESSING) {
      //   return {
      //     valid: false,
      //     message: 'Cannot change the length of a processing job!'
      //   };
      // }
    }
  };

  pdfExport = {
    // exportServer : 'http://localhost:8080'
    exportServer : 'https://dev.bryntum.com:8082'

  };

  excelExporter = {
    zipcelx,
    dateFormat: 'YYYY-MM-DD HH:mm',
    exporterConfig: {
      // Choose the columns to include in the exported file

      columns: [
        { text: 'Employee Id', field: 'employeeId', width: 350 },
        { text: 'Employee No', field: 'employeeNo', width: 350 },
        { text: 'Employee Name', field: 'employeeName', width: 350 },
        { text: 'Allocation %', field: 'employeeAllocation', type: 'number', width: 120 },
        { text: 'Dummy', field: 'dummy', width: 350 },

      ],
      eventColumns: [
        { text: 'Reference Id', field: 'referenceId', width: 500 },
        { text: 'Job Order Id', field: 'jobOrderId', width: 500 },
        { text: 'Job Order Operation Id', field: 'jobOrderOperationId', width: 500 },
        { text: 'Start Date', field: 'startDate', width: 500 },
        { text: 'Finish Date', field: 'endDate', width: 500 },
        { text: 'Workstation No', field: 'workStationNo', width: 500 },
        { text: 'Workstation Name', field: 'workStationName', width: 500 },
        { text: 'Setup', field: 'setup', width: 500 },
      ]
    }

    // Choose the date format for date fields
    // dateFormat : 'YYYY-MM-DD HH:mm',

    // exporterConfig : {
    //     // Choose the columns to include in the exported file
    //     columns : ['name', 'role']
    // }
  };

// modify right click event menu
  eventContextMenu = {
    // Add extra items shown for each event
    // extraItems: [
    //   {
    //     text: 'Move left',
    //     icon: 'b-fa b-fa-fw b-fa-arrow-left',
    //     cls: 'b-separator',
    //     onItem({eventRecord}) {
    //       eventRecord.startDate = DateHelper.add(eventRecord.startDate, -1, 'hour');
    //     }
    //   },
    //   {
    //     text: 'Move right',
    //     icon: 'b-fa b-fa-fw b-fa-arrow-right',
    //     onItem({eventRecord}) {
    //       eventRecord.startDate = DateHelper.add(eventRecord.startDate, 1, 'hour');
    //     }
    //   }
    // ],

// Process items before context menu is shown, add or remove or prevent it
    processItems({eventRecord, items}) {
      // if (eventRecord.eventType === 'meeting') {
      //   // Add a custom item for meetings
      //   items.push({
      //     text: 'Cancel',
      //     icon: 'b-fa b-fa-fw b-fa-ban',
      //     cls: 'b-separator',
      //     onItem({eventRecord}) {
      //       eventRecord.canceled = true;
      //     }
      //   });
      // }

      // if (eventRecord.status === JobOrderStatusEnum.PROCESSING) {
        // Remove "Edit" and "Delete" items for activities
        // ArrayHelper.remove(
        //   items,
        //   items.find(i => i.name === 'editEvent'),
        //   items.find(i => i.name === 'deleteEvent')
        // );
        // items.splice(items.find(i => i.name === 'deleteEvent'), 1);
        // items.splice(items.find(i => i.name === 'editEvent'), 1);

        // Add a "Done" item
        // items.push({
        //   text: 'Done',
        //   icon: 'b-fa b-fa-fw b-fa-check',
        //   cls: 'b-separator',
        //   onItem({eventRecord}) {
        //     // eventRecord.done = true;
        //   }
        // });
      // }

      // Prevent menu for "locked" event
      return !eventRecord.locked;
    }
  };

  // tooltipEvent = {
  //   align : 'l-r', // Align left to right,
  //   // A custom HTML template
  //   template : (data) => {
  //   return `<dl>
  //         <dt>WorkStation Name: </dt><dd>${data.eventRecord?.name}</dd>
  //         <dt>Job Order Id: </dt><dd>${data.eventRecord?.jobOrderId}</dd>
  //         <dt>Start Time: </dt><dd>${DateHelper.format(data.eventRecord.startDate, 'LT')}</dd>
  //         <dt>Finish Time: </dt><dd>${DateHelper.format(data.eventRecord.endDate, 'LT')}</dd>
  //     </dl>`
  //   }
  // };

  dirtyDates = [];

  @ViewChild('datePickerContainer') datePickerContainer: ElementRef;

  minDate = new Date();
  private searchTerms = new Subject<any>();
  // validateDelete(context) {
  //   console.log(context.status)
  //   return context && context.status !== JobOrderStatusEnum.PROCESSING;
  // }

  constructor(
              private _jbOrderSvc: JobOrderService,
              private _employeeService: EmployeeService,
              private datePipe: DatePipe,
              private loaderService: LoaderService,
              private appStateService: AppStateService,
              private utilities: UtilitiesService,
              private _stopCauseSvc: StopCauseService,
              private _scheduleReportSvc: ScheduleReportService) {

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        // this.pageFilter.plantId = null;
        this.selectedPlant = res;
        this.filterWorkcenter.plantId = res.plantId;
        this.requestScheduleLaborDto.plantId = res.plantId;
        // this.filter();
      } else {
        this.selectedPlant = null;
        this.filterWorkcenter.plantId = null;
      }
    });

  }

  eventRenderer({eventRecord, tplData}) {
    const eventColors = [
      // 'red', this is reserved for event not draggable
      'green', 'blue', 'yellow', 'purple', 'cyan', 'indigo', 'orange', 'lime', 'teal', 'pink', 'violet'];
    // Inline style
    // // Add CSS class
    // tplData.cls.add('my-custom-css');
    let colorIndex = 0;
    if (eventRecord && eventRecord['jobOrderId']) {
      colorIndex = (eventRecord['jobOrderId'] + eventColors.length) % eventColors.length;
    }
    const colr = eventColors[colorIndex];
    let fontClr = '#f5eff0';
    if (colr === 'yellow' || colr === 'lime' ||  colr === 'cyan' ||  colr === 'pink' ||  colr === 'violet') {
      fontClr = '#3d3638';
    }
    tplData.style = 'font-weight: bold; border-radius: 3px; background-color:' + colr + '; color:' + fontClr;

    eventRecord.eventColor = colr;
    return eventRecord.name;
  }

  // loadData() {
  //   if (this.selectedWorkCenters != null && this.selectedWorkCenters.length > 0) {
  //     this.dirtyDates = [];
  //     const selectedWorkCenterIds = [];
  //     const selectedWorkCenterNames = [];
  //     this.selectedWorkCenters.forEach(item => {
  //       selectedWorkCenterIds.push(item.workCenterId);
  //       selectedWorkCenterNames.push(item.workCenterName);
  //     });
  //     this.loadedWorkCenter = selectedWorkCenterNames.join();
  //     this.showLoader = true;
  //     this.loaderService.showLoader();
  //     this.getData(selectedWorkCenterIds.join(), (this.selectedPlant ? this.selectedPlant.plantId : null));
  //   } else {
  //     this.utilities.showErrorToast('choose-valid-work-center');
  //   }

  // }


  ngOnInit() {
    // this.setOptions();
    // if (!this.selectedPlant) {
    //   this._workcenterSvc.filter(this.filterWorkcenter).then(result => {
    //     this.workcenters = [...[{workCenterName: 'All', workCenterId: -1}], ...result['content']];
    //   }).then(() => this.loadData()).catch(error => console.log(error));
    // }


    // this.requestScheduleLaborDto.finishDate = new Date();
    // set scheduler end date as one week later.
    this.requestScheduleLaborDto.finishDate = moment(Date.now()).add(1, 'weeks').toDate();
    // set scheduler end date as one day before current date.
    // moment.utc().subtract('1', 'day').startOf('day').toISOString()
    this.requestScheduleLaborDto.startDate = moment(Date.now()).subtract(1, 'days').toDate();
    this.showLoader = true;

    // this.getStopCauseList();

    this.searchTerms.pipe(
      debounceTime(400),
      switchMap(term => this._employeeService.getLaborScheduleDetail(term))).subscribe((res: any) => {
      this.responseLaborSchedular = res['content'];
      this.pagination.currentPage = res['currentPage'];
      this.pagination.totalElements = res['totalElements'];
      this.pagination.totalPages = res['totalPages'];
      // this.createEvents(res['content']);
      let minDate = 0;
      let maxDate = 0;
      const now = Date.now();
      if (this.responseLaborSchedular && this.responseLaborSchedular.length > 0) {
        this.resources = [];
        this.events = [];
        this.responseLaborSchedular.forEach(item => {
          const employee = this.resources.find(itm => itm.id === item.employeeId);
          if (!employee) {
            const resourse = {
              employeeId: item.employeeId,
              employeeNo: item.employee?.employeeNo,
              employeeName: item.employee?.firstName + ' ' + item.employee?.lastName,
              workStationName: item.workStation?.workStationName,
              id: item.employeeId,
              name: item.employee?.firstName + ' ' + item.employee?.lastName,
              dummy: item.employee?.dummy,
              startDate: moment(item.startDate == null ? Date.now() : item.startDate).format('YYYY-MM-DD HH:mm:ss'),
              finishDate: moment(item.finishDate == null ? Date.now() : item.finishDate).format('YYYY-MM-DD HH:mm:ss'),
              totalAssingmentCount: item.totalAssingmentCount,
              employeeAssignmentId: item.employeeAssignmentId,
              employeeAllocation: Math.round(item.employeeAllocation * 100),
            }

              if (resourse.dummy!=null) {
              if (resourse.dummy === true) {
                resourse.dummy= "YES"
              } 
              if (resourse.dummy === false) {
                resourse.dummy= "NO"
              }
            }


            // if (resourse.dummy!=null) {
            //   if (item.setup === true) {
            //     resourse.dummy= "YES"
            //   } 
            //   if (item.setup === false) {
            //     resourse.dummy= "NO"
            //   }
            // }

            this.resources.push(resourse);

          }
          if (minDate === 0) {
            minDate = item.startDate;
          }
          if (minDate > item.startDate) {
            minDate = item.startDate;
          }
          if (maxDate === 0) {
            maxDate = item.finishDate;
          }
          if (maxDate < item.finishDate) {
            maxDate = item.finishDate;
          }
          const aEvent = {
            resourceId: item.employeeId,
            jobOrderId: item.jobOrderId,
            employee: item.employee,
            name: this.getJobName(item),
            startDate: moment(item.startDate).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(item.finishDate).format('YYYY-MM-DD HH:mm:ss'),
            status: item.jobOrder?.jobOrderStatus,
            prodOrderId: item.jobOrder?.prodOrder?.prodOrderId,
            orderNo: item.orderNo,
            totalDuration: item.totalDuration,
            divided: item.divided,
            jobOrderOperationId : item.jobOrderOperation?.jobOrderOperationId,
            referenceId : item.jobOrderOperation?.referenceId,
            workStationName: item.workStation?.workStationName,
            workStationNo: item.workStation?.workStationNo,
            setup: item.setup,
            draggable: (item.jobOrder?.jobOrderStatus !== JobOrderStatusEnum.PROCESSING) ? true : false// event in this status will not allowed to edit or delete
          };

          if (aEvent.setup!=null) {
            if (item.setup === true) {
              aEvent.setup= "YES"
            } 
            if (item.setup === false) {
              aEvent.setup= "NO"
            }
          }

         

          if (!aEvent.draggable) {
            aEvent['eventColor'] = 'red';
          }
          if (item.jobOrderId <= 0 ) {
            aEvent['eventColor'] = 'red';
          }
          this.addDateToDirty(item.startDate);
          this.events.push(aEvent);
        });
      } else {
        this.resources = [];
        this.events = [];
      }
      minDate = minDate === 0 ? now : minDate;
      maxDate = maxDate === 0 ? now : maxDate;
      // const timerangearray = [];
      this.featuretimeRanges = {
        showCurrentTimeLine : true,
      showHeaderElements  : false,
        'startDate': minDate,
        'endDate': maxDate
      };
      // const datesArray = this.getDates(minDate, maxDate);
      // datesArray.forEach((date, i) => {
      //   timerangearray.push({
      //     endDate: date + ' 08:00',
      //     id: i + 1,
      //     // cls: 'b-fa b-fa-bolt',
      //     // name: 'There Is No Shift',
      //     startDate: date + ' 00:00',
      //     style: 'font-size: large;font-weight: 600;color: #3183fe;background: repeating-linear-gradient(-45deg, rgb(152 193 255), rgb(152 193 255) 8px, #1ac0e087 8px, rgb(0 0 0 / 0%) 16px);'
      //     // style: 'color: black;font-weight: 500;background:repeating-linear-gradient(45deg, rgba(155,155,155,0.5), rgba(155,155,155,0.5) 8px, transparent 8px, transparent 16px);'
      //   });
      // });
      // if (minDate > maxDate) {
      //   this.startDate = moment(maxDate).format('YYYY-MM-DD HH:mm');
      //   this.endDate = moment(minDate).format('YYYY-MM-DD HH:mm');
      // } else {
      //   this.startDate = moment(minDate).format('YYYY-MM-DD HH:mm');
      //   this.endDate = moment(maxDate).format('YYYY-MM-DD HH:mm');

      // }
      // this.timeRanges = timerangearray;
      this.startDate = moment(minDate).format('YYYY-MM-DD HH:mm');
      this.endDate = moment(maxDate).format('YYYY-MM-DD HH:mm');
      this.calendarDate = new Date(minDate);
      this.showLoader = false;
      this.loaderService.hideLoader();
    }, err => { console.log(err); this.loaderService.hideLoader(); });

    // this.filter();
  }

  filter() {
    this.loaderService.showLoader();
    const temp = Object.assign({}, this.requestScheduleLaborDto);
    if (temp.startDate) {
      temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }
    this.searchTerms.next(temp);
  }

  getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = moment(startDate);
    stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push( moment(currentDate).format('YYYY-MM-DD'))
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

  ngAfterViewInit() {
    // exposing scheduling engine to be easily accessible from console
    // window.scheduler = this.scheduler.getSchedulerEngine();

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  exportToPDF() {
    this.scheduler.getSchedulerEngine().features.pdfExport.showExportDialog();
  }
  exportToExcel() {
    this.scheduler.getSchedulerEngine().features.excelExporter.export();
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
    this.requestScheduleLaborDto.pageNumber = this.pagination.pageNumber;
    this.requestScheduleLaborDto.pageSize = this.pagination.pageSize;
    this.requestScheduleLaborDto.query = this.pagination.tag;
    this.filter();
  }

  // eventRenderer ({eventRecord: task, resourceRecord, renderData}) {
  //   return (task.name + '\n' +
  //           'JobOrderId: ' + task.jobOrderId +
  //           (task.prodOrderId ? (' , POrderId: ' + task.prodOrderId) : ''));
  // }


  onDateChange(date) {
    this.scheduler.getSchedulerEngine().setTimeSpan(DateHelper.add(date, 8, 'hour'), DateHelper.add(date, 18, 'hour'));
  }
  private addDateToDirty(date) {

    if (date) {
      const dt = this.utilities.changeLocaleStartDate(date);

      const exist = this.dirtyDates.find(item => item.getTime() === dt.getTime());
      if (!exist) {
        this.dirtyDates.push(dt);
      }
    }
  }


  containDate(date): boolean {
    for (let i = 0; i < this.dirtyDates.length; i++) {

      const b = this.datePipe.transform(this.dirtyDates[i],
          'dd-MM-yyyy') === this.datePipe.transform(moment([date.year, date.month, date.day]), 'dd-MM-yyyy');
      if (b) {
        return true;
      }
    }
    return false;
  }


// fetch data for the scheduler
  // getData(workCenterId, plantId) {
  //   const me = this;
  //   const now = Date.now();
  //   if (plantId) {
  //     this._workStationSvc.getWorkStationsScheduleForWorkCenter(workCenterId, plantId).then(res => {
  //       me.responseWorkCenterByWorkStationAndJobOrderDto = res;
  //       me.createEvents(res);
  //       me.loaderService.hideLoader();
  //       me.showLoader = false;
  //     }).catch(err => {
  //       me.loaderService.hideLoader();
  //       me.showLoader = false;
  //       this.utilities.showErrorToast(err);
  //     });
  //   } else {
  //     this._workStationSvc.getWorkStationsScheduleForWorkCenterIdOnly(workCenterId).then(res => {
  //       me.responseWorkCenterByWorkStationAndJobOrderDto = res;
  //       me.createEvents(res);
  //       me.loaderService.hideLoader();
  //       me.showLoader = false;
  //     }).catch(err => {
  //       me.loaderService.hideLoader();
  //       me.showLoader = false;
  //       this.utilities.showErrorToast(err);
  //     });
  //   }
  // }

  // private createEvents(res) {
  //   let minDate = 0;
  //   let maxDate = 0;
  //   const me = this;
  //   const now = Date.now();

  //   const resources = [];
  //   const events = [];
  //   me.workstations = [];
  //   res['workStationForWorkcenterDtos'].forEach(item => {

  //     me.workstations.push({workStationId: item.workStationId, workStationName: item.name});
  //     resources.push({
  //       id: item.workStationId,
  //       workStationNo: item.workStationNo,
  //       workCenterName: item.workCenterName,
  //       name: item.name,
  //       startDate: moment(item.startDate == null ? now : item.startDate).format('YYYY-MM-DD HH:mm'),
  //       endDate: moment(item.endDate == null ? now : item.endDate).format('YYYY-MM-DD HH:mm'),
  //       jobCount: item.jobCount,
  //       allocation: Math.round(item.allocation * 100)
  //     });

  //   });
  //   if (res['jobOrderForWorkCenterDtos'] && res['jobOrderForWorkCenterDtos'].length > 0) {
  //     res['jobOrderForWorkCenterDtos'].forEach(item => {
  //       if (minDate === 0) {
  //         minDate = item.startDate;
  //       }

  //       if (minDate > item.startDate) {
  //         minDate = item.startDate;
  //       }
  //       if (maxDate < item.endDate) {
  //         maxDate = item.endDate;
  //       }
  //       const aEvent = {
  //         resourceId: item.resourceId,
  //         jobOrderId: item.jobOrderId,
  //         name: item.name,
  //         startDate: moment(item.startDate).format('YYYY-MM-DD HH:mm'),
  //         endDate: moment(item.endDate).format('YYYY-MM-DD HH:mm'),
  //         status: item.status,
  //         prodOrderId: item.prodOrderId,
  //         orderNo: item.orderNo,
  //         totalDuration: item.totalDuration,
  //         divided: item.divided,
  //         draggable: item.status !== JobOrderStatusEnum.PROCESSING// event in this status will not allowed to edit or delete
  //       };
  //       if (!aEvent.draggable) {
  //         aEvent['eventColor'] = 'red';
  //       }
  //       if (item.jobOrderId <= 0 ) {
  //         aEvent['eventColor'] = 'red';
  //       }
  //       events.push(aEvent)
  //       me.addDateToDirty(item.startDate);
  //     });
  //   }

  //   me.resources = resources;
  //   me.events = events;

  //   minDate = minDate === 0 ? now : minDate;
  //   maxDate = maxDate === 0 ? now : maxDate;
  //   me.timeRanges = {
  //     'startDate': minDate,
  //     'endDate': maxDate
  //   };
  //   me.startDate = moment(minDate).format('YYYY-MM-DD HH:mm');
  //   me.endDate = moment(maxDate).format('YYYY-MM-DD HH:mm');
  //   me.calendarDate = new Date(minDate);
  //   let allocations = 0;
  //   me.resources.forEach(itm => {
  //     allocations = allocations + itm.allocation;
  //   });
  //   this.totalAllocationAverage = allocations / me.workstations.length;
  // }


  getJobName(item) {
    return (item['jobOrder'] && item['jobOrder'].prodOrder ? 'p=' + item['jobOrder']?.prodOrder?.prodOrderId + ' - ' : '')
      + (item['jobOrderId'] ? '#j=' + item['jobOrderId'] + ' - ' : '' )
      + (item['jobOrder'] ? '#js=' + item['jobOrder']?.jobOrderStatus + ' - ' : '')
      + (item['workStation'] ? '#ws=' + item['workStation']?.workStationName : '');

  }
  onSchedulerEventSelected(event) {
    // selected event
    if (event && event.jobOrderId) {
      const employees = this.events.filter(evt => evt.jobOrderId === event.jobOrderId).map(evmp => evmp.employee);
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, event.jobOrderId, {employees});
    }
  }

  setSelectedEmployee(event) {
    if (event) {
      this.requestScheduleLaborDto.employeeId = event.employeeId;
    } else {
      this.requestScheduleLaborDto.employeeId = null;
    }
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.requestScheduleLaborDto.workStationId = event.workStationId;
    } else {
      this.requestScheduleLaborDto.workStationId = null;
    }
  }
  setSelectedJobOrder(event) {
    if (event) {
      this.requestScheduleLaborDto.jobOrderId = event.jobOrderId;
    } else {
      this.requestScheduleLaborDto.jobOrderId = null;
    }
  }


  // saveEvent(event) {
  //
  //   const scheduler = this.scheduler.getSchedulerEngine();
  //   const aEvent = scheduler.eventStore.getById(event.id);
  //
  //   aEvent.data.startDate = (event.startDate);
  //   aEvent.data.endDate = (event.endDate);
  //   if (aEvent.data.resourceId !== event.resourceId) {
  //     const oldresource = scheduler.resourceStore.getById(aEvent.data.resourceId);
  //     const newresource = scheduler.resourceStore.getById(event.resourceId);
  //     scheduler.eventStore.reassignEventFromResourceToResource(aEvent, oldresource, newresource);
  //   }
  //   // this.moveToCorrectPlaceDroppedEvent(aEvent);
  //
  //
  //   this.reArrangeResourceStartAndEndDate(aEvent);
  //   scheduler.eventStore.commit();
  //   this.myModal.hide();
  //
  // }

  // private moveToCorrectPlaceDroppedEvent(aEvent) {
  //   const scheduler = this.scheduler.getSchedulerEngine();
  //   const resource = scheduler.resourceStore.getById(aEvent.data.resourceId);
  //   const events: Array<any> = scheduler.eventStore.getEventsForResource(resource);
  //
  //   if (events.length === 1) {
  //     return;
  //   }
  //
  //   this.orderEventArray(events);
  //   let lastProcessedItemIndex = -1;
  //   let myIndex = -1;
  //   for (let i = 0; i < events.length; i++) {
  //     if (events[i].status === 'PROCESSING') {
  //       lastProcessedItemIndex = i;
  //     }
  //
  //     if (events[i].id === aEvent.id) {
  //       myIndex = i;
  //     }
  //   }
  //
  //   if (lastProcessedItemIndex !== -1) {//  there is at least one processing item exist
  //
  //     if (myIndex > lastProcessedItemIndex) {// i am after processing item
  //       const previousEvent = events[myIndex - 1];
  //
  //
  //       const previousEnd = new Date(previousEvent.endDate).getTime();
  //       const myStart = new Date(aEvent.startDate).getTime();
  //       const myEnd = new Date(aEvent.endDate).getTime();
  //       if (previousEnd > myStart) {
  //         const diff = Math.abs(myEnd - myStart);
  //         // aEvent.startDate = new Date(previousEnd);
  //         // aEvent.endDate = new Date((previousEnd + diff));
  //         this.shiftDateByCaringWeekend(aEvent, new Date(previousEnd), new Date((previousEnd + diff)));
  //       }
  //       this.solveConflict(myIndex, events);
  //     } else {//  i am before processing item start
  //       const lastProcessedEvent = events[lastProcessedItemIndex];
  //       const myStart = new Date(aEvent.startDate).getTime();
  //       let myEnd = new Date(aEvent.endDate).getTime();
  //       const diff = Math.abs(myEnd - myStart);
  //       const s = new Date(lastProcessedEvent.endDate);
  //       const e = DateHelper.add(lastProcessedEvent.endDate, diff, 'ms');
  //
  //       this.shiftDateByCaringWeekend(aEvent, s, e);
  //
  //       if (events.length - 1 > lastProcessedItemIndex) {
  //
  //         const afterLastProcessingEvent = events[lastProcessedItemIndex + 1];
  //         myEnd = new Date(aEvent.endDate).getTime();
  //
  //         const afterLastProcessingEventStart = new Date(afterLastProcessingEvent.startDate).getTime();
  //
  //         if (myEnd > afterLastProcessingEventStart) {
  //           const afterLastProcessingEventEnd = new Date(afterLastProcessingEvent.endDate).getTime();
  //           const lastDiff = Math.abs(afterLastProcessingEventEnd - afterLastProcessingEventStart);
  //           const st = new Date(aEvent.endDate);
  //           const en = DateHelper.add(aEvent.endDate, lastDiff, 'ms');
  //           this.shiftDateByCaringWeekend(afterLastProcessingEvent, st, en);
  //           this.solveConflict(lastProcessedItemIndex + 1, events);
  //         }
  //       }
  //
  //     }
  //
  //   } else {
  //     this.solveConflict(0, events);
  //   }
  //
  // }


  // private solveConflict(startIndex, events) {
  //   for (let i = startIndex; i < events.length; i++) {
  //     if (i !== (events.length - 1)) {
  //       const firstEvent = events[i];
  //       const secondEvent = events[i + 1];
  //       if (firstEvent.endDate > secondEvent.startDate) {
  //         const start = new Date(firstEvent.endDate).getTime();
  //         const end = new Date(secondEvent.startDate).getTime();

  //         const diff = Math.abs(start - end);


  //         const st = new Date(firstEvent.endDate);
  //         const en = DateHelper.add(secondEvent.endDate, diff, 'ms');

  //         this.shiftDateByCaringWeekend(secondEvent, st, en);
  //       }
  //     }
  //   }
  // }

  showAllcationByShiftGraph(aEvent, type=null){
    // console.log('@data', aEvent)
    let filter = {
      "startTime": null,
      "endTime": null,
      "orderByDirection": 'desc',
      "orderByProperty": 'employeeId',
      "pageNumber": 1,
      "pageSize": 9999999,
      "plantId": this.selectedPlant.plantId,
      "query": null,
      "employeeId": null,//aEvent.workCenterId,
    }
    if (this.requestScheduleLaborDto.startDate) {
      filter.startTime = ConvertUtil.date2StartOfDay(this.requestScheduleLaborDto.startDate);
      filter.startTime = ConvertUtil.localDateShiftAsUTC(filter.startTime);
    } if (this.requestScheduleLaborDto.finishDate) {
      filter.endTime = ConvertUtil.date2EndOfDay(this.requestScheduleLaborDto.finishDate);
      filter.endTime = ConvertUtil.localDateShiftAsUTC(filter.endTime);
    }

    if(type == 'workstation'){
      this.allocationParams.dialog.title = 'allocation-by-shift';
    }else{
      this.allocationParams.dialog.title = 'allocation-by-shift-employee';
      filter.employeeId = aEvent.data.employeeId;
    }

    this.loaderService.showLoader();
    this.options = null;
    this.barData = null;
    this.allocationModal.show();

    this._scheduleReportSvc.getEmployeeActualCapacityShiftReport(filter).then(res=>{
      this.loaderService.hideLoader();
      this.max = 0;
      let labels = [];
      let datasets = [];
      this.options = null;
      if(res['content'] && res['content'].length > 0){

        let data = res['content'].sort((a,b)=> a.shiftStartDate - b.shiftStartDate);
        let dates:any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];

        let finalData = [];
        for (var i = 0; i < dates.length; i++) {
          labels.push(moment(dates[i].shiftStartDate).format('DD-MM-YYYY'));
          let dateShifts = data.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
          finalData.push(dateShifts);
        }
        for (var i = 0; i < finalData.length; i++) {
          let dataset = [];
          let datasetItems = [];
          finalData.forEach((item, index) => {
            datasetItems.push(item[i])
            dataset.push(item[i] ? item[i].plannedCapacity * 100 : 0);
            if(this.max < (item[i] ? item[i].plannedCapacity * 100: 0)) {
              this.max = (item[i] ? item[i].plannedCapacity * 100: 0)
            }
          })
          datasets.push(this.getDataSetItem('#4188f5', datasetItems, dataset));
        }
      } else {
        for (var i = 0; i < 7; i++) {
          labels.push(moment(this.requestScheduleLaborDto.startDate).add(i, 'days').format('DD-MM-YYYY'));
        }
      }
      
      this.barData = {
        labels: labels,
        datasets: datasets
      };

      this.options = {
        title: {
          display: false,
          text: 'MODEL AREA'
        },
        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        },
        fill: false,
        responsive: true,
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 30,
              // max: this.max == 0 ? 20 : Math.ceil((this.max + 1) / 10) * 10
            }
          }],
          yAxes: [
            {
              position: 'left',
              id: 'y-axis-1',
              ticks: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 100,
                max: this.max == 0 ? 20 : (Math.ceil((this.max + 1) / 10) * 10)
               },
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Percentage',
              }
            }
          ]
        },
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            fontColor: '#000000',
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              // console.log('@tooltipItem', tooltipItem)
              // console.log('@data', data)
              let element = data.datasets[tooltipItem.datasetIndex].label[tooltipItem.index];
              // console.log('@element', element)
              let label = "Allocation: " + ConvertUtil.getPercentage(element.plannedCapacity);
              let label2 = "Shift: " + element.shiftName;
              let label3 = "Start Time: " + moment(element.shiftStartDate).format('HH:mm');
              let label4 = "End Time: " + moment(element.shiftEndDate).format('HH:mm');
              return [label, label2, label3, label4];
            }
          }
        }
        // moment(element.shiftStartDate).format('DD-MM-YYYY')
      };
      
    }).catch(error => this.loaderService.hideLoader());

  }


  private getDataSetItem(hexColor, label, data, axisId = 'y-axis-1') {

    return {
      yAxisID: axisId,
      label: label,
      fill: true, // for bar just comment here
      backgroundColor: hexColor,
      borderColor: hexColor,
      borderWidth: 1,
      data: data,
      type: (axisId == 'y-axis-2') ? 'line' : '',
    }
  }

  private shiftDateByCaringWeekend(aEvent, startDate, endDate) {

    let myStartDate = startDate;
    let myEndDate = endDate;
    if (this.shiftWeekend) {

      const start = new Date(startDate);
      const end = new Date(endDate);

      const diff = Math.abs(start.getTime() - end.getTime());

      if (start.getDay() % 6 === 0 || end.getDay() % 6 === 0) {
        let dayAdding = (8 - start.getDay());
        dayAdding = dayAdding === 8 ? 1 : dayAdding;
        myStartDate = (moment(startDate, 'YYYY-MM-DD').add('days', dayAdding)).toDate();
        myEndDate = DateHelper.add(myStartDate, diff, 'ms');
      }
    }
    aEvent.startDate = myStartDate;
    aEvent.endDate = myEndDate;


  }

  onSchedulerEventDbClicked(aEvent) {

    this.selectedRecord = aEvent;
    // this.myModal.show();
  }

  deleteEvent(event) {
    // this.showLoader = true;
    this.loaderService.showLoader();
    if (!event) {
      this.utilities.showErrorToast('NO-JOB-ORDER-SELECTED');
      return;
    }

    if (event.status === 'PROCESSING') {
      this.utilities.showErrorToast('THIS-JOB-ORDER-CANT-DELETED');
      return;
    }

    this._jbOrderSvc.changeJobOrderStatusToCancel(event.jobOrderId).then(res => {
      this.utilities.showSuccessToast('delete-success');
      this.scheduler.removeEvent(event.id);
      this.myModal.hide();
      this.loaderService.hideLoader();
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  concatEventOfRecord(event) {
    const scheduler = this.scheduler.getSchedulerEngine();
    const events: Array<any> = scheduler.eventStore.getEventsForResource(event);

    this.removeEmptySpaces(events);
  }

  onSchedulerEventDropped(aEvent) {


    const scheduler = this.scheduler.getSchedulerEngine();

    // this.moveToCorrectPlaceDroppedEvent(aEvent);

    const me = this;
    scheduler.eventStore.forEachScheduledEvent
    (
      function (event, startD, endD) {
        me.reArrangeResourceStartAndEndDate(event);

      }, this
    );
  }

  onSchedulerEventUpdated(aEvent) {
    const scheduler = this.scheduler.getSchedulerEngine();

    // this.moveToCorrectPlaceDroppedEvent(aEvent);

    const me = this;
    scheduler.eventStore.forEachScheduledEvent
    (
      function (event, startD, endD) {
        me.reArrangeResourceStartAndEndDate(event);

      }, this
    );
  }


  private  reArrangeResourceStartAndEndDate(aEvent) {
    const scheduler = this.scheduler.getSchedulerEngine();
    const resource = scheduler.resourceStore.getById(aEvent.data.resourceId);
    // let myEvent = scheduler.eventStore.getById(aEvent.data.id);
    const events: Array<any> = scheduler.eventStore.getEventsForResource(resource);

    this.orderEventArray(events);
    if (events.length > 0) {
      resource.startDate = moment(events[0].startDate).format('YYYY-MM-DD HH:mm:ss');
      resource.endDate = moment(events[events.length - 1].endDate).format('YYYY-MM-DD HH:mm:ss');

    } else {
      resource.startDate = null;
      resource.endDate = null;
    }
    resource.jobCount = events.length;
  }


  removeEmptySpaces(events) {
    this.orderEventArray(events);
    for (let i = 0; i < events.length; i++) {
      if (i !== (events.length - 1)) {
        const firstEvent = events[i];
        const secondEvent = events[i + 1];
        if (secondEvent.status === 'PROCESSING') {
          continue;
        }

        const start = new Date(secondEvent.startDate).getTime();
        const end = new Date(secondEvent.endDate).getTime();

        const diff = Math.abs(start - end);
        const st = new Date(firstEvent.endDate);
        const en = DateHelper.add(st, diff, 'ms');
        this.shiftDateByCaringWeekend(secondEvent, st, en);
      }
    }
  }

  private  orderEventArray(array) {
    array.sort(function (a, b) {
      return DateHelper.compare(a.startDate, b.startDate, null);
    });
  }

// add event button click handled here
//   onAddEventClick() {
//     this.scheduler.addEvent();
//   }
//
// // remove event button click handled here
//   onRemoveEventClick() {
//     this.scheduler.removeEvent();
//   }

  saveChanges() {
    const date = new Date();

    this.loaderService.showLoader();
    const scheduler = this.scheduler.getSchedulerEngine();

    const events = [];
    scheduler.eventStore.forEachScheduledEvent
    (
      function (event, startD, endD) {

        if (event.jobOrderId > 0) {
          events.push({
            workStationId: event.resourceId,
            jobOrderId: event.jobOrderId,
            startDate: startD,
            endDate: endD,
            status: event.status,
            totalDuration: event.totalDuration,
            divided: event.divided
          });

          console.log(event.data);
        }

      }, this
    );
    this._jbOrderSvc.updateJobOrderScheduler(events).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');

    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }


  // addEvent(event) {
  //   const scheduler = this.scheduler.getSchedulerEngine();
  //   scheduler.eventStore.add({
  //     resourceId: event.resourceId,
  //     startDate: event.startDate,
  //     endDate: event.endDate,
  //     name: event.name,
  //     status: event.status
  //   })
  // }

  // scheduleJobOrders() {
  //   if (!(this.selectedPlant)) {
  //     this.utilities.showErrorToast('Plant is not selected!!');
  //     return;
  //   }

  //   if (!(this.stopCauseList)) {
  //     this.getStopCauseList();
  //   }

  //   this.requestScheduleLaborDto.plantId = this.selectedPlant.plantId;
  //   this.requestScheduleLaborDto.finishDate = ConvertUtil.date2EndOfDay(this.requestScheduleLaborDto.finishDate);

  //   const me = this;
  //   this.loaderService.showLoader();
  //   this.showLoader = true;
  //   this._jbOrderSvc.scheduleJobOrders(this.requestScheduleLaborDto).then(res => {
  //     me.responseWorkCenterByWorkStationAndJobOrderDto = res;
  //     me.filterAndCreateEvents();
  //     me.loaderService.hideLoader();
  //     me.showLoader = false;
  //     me.utilities.showSuccessToast('success');
  //   }).catch(err => {
  //     me.loaderService.hideLoader();
  //     me.showLoader = false;
  //     me.utilities.showErrorToast(err);
  //   });
  // }

  // filterAndCreateEvents() {
  //   if (this.responseWorkCenterByWorkStationAndJobOrderDto) {
  //     const res = Object.assign({}, this.responseWorkCenterByWorkStationAndJobOrderDto);

  //     if (!this.showEmptyJobs) {
  //       if (res.jobOrderForWorkCenterDtos) {
  //         res.jobOrderForWorkCenterDtos = res.jobOrderForWorkCenterDtos.filter(item => item.jobOrderId > 0);
  //       }
  //     }

  //     res.workStationForWorkcenterDtos.forEach(item => {
  //       let taskList = [];
  //       if (res.jobOrderForWorkCenterDtos) {
  //         taskList = res.jobOrderForWorkCenterDtos.filter(o => o.resourceId === item.workStationId);
  //       }
  //       item.jobCount = taskList.length;
  //       if (item.jobCount > 0) {
  //         item.startDate = taskList[0].startDate;
  //         item.endDate = taskList[item.jobCount - 1].endDate;
  //       }
  //     });

  //     this.createEvents(res);
  //   }

    // if (this.showEmptyJobs) {
    //   this.events = this.eventsAll;
    //   this.resources = this.resourcesAll;
    // } else {
    //   this.events = this.eventsAll.filter(item => item.jobOrderId > 0);
    //   this.resources = this.resourcesAll.filter(item => this.events.some(o => o.resourceId === item.id));
    // }
  // }

  openScheduleSettingsModal() {
    // this.params.dialog.visible = true;
    this.settingsModal.show();
  }

  closeScheduleSettingsModal() {
    // this.params.dialog.visible = false;
    this.settingsModal.hide();
  }

  checkInput(event) {
    if (!Number(event.value)) {
      // this.requestScheduleJobOrdersDto.emptyTaskDurationList.splice(this.requestScheduleJobOrdersDto.emptyTaskDurationList.indexOf(event.value), 1)
      this.utilities.showErrorToast('Not Number');

      // const exist = this.requestScheduleJobOrdersDto.emptyTaskDurationList.find(item => item === event.value);
      // if (!exist) {
      //   this.requestScheduleJobOrdersDto.emptyTaskDurationList.push(event.value);
      // }
    }
  }

  getStopCauseList() {
    this._stopCauseSvc.filter({pageSize: 100000, pageNumber: 1}).then(result => {
        this.stopCauseList = result['content'];
        this.stopCauseList = this.stopCauseList.filter(item => item.plant != null
          && item.plant.plantId === this.selectedPlant.plantId && item.planned === true);
        const offset = moment().utcOffset();
        this.stopCauseList.forEach(item => {
          if (item.startTime ) {
            item.startTime = moment(item.startTime.toString(), 'HH:mm:ss').add(offset, 'minutes').toDate();
          }
          // console.log(this.offset);
        });
      }).catch(error => {
        console.log(error);
        this.utilities.showErrorToast(error);
    });
  }
}
