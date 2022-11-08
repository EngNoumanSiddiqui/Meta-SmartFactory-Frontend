import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DateHelper, EventHelper, DomClassList } from 'scheduler';
import zipcelx from 'zipcelx';
import { Subscription } from 'rxjs';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { SchedulerComponent } from 'app/components/scheduler/scheduler.component';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { JobOrderScheduleTypeEnum, JobOrderStatusEnum } from 'app/dto/job-order/job-order.model';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { StopCauseService } from 'app/services/dto-services/stop-cause/stop-cause.service';
import * as moment from 'moment';
import { ConvertUtil } from 'app/util/convert-util';
import { EnumService } from '../../../../../services/dto-services/enum/enum.service';
import { MaintenanceOrderService } from 'app/services/dto-services/maintenance-equipment/maintenance-order.service';
import { ReservedColor } from 'app/util/reserved-color';
import { JobOrderServiceStatic } from 'app/services/dto-services/job-order/job-order-static.service';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';
import { ConfirmationService, Dialog, MenuItem } from 'primeng';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { SimulationService } from "app/services/dto-services/simulation/simulation.service";
import { stringify } from 'querystring';
import { ProductionOrderService } from 'app/services/dto-services/production-order/production-order.service';

declare var window: any;

@Component({
  selector: 'joborder-auto-scheduler',
  templateUrl: './joborder-auto-scheduler.component.html',
  styleUrls: ['./joborder-auto-scheduler.component.scss'],
  providers: [DatePipe]
})
export class JobOrderAutoSchedulerComponent implements OnInit, OnDestroy {
  cols = [
    { field: 'showPlannedStops', header: 'show-planned-stops' },
    { field: 'visibleDueJobs', header: 'visible-due-jobs' },
  ];
  sub: Subscription[] = [];

  maintenanceOperations = [];

  options: any;
  optionsWorkstation: any;
  searchBy = 'searchbyscheduled';
  barData: any;
  barWorkstationData: any;
  allocationSelection = 'Allocation';
  filterName = null;
  selectedReadyJobOrders = [];
  clonedEvent: any;
  isFullScreen: boolean = false;
  isPlannedStopVisible: boolean = false;
  showDueJobs: boolean = false;
  loadingshowAllcationByShift = false;
  workcenterTypes: any[];
  stopCauseListFinal: any[] = [];
  shiftData: any = [];
  widthSize: number = 1;
  viewOption = null;

  findTotalHeight() {
    var topDiv = document.getElementById("topDiv").offsetHeight;
    var midDiv = document.getElementById("midDiv").offsetHeight;
    var allocationDiv = 35;
    var paddingContainer = 20;
    var header = 55;
    var footer = 50;
    var menuHeading = 50;

    var getTotalHeightWithoutScheduler = topDiv + midDiv + allocationDiv + paddingContainer + header + footer + menuHeading;

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
        delegate: '#machineId',
        click(event) {
          const record = scheduler.getSchedulerEngine().getRecordFromElement(event.target);
          if (record && record.data && record.data.id) {
            me.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, record.data.id);
          }
        }
      });
      EventHelper.addListener({
        element: scheduler.getSchedulerEngine().element,
        delegate: '#machinename',
        click(event) {
          const schedulr = scheduler.getSchedulerEngine();
          const record = schedulr.getRecordFromElement(event.target);
          if (record && record.data && record.data.id) {
            schedulr.eventStore.removeFilter('my-filter');
            schedulr.setTimeSpan(new Date(me.startDate), new Date(me.endDate));
            schedulr.scrollToDate(new Date(record.data.startDate),
              {
                highlight: true,
                animate: {
                  easing: 'easeFromTo',
                  duration: 1000
                },
                block: 'center'
              }
            );
            // schedulr.setTimeSpan(new Date(record.startDate),
            // new Date(record.endDate));
            //   schedulr.scrollEventIntoView(event, {
            //     highlight: true,
            //     animate : {
            //         easing   : 'easeFromTo',
            //         duration : 1000
            //     }
            // });
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
      //   WidgetHelper.append([
      //     {
      //         ref   : 'exportButton',
      //         type  : 'button',
      //         color : 'b-orange b-raised',
      //         icon  : 'b-fa b-fa-file-export',
      //         text  : 'Export',
      //         onClick() {
      //             scheduler.getSchedulerEngine().features.pdfExport.showExportDialog();
      //         }
      //     }
      // ], {
      //     insertFirst : document.getElementById('tools') || document.body,
      //     cls         : 'b-bright'
      // });
    }
  };

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  @ViewChild('settingsModal') public settingsModal: ModalDirective;
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('allocationModal') public allocationModal: ModalDirective;

  modal = { active: false };
  dailogOptions: any;
  dialogChartData: any;
  selectedPlant: any;
  workstations;
  selectedRecord;
  responseWorkCenterByWorkStationAndJobOrderDto: any;
  requestScheduleJobOrdersDto = {
    productionSchedulingParameterId: null,
    plantId: null,
    iterationCount: 50,
    populationSize: 5,
    tournamentSize: 5,
    presetView: 'dayAndWeek',
    viewPeriod: 1,
    mutationRate: 0.080,
    startDate: null,
    finishDate: null,
    finishDateInWeeks: 1, // weeks
    prodOrderDateConsistencyCheck: true,
    prodOrderDateConsistencyWeight: 5,
    jobOrderOrderNoCheck: true,
    jobOrderOrderNoWeight: 10,
    prodOrderPriorityCheck: true,
    prodOrderPriorityWeight: 5,
    workstationCapacityCheck: true,
    workstationCapacityWeight: 5,
    workstationSingleOperationDuration: 5, // minutes
    divideJobs: false,
    divideJobsMaxDuration: 0, // minutes
    timeBetweenJobs: 10, // minutes
    tolerance: 0, // percentage 10 means %10
    scheduled: false,
    schedulingPeriod: 1,
    schedulingPeriodUnit: 'DAY',
    maxSetupDuration: 0, // ms
    findEmployeeCount: false,
    findEmployeeIterationCount: 0,
    minEmployeeCount: 0,
    maxEmployeeCount: 0,
    workstationCapacityPercentage: 100, // percentage 80 means %80
    minWorkstationCapacityPercentage: 0, // percentage 20 means %20
    scheduleType: JobOrderScheduleTypeEnum.ACTUAL_CASE,
    maxChangeOverCount: 0, // max equipment change in a shift
    startFromNow: false, // use prod order start date as current time
    autoProdOrderDelayTime: 0, // delay time of auto prod orders from now in weeks
    useErpProdOrderDate: false, // use prod order finish date from erp,
    workCenterTypeId: null,
    scheduleSimulationId: null,
    lastScheduleDate: new Date()
  };

  // scheduleModes = [
  //   {label: 'ACTUAL CASE', value: 'actual_case'},
  //   {label: 'BEST CASE', value: 'best_case'}
  // ];
  scheduleTypeList;

  reqChangeJobOrderOperationStatusDto = {
    finishDate: null,
    jobOrderOperationId: null,
    startDate: null
  };

  reqJobOrderPlanManuallyDto = {
    individualCapacity: null,
    jobOrderId: null,
    jobOrderOperationId: null,
    operationWorkstationList: [
      {
        workStationId: null,
        jobOrderOperationId: null
      }
    ],
    prodOrderId: null,
    saleOrderId: null,
    startDate: null,
    finishDate: null,
    workStationId: null
  }

  filterSchedule = {
    finishDate: moment().add(7, 'd').toDate(),
    plantId: null,
    startDate: new Date(),
    erpStartDate: null,
    erpFinishDate: null,
    scheduleProdOrderType: 'STANDARD',
    workCenterId: null,
    workStationId: null,
    bestCase: false,
    workCenterTypeId: null,
    scheduleSimulationId: null
  }
  showEmptyJobs = false;
  params = {
    dialog: { title: '', inputValue: '', error: null, numberOfJobs: null, jobList: null, visible: false },
  };

  allocationParams = {
    dialog: { title: '', data: '', visible: false },
  };
  // weightValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  //   '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  weightValues = [];
  stopCauseList;
  timeIntervalEnumList;
  isStartDateSelected = false;

  shiftWeekend = false;
  workcenters;
  simulations;
  showLoader = false;
  loadedWorkCenter;
  selectedWorkCenters = null;
  selectedWorkCenter = null;
  selectedWorkStation = null;
  selectedWorkCenterTypes = null;
  selectedSimulation = null;
  filterWorkcenter = { pageNumber: 1, pageSize: 500, workCenterTypeId: null, workCenterName: null, plantId: null };
  filterSimulation = { pageNumber: 1, pageSize: 500, scheduleSimulationId: null, scheduleSimulationNo: null, scheduleSimulationName: null, plantId: null };
  // bind properties from the application to the scheduler component
  rowHeight = 50;
  selectedEvent = '';
  resources = [];
  events = [];
  dependencies = [];
  timeRanges = [];
  featuretimeRanges: any;
  barMargin = 5;
  startDate;
  endDate;
  totalAllocationAverage = 0;
  totalIndividualCapacity = 0;
  columns = [
    { text: 'WorkCenterType', field: 'workCenterTypeName', hidden: true, width: 100 },
    { text: 'WorkCenter', field: 'workCenterName', hidden: true, width: 100 },
    {
      text: this._translateSvc.instant('workstation-id'), field: 'id', type: 'number',
      filterable: false, editor: false, hidden: false,
      showEventCount: false, width: 100,
      // renderer({record: resource, cellElement}) {

      //   return `<a href="javascript:void;" id="machineId">${resource.id}</a>`
      // //  return this.defaultRenderer({ value : resource.id })
      // }
      template: ((value, record, field) => `<a href="javascript:void;" id="machineId">${value.value}</a>`)
    },
    // {
    //   text: this._translateSvc.instant('workstation-no'), field: 'workStationNo', filterable: true, editor: false, showEventCount: false,
    //   width: 100
    // },
    {
      text: this._translateSvc.instant('workstation'),
      field: 'name',
      editor: false,
      width: 125,
      showEventCount: false,
      flex: 1,
      renderer({ cellElement, record }) {
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
        const num = record.id % 11;
        const color = eventColors[num];
        const rcolor = resourceColors[num];
        if (cellElement) {
          cellElement.id = 'machinename';
          cellElement['data-recordid'] = record.id;
          cellElement.style.cursor = "pointer";
          cellElement.style.backgroundColor = rcolor;
          cellElement.style.color = '#fff';
          cellElement.style.fontWeight = 400;
        }
        // record.eventColor = color;

        return record.name;
      },

      filterable: true
      // filterable: {
      //   filterField : {
      //       type  : 'combo',
      //       value : '',
      //       items : [
      //         ...this.resources.map(item => item.name)
      //       ]
      //   }
      // },
    },
    // {text: 'Start Date', field: 'startDate', filterable: true, editor: false, showEventCount: false},
    // {text: 'End Date', field: 'endDate', filterable: true, editor: false, showEventCount: false},
    { text: 'Job Cnt', field: 'jobCount', editor: false, filterable: false, showEventCount: false, width: 50 },
    { text: 'Ind. Capacity', field: 'individualCapacity', editor: false, filterable: false, showEventCount: false, width: 50 },
    {
      text: 'Allocation', flex: 1,
      editor: false,
      filterable: false,
      type: 'template',
      field: 'allocation', showEventCount: false,
      template: ({ record: resource }) => {
        // Detect overlap
        // if (resource.events.some(task =>
        //   task.isScheduled && !this.scheduler.eventStore.isDateRangeAvailable(task.startDate, task.endDate, task, resource))
        // ) {
        //   return '<i class="b-fa b-fa-exclamation-triangle" style="color: red" data-btip="Overlap!"></i>';
        // }
        // Calculate allocation
        //const duration = resource.events.reduce((total, task) => total += task.duration, 0);
        //const allocation = Math.round((duration / 40) * 100);
        const allocation = resource.allocation;
        // this.defaultRenderer({ value : allocation })

        return '<div class="b-percent-bar-outer"><div class="b-percent-bar' + (allocation < 10 ? ' b-low' : '') + '" style="width: ' + allocation + '%;">APS:' + allocation + '%</div></div>'
          + (resource.allocationErp ? '<div class="b-percent-bar-outer mt-4"><div class="b-percent-bar' + (resource.allocationErp < 10 ? ' b-low' : '') + '" style="width: ' + resource.allocationErp + '%;">ERP:' + resource.allocationErp + '%</div></div>' : '');
        // return allocation;
      }
    },
    {
      type: 'action',
      text: 'Action',
      width: 45,
      align: 'center',
      actions: [{
        cls: 'b-fa b-fa-fw b-fa-line-chart',
        renderer: ({ action, record }) => {
          if (record.allocation > 0) {
            return `
              <button type="button" class="btn btn-primary"
              data-toggle="tooltip" data-placement="top" title="Show Allocation By Shift"
              style="margin-left: 10%;" id="allocationByShift"><i class="fa fa-line-chart"></i></button>
            `
          } else {
            return '';
          }
        },
        tooltip: 'Report',
        onClick: ({ record }) => {
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
    },
    // {text: 'Erp Start', field: 'erpStartDate', editor: false, showEventCount: false, hidden: true, width: 100},
    // {text: 'Erp End', field: 'erpEndDate',editor: false, showEventCount: false, hidden: true, width: 100},
    // {text: 'Individual Capacity', field: 'individualCapacity', showEventCount: false},

    // {
    //   type: 'template',
    //   text: 'Concat',
    //   showEventCount: false,
    //   editor: false,
    //   template: (value, record, field) => `<button class="btn btn-info" id="concatEvent">Concat</button>`
    // },
  ];
  calendarDate;
  startCalendarDate;
  endCalendarDate;
  labels = {
    bottom({ eventRecord }) {

      // const data = this.scheduler.eventStore.data.find(evnt =>
      //   (evnt.jobOrderOperationId === eventRecord.nextJobOrderOperationId) ||
      //   (evnt.nextJobOrderOperationId === eventRecord.jobOrderOperationId));
      // if(data) {
      //   return `<span style="color:red; font-weight:400;">#skv: ${eventRecord.totalSkillValue}</span>`;
      // }
      // if (eventRecord.totalSkillValue && eventRecord.totalSkillValue >= 16) {
      //   const eventList: Array<any> = this.scheduler.eventStore.data.filter(evnt => evnt.resourceId === eventRecord.resourceId);
      //   const WheresTheDev = obj => obj.id === eventRecord.data.id;
      //   const index = eventList.findIndex(WheresTheDev);
      //   if(index === undefined || null) {
      //     return null;
      //   }

      //   if(index === 0) {
      //     if(eventList[index + 1].startDate !== eventList[index].startDate
      //       && eventRecord.totalSkillValue >= 16 && eventList[index + 1].totalSkillValue >= 16) {
      //         eventRecord.eventColor = 'red';
      //         ReservedWorkstation.AddWrk(eventRecord.data.resourceId);
      //         return `<span style="color:red; font-weight:400;">#skv: ${eventRecord.totalSkillValue}</span>`;
      //       } else {return null;}
      //   } else {
      //     if(eventList[index + 1].startDate !== eventList[index].startDate &&
      //         eventRecord.totalSkillValue >= 16 && eventList[index + 1].totalSkillValue >= 16 &&
      //         ReservedWorkstation.GetWrks(eventRecord.data.resourceId).length < 2
      //         ) {
      //           eventRecord.eventColor = 'red';
      //           ReservedWorkstation.AddWrk(eventRecord.data.resourceId);
      //           return `<span style="color:red; font-weight:400;">#skv: ${eventRecord.totalSkillValue}</span>`;
      //       }
      //       if(eventList[index - 1].startDate !== eventList[index].startDate &&
      //         eventRecord.totalSkillValue >= 16 && eventList[index - 1].totalSkillValue >= 16 &&
      //         ReservedWorkstation.GetWrks(eventRecord.data.resourceId).length < 2
      //         ) {
      //           eventRecord.eventColor = 'red';
      //           ReservedWorkstation.AddWrk(eventRecord.data.resourceId);
      //           return `<span style="color:red; font-weight:400;">#skv: ${eventRecord.totalSkillValue}</span>`;
      //       }

      //       return null;
      //   }
      // }
      return null;
    }
  };
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

      if (task.status === JobOrderStatusEnum.PROCESSING) {
        return {
          valid: false,
          message: 'Cannot change the length of a processing job!'
        };
      }
      ;
    }
  };

  pdfExport = {
    // exportServer : 'http://localhost:8080'
    exportServer: 'https://dev.bryntum.com:8082',
    orientation: 'landscape',
    format: 'A3',
    exporterType: 'MultiPageVerticalExporter'
  };

  excelExporter = {

    zipcelx,
    // Choose the date format for date fields
    // dateFormat : 'YYYY-MM-DD HH:mm',
    dateFormat: 'YYYY-MM-DD HH:mm',

    exporterConfig: {

      // Choose the columns to include in the exported file

      columns: [
        { text: 'WorkCenterType', field: 'workCenterTypeName', width: 350 },
        { text: 'WorkCenter', field: 'workCenterName', width: 350 },
        { text: 'WorkStation Id', field: 'id', width: 250 },
        { text: 'WorkStation', field: 'name', width: 350 },
        { text: 'Job Cnt', field: 'jobCount', width: 100 },
        { text: 'Allocation', field: 'allocation', type: 'number', width: 120 },

        // { text : 'Erp Start', field : 'erpStartDate', width : 120 },
        // { text : 'Erp End', field : 'erpEndDate', width : 120 },
      ],
      eventColumns: [
        { text: 'Operation Task Code', field: 'operationTaskCode', width: 500 },
        { text: 'Reference Id', field: 'prodOrderReferenceId', width: 500 },
        { text: 'Material No', field: 'materialNo', width: 500 },
        { text: 'Operation', field: 'operationName', width: 500 },
        { text: 'Prod Order Id', field: 'prodOrderId', width: 500 },
        { text: 'Job Order Id', field: 'jobOrderId', width: 500 },
        { text: 'Equipment No', field: 'equipmentNo', width: 500 },
        { text: 'Total Duration', field: 'totalDurationAsString', width: 500 },
        { text: 'Individual Capacity', field: 'individualCapacity', width: 500 },
        { text: 'Needed Person', field: 'neededPerson', width: 500 },
        { text: 'Start', field: 'startDate', width: 400 },
        { text: 'End', field: 'endDate', width: 400 },
        { text: 'Erp Start', field: 'erpStartDate', width: 400 },
        { text: 'Erp End', field: 'erpEndDate', width: 400 },
        { text: 'Due Date', field: 'prodOrderErpFinishDate', width: 400 },
        { text: 'Planned Quantity', field: 'plannedQuantity', width: 400 },
        { text: 'Produced Quantity', field: 'producedQuantity', width: 400 },
        { text: 'ERP Remaining Quantity', field: 'erpRemainingQuantity', width: 400 },
        { text: 'Job Order Status', field: 'status', width: 400 },

      ]
    }
  };

  // modify right click event menu
  eventContextMenu = {};
  dirtyDates = [];

  @ViewChild('datePickerContainer') datePickerContainer: ElementRef;

  minDate = new Date();
  maintenanceOrderPageFilter = {
    pageNumber: 1,
    pageSize: 999,
    maintenanceNotificationId: null,
    maintenanceFunctionalLocationId: null,
    maintenanceSystemConditionId: null,
    maintenanceOrderTypeId: null,
    planningPlantName: null,
    priority: null,
    address: null,
    assembly: null,
    dateBasicStart: null,
    datePriority: null,
    dateRevision: null,
    datebasicFinish: null,
    equipmentName: null,
    mainWorkStationId: null,
    maintenanceActivityTypeId: null,
    maintenanceCategoryId: null,
    maintenanceReasonId: null,
    maintenanceId: null,
    plannerGroupId: null,
    planningPlantId: null,
    responsebyId: null,
    problemDefination: null,
    maintenanceStatus: 'OUTSTANDING',
    workStationName: null,
    query: null,
    orderByProperty: 'maintenanceId',
    orderByDirection: 'desc'
  };
  panel = { title: null, visible: false, data: null, numberOfJobs: null };
  @ViewChild('dJoin') dJoin: Dialog;

  validateDelete(context) {
    console.log(context.status)
    return context && context.status !== JobOrderStatusEnum.PROCESSING;
  }

  validateDropEvent(context) {
    const draggedEvent = context.draggedRecords[0];
    const targetWorkstationId = context.newResource.data.workStationId;
    const sourceWorkstationId = draggedEvent.data.resourceId;
    const eventList = this.events.filter(event => event.prodOrderId === draggedEvent.data.prodOrderId);

    if (targetWorkstationId != sourceWorkstationId && draggedEvent.data.alternativeWorkStationList.length > 1) {

      if (draggedEvent.data.alternativeWorkStationList != null &&
        draggedEvent.data.alternativeWorkStationList.filter(k => k === targetWorkstationId).length === 0) {
        return false;
      }

    }
    eventList.sort((a, b) => parseInt(b.orderNo) - parseInt(a.orderNo));
    for (let i = 0; i < eventList.length; i++) {
      if (i === 0 && eventList[i].id === draggedEvent.data.id) {
        return true;
      } else if (eventList[i].id === draggedEvent.data.id) {
        const endDate = new Date(eventList[i - 1].startDate);
        const startDate = new Date(context.startDate);
        // if (endDate > startDate) {
        //   return false;
        // }
      }
    }

    return true;
  }

  saveCapObj = {
    label: this._translateSvc.instant('save-shift-capacity'), icon: 'fa fa-file',
    command: () => {
      this.saveShiftCapacity();
    }
  };



  selecteMenuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('release-reservation-and-reschedule'), icon: 'fa fa-window-restore',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.releaseReservationAndReSchedule();
          },
          reject: () => { }
        });
      }
    },
    {
      label: this._translateSvc.instant('recheck-job-order-for-unrestricted-quantities'), icon: 'fa fa-recycle',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.recheckJobOrderForUnrestrictedQuantities();
          },
          reject: () => { }
        });
      }
    },
    {
      label: this._translateSvc.instant('create-semi-finished-production-orders'), icon: 'fa fa-first-order',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.createSemiFinishedProductionOrders();
          },
          reject: () => { }
        });

      }
    },
    {
      label: this._translateSvc.instant('deliver-manual-purchase-order'), icon: 'fa fa-file',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.deliverManualPurchaseOrder();
          },
          reject: () => { }
        });


      }
    },
    {
      label: this._translateSvc.instant('release-pallet-reservation'), icon: 'fa fa-window-restore',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.releasePalletReservation();
          },
          reject: () => { }
        });
      }
    },
    {
      label: this._translateSvc.instant('divide-job-orders'), icon: 'fa fa-columns',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.divideJobOrderOperation();
          },
          reject: () => { }
        });
      }
    },
    {
      label: this._translateSvc.instant('check-stock-reservation'), icon: 'fa fa-cube',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.checkStockReservation();
          },
          reject: () => { }
        });
      }
    },

    // {
    //   label: this._translateSvc.instant('combine-production-orders'), icon: 'fa fa-crosshairs', style: 'width: 200px',
    //   command: () => {
    //     this.combineJobOrders();
    //   }
    // },

    {
      label: this._translateSvc.instant('combine-job-orders'), icon: 'fa fa-crosshairs', style: 'width: 200px',
      command: () => {
        this._confirmationSvc.confirm({
          message: this._translateSvc.instant(
            "do-you-want-to-change-the-configuration"
          ),
          header: this._translateSvc.instant("change-confirmation"),
          icon: "",
          accept: () => {
            this.combineJobOrderOperations();
          },
          reject: () => { }
        });
      }
    },

    // {
    //   label: this._translateSvc.instant('warehouse-shift-report'), icon: 'fa fa-file',
    //   command: () => {
    //     this.warehouseShiftReport();
    //   }
    // },
    // {
    //   label: this._translateSvc.instant('warehouse-po-jo-shift-report'), icon: 'fa fa-file',
    //   command: () => {
    //     this.warehousePOJOShiftReport();
    //   }
    // },
    // {
    //   label: this._translateSvc.instant('warehouse-purchase-shift-report'), icon: 'fa fa-file',
    //   command: () => {
    //     this.warehousePurchaseShiftReport();
    //   }
    // },

  ];



  constructor(private _workcenterSvc: WorkcenterService,
    private wcTypesrv: WorkcenterTypeService,
    private _prodOrderSrvc: ProductionOrderService,
    private _jbOrderSvc: JobOrderService,
    private _workStationSvc: WorkstationService,
    private datePipe: DatePipe,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private utilities: UtilitiesService,
    private _stopCauseSvc: StopCauseService,
    private maintenanceOrderSvc: MaintenanceOrderService,
    private _enumSvc: EnumService,
    private _scheduleReportSvc: ScheduleReportService,
    private _simulationSvc: SimulationService,
    private _confirmationSvc: ConfirmationService) {
    this.sub.push(this.appStateService.plantAnnounced$.subscribe(res => {
      if (res && res.plantId) {
        // this.pageFilter.plantId = null;
        this.filterSchedule.plantId = res.plantId;
        this.filterWorkcenter.plantId = res.plantId;
        this.filterSimulation.plantId = res.plantId;
        this.maintenanceOrderPageFilter.planningPlantId = res.plantId;
        this.maintenanceOrderPageFilter.planningPlantName = res.plantName;
        if (!this.selectedPlant || this.selectedPlant.plantId !== res.plantId) {
          this.selectedPlant = res;
          this.requestScheduleJobOrdersDto.productionSchedulingParameterId = null;
          this.ProductionSchedulingParameter();
          this.filterWorkCenters();
          this.filterSimulations();
        } else {
          this.selectedPlant = res;
        }

        this.filterWorkCenterTypes(this.filterSchedule.plantId);

      } else {
        this.selectedPlant = null;
        this.filterWorkcenter.plantId = null;
      }
    }));
  }

  filterWorkCenters() {
    this._workcenterSvc.filter(this.filterWorkcenter)
      .then(result => {
        this.workcenters = [...[{ workCenterName: 'All', workCenterId: -1 }], ...result['content']];
        // this.loadData();
      }).catch(error => console.log(error));
  }

  filterSimulations() {
    this._simulationSvc.filter(this.filterSimulation)
      .then(result => {
        this.simulations = [...[{ scheduleSimulationName: 'Select Simulation', scheduleSimulationId: null }], ...result['content']];
        // this.loadData();
      }).catch(error => console.log(error));
  }

  filterWorkCenterTypes(plantId: any) {
    this.workcenterTypes = [];
    this.wcTypesrv.getWorkCentreTypeByPlantId(plantId).then((result: any) => {
      this.workcenterTypes = [...[{ workCenterTypeName: 'All', workCenterTypeId: -1 }], ...result];
    }).catch(error => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(error);
    });
  }

  ProductionSchedulingParameter() {
    this._jbOrderSvc.filterProductionSchedulingParameters({ pageNumber: 1, pageSize: 1000, plantId: this.selectedPlant.plantId }).then(result => {
      if (result['content'].length > 0) {
        if (!result['content'][0].finishDate) {
          result['content'][0].finishDate = moment(Date.now()).add(1, 'weeks').toDate();
        }
        result['content'][0].finishDate = moment(result['content'][0].finishDate).toDate();
        result['content'][0].startDate = result['content'][0].startDate ? moment(result['content'][0].startDate).toDate() : null;
        this.requestScheduleJobOrdersDto = result['content'][0];
        if (!this.requestScheduleJobOrdersDto.presetView) {
          this.requestScheduleJobOrdersDto.presetView = 'dayAndWeek';
        }
        if (!this.requestScheduleJobOrdersDto.viewPeriod) {
          this.requestScheduleJobOrdersDto.viewPeriod = 1;
        }
        this.setSelectedScheduleMode(this.requestScheduleJobOrdersDto.scheduleType);

        if (this.requestScheduleJobOrdersDto.startDate) {
          this.isStartDateSelected = true;
        }
        if (!this.requestScheduleJobOrdersDto.finishDate) {
          this.requestScheduleJobOrdersDto.finishDate = moment(Date.now()).add(1, 'weeks').toDate();
        }
        localStorage.setItem('lastScheduleDate', JSON.stringify(this.requestScheduleJobOrdersDto.lastScheduleDate));
      }
    }).catch(error => {
      console.log(error)
    });

    this.getStopCauseList();
  }


  loadData() {
    // if (this.selectedWorkCenters != null) {
    this.loaderService.showLoader('Load data is loading...');
    this.showLoader = true;
    this.onCreateContextMenu(false);
    this.filterMaintenanceOperationsFromSetting();
    //  this.showDueJobs = false;
    // } else {
    //   this.utilities.showErrorToast('choose-valid-work-center');
    // }

  }


  isPlannedStopVisibleEvent(event) {
    if (this.isPlannedStopVisible) {
      this.stopCauseListFinal = [...this.stopCauseList];
    } else {
      this.stopCauseListFinal = [];
    }
  }

  showDueJobsEvent(event) {
    if (this.scheduler) {
      const scheduler = this.scheduler.getSchedulerEngine();
      scheduler.showDueJobs = this.showDueJobs;
      if (this.showDueJobs) {
        scheduler.eventStore.forEach(task => {
          let colr = '';
          let fontClr = '';
          if (task && task.data && task.data['prodOrderId']) {
            if (task.data['prodOrderErpFinishDate']) {
              if ((new Date(task.data['prodOrderErpFinishDate']) < new Date(task.data['endDate']))) {
                colr = 'red';
                fontClr = '#ffffff';
              }
            } else if (task.data['prodOrderFinishDate']) {
              if ((new Date(task.data['prodOrderFinishDate']) < new Date(task.data['endDate']))) {
                colr = 'red';
                fontClr = '#ffffff';
              }
            }
          }
          if (colr !== '' || fontClr !== '') {
            // task.eventStyle = 'font-weight: bold; border-radius: 3px; background-color:' + colr + '; color:' + fontClr;
            task.eventColor = colr;
          }
        });
      } else {
        scheduler.eventStore.forEach(task => {
          let colr = '';
          let fontClr = '';
          if (task && task.data && task.data['prodOrderId']) {
            if (task.data['prodOrderErpFinishDate']) {
              if ((new Date(task.data['prodOrderErpFinishDate']) < new Date(task.data['endDate']))) {
                const color = ReservedColor.GetColor(task.data['prodOrderId']);
                if (color) {
                  colr = color;
                } else {
                  colr = '#' + Math.floor(Math.random() * (16777215 + task.data['prodOrderId'])).toString(16);
                  ReservedColor.AddColor(colr, task.data['prodOrderId']);
                }
                const lightOrDark = ConvertUtil.lightOrDark(colr);
                if (lightOrDark === 'dark') {
                  fontClr = '#ffffff';
                }
              }
            } else if (task.data['prodOrderFinishDate']) {
              if ((new Date(task.data['prodOrderFinishDate']) < new Date(task.data['endDate']))) {
                const color = ReservedColor.GetColor(task.data['prodOrderId']);
                if (color) {
                  colr = color;
                } else {
                  colr = '#' + Math.floor(Math.random() * (16777215 + task.data['prodOrderId'])).toString(16);
                  ReservedColor.AddColor(colr, task.data['prodOrderId']);
                }
                const lightOrDark = ConvertUtil.lightOrDark(colr);
                if (lightOrDark === 'dark') {
                  fontClr = '#ffffff';
                }
              }
            }
          }
          if (colr !== '' || fontClr !== '') {
            // task.eventStyle = 'font-weight: bold; border-radius: 3px; background-color:' + colr + '; color:' + fontClr;
            task.eventColor = colr;
          }
        });
      }
    }
  }

  setOptions() {
    this.options = {
      title: {
        display: false,
        text: 'Shift'
      },
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: true,
      responsive: true,
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
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
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            display: false,
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100,
            },
            scaleLabel: {
              display: false,
              labelString: 'Allocation',
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
          label: function (tooltipItem, data) {
            // console.log('@tooltipItem', tooltipItem)
            // console.log('@data', data)
            let element = data.datasets[tooltipItem.datasetIndex].label[tooltipItem.index];
            // console.log('@element', element)
            if (!element) {
              return '';
            }
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
    this.optionsWorkstation = {
      title: {
        display: true,
        text: 'Allocation'
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      hover: {
        animationDuration: 1
      },
      scales: {
        xAxes: {
          scaleLabel: {
            display: false,
            labelString: "",
          }
        },
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
            },
            display: false,
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              display: false,
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: false,
              labelString: 'Percentage',
            }
          }
        ]
      },
      animation: {
        duration: 0,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#181818';
          ctx.font = 'lighter 0.75rem "Arial"';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              const percent = dataset.data[index];
              const offset = -5;
              if (percent) {
                ctx.fillText(percent + '%', bar._model.x, bar._model.y + offset);
              }

            });
          });
        }
      }
    };
  }

  ngOnInit() {

    for (let i = 1; i <= 100; i++) {
      this.weightValues.push(i + '');
    }

    this.setOptions();
    // if (!this.selectedPlant) {
    //   this._workcenterSvc.filter(this.filterWorkcenter).then(result => {
    //     this.workcenters = [...[{workCenterName: 'All', workCenterId: -1}], ...result['content']];
    //   }).then(() => this.loadData()).catch(error => console.log(error));
    // }

    // set scheduler end date as one week later.
    this.requestScheduleJobOrdersDto.finishDate = moment(Date.now()).add(1, 'weeks').toDate();
    this.maintenanceOrderPageFilter.datebasicFinish = ConvertUtil.date2EndOfDay(moment(Date.now()).add(1, 'weeks').toDate());
    // this.maintenanceOrderPageFilter.dateBasicStart = ConvertUtil.date2StartOfDay(Date.now());

    //for a request from backend
    this.maintenanceOrderPageFilter.dateBasicStart = null;

    // if (this.selectedPlant) {
    //   this._jbOrderSvc.filterProductionSchedulingParameters({pageNumber: 1, pageSize: 1000, plantId: this.selectedPlant.plantId}).then(result => {
    //     if (result['content'].length > 0) {
    //       if (!result['content'][0].finishDate) {
    //         result['content'][0].finishDate = moment(Date.now()).add(1, 'weeks').toDate();
    //       }
    //       result['content'][0].finishDate = moment(result['content'][0].finishDate).toDate();
    //       result['content'][0].startDate = result['content'][0].startDate ? moment(result['content'][0].startDate).toDate() : null;
    //       this.requestScheduleJobOrdersDto = result['content'][0];

    //       if (this.requestScheduleJobOrdersDto.startDate) {
    //         this.isStartDateSelected = true;
    //       }
    //     }
    //   }).catch(error => {
    //     console.log(error)
    //   });

    //   this.getStopCauseList();
    // }

    this._enumSvc.getTimeIntervalEnum().then(result => this.timeIntervalEnumList = result).catch(error => console.log(error));
    this._enumSvc.getJobOrderScheduleTypeEnum()
      .then(result => {
        this.scheduleTypeList = result
      }).catch(error => console.log(error));

    this.sub.push(JobOrderServiceStatic.divideObs.subscribe(jobOrder => {
      if (jobOrder) {
        this.selectedReadyJobOrders.push(jobOrder);
        this.panel.title = 'divide-job-order';
        this.panel.visible = true;
      }
    }));
    this.sub.push(JobOrderServiceStatic.showRelationsObs.subscribe(async (prodOrder: any) => {
      if (prodOrder && prodOrder.jobOrderList) {
        const Tempdependencies = [];

        for (let i = 0; i < prodOrder.jobOrderList.length; i++) {
          const jobOrder = prodOrder.jobOrderList[i];
          if (jobOrder.previousJobOrderId) {
            Tempdependencies.push({
              id: Tempdependencies.length + 'DepenDen',
              to: jobOrder.previousJobOrderId,
              from: jobOrder.jobOrderId,
            });
          }
          if (jobOrder.reservationList && jobOrder.reservationList.length > 0) {
            for (let index = 0; index < jobOrder.reservationList.length; index++) {
              const stockReservation = jobOrder.reservationList[index];
              if (stockReservation.waitingForJobOrderOperationId) {
                try {
                  const res: any = await this._jbOrderSvc.getJobOrderOperationDetails(stockReservation.waitingForJobOrderOperationId);
                  if (res) {
                    Tempdependencies.push({
                      id: Tempdependencies.length + 'DepenDen',
                      from: res.jobOrderId,
                      to: jobOrder.jobOrderId,
                    });
                  }
                } catch (error) {
                  console.error(error);
                }
              }
            }

          }
        }
        if (Tempdependencies && Tempdependencies.length > 0) {
          // this.filterName = prodOrder.prodOrderId + '';
          // this.filterEvents('name', this.filterName);
          setTimeout(() => {
            const scheduler = this.scheduler.getSchedulerEngine();
            scheduler.eventStore.forEach(event => {
              if (event.data.prodOrderId === prodOrder.prodOrderId) {
                event.showRelation = true;
              }
            });
          }, 50);
          this.dependencies = [...Tempdependencies];
          console.log(this.dependencies);
        } else {
          this.dependencies = [];
        }

        // this.panel.data = this.detailList2Node(this.listToTree(prodOrder.jobOrderList));
        // this.panel.title = 'show-relations';
        // this.panel.visible =  true;
      }
    }));
    this.sub.push(JobOrderServiceStatic.hideRelationsObs.subscribe((event: any) => {
      this.dependencies = [];
      // this.filterName = '';
      // this.filterEvents('name', this.filterName);
      setTimeout(() => {
        const scheduler = this.scheduler.getSchedulerEngine();
        scheduler.eventStore.forEach(event => {
          event.showRelation = false;
        });
      }, 50);
      // this.panel.data = this.detailList2Node(this.listToTree(prodOrder.jobOrderList));
      // this.panel.title = 'show-relations';
      // this.panel.visible =  true;
    }));

    this.sub.push(JobOrderServiceStatic.cloneObs.subscribe((eventOrder: any) => {
      if (eventOrder) {
        this.clonedEvent = eventOrder.data;
        this.clonedEvent.operationName = this.clonedEvent.name.split('#')[2].slice(2);
        this.panel.title = 'clone-operation';
        this.panel.visible = true;
      }
    }));

    this.sub.push(JobOrderServiceStatic.cancelObs.subscribe((eventOrder: any) => {
      if (eventOrder) {
        // this.getData(this.filterSchedule);
      }
    }));

    this.sub.push(JobOrderServiceStatic.getjobOrderChangeStatusObs().subscribe((eventOrder: any) => {
      if (eventOrder) {
        this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = eventOrder.jobOrderOperationId;
        this.reqChangeJobOrderOperationStatusDto.startDate = new Date(eventOrder.startDate);
        if (eventOrder.status === JobOrderStatusEnum.PROCESSING && eventOrder.title === 'processing-to-completed') {
          this.reqChangeJobOrderOperationStatusDto.finishDate = new Date();
        } else if (eventOrder.title === 'update-planned-task') {
          this.reqChangeJobOrderOperationStatusDto.finishDate = new Date(eventOrder.endDate);
        } else if (eventOrder.status === JobOrderStatusEnum.LONG_TERM_PROCESSING && eventOrder.title === 'processing-to-completed') {
          this.reqChangeJobOrderOperationStatusDto.finishDate = new Date(eventOrder.endDate);
        } else {
          this.reqChangeJobOrderOperationStatusDto.finishDate = new Date(eventOrder.endDate);
        }
        this.panel.title = eventOrder.title;
        this.panel.data = eventOrder;
        this.panel.visible = true;
      }
    }));


    this.sub.push(JobOrderServiceStatic.getPlanJobOrderManually().subscribe((eventOrder: any) => {
      if (eventOrder) {
        this.reqJobOrderPlanManuallyDto.jobOrderId = eventOrder.jobOrderId;
        this.reqJobOrderPlanManuallyDto.jobOrderOperationId = eventOrder.jobOrderOperationId;
        this.reqJobOrderPlanManuallyDto.individualCapacity = eventOrder.individualCapacity;
        this.reqJobOrderPlanManuallyDto.operationWorkstationList[0].workStationId = eventOrder.resourceId;
        this.reqJobOrderPlanManuallyDto.operationWorkstationList[0].jobOrderOperationId = eventOrder.jobOrderOperationId;
        this.reqJobOrderPlanManuallyDto.prodOrderId = eventOrder.prodOrderId;
        this.reqJobOrderPlanManuallyDto.startDate = new Date(eventOrder.startDate);
        this.reqJobOrderPlanManuallyDto.finishDate = new Date(eventOrder.endDate);

        this.reqJobOrderPlanManuallyDto.workStationId = eventOrder.resourceId;
        this.panel.title = eventOrder.title;
        this.panel.data = eventOrder;
        this.panel.visible = true;
      }
    }));
    debugger;

  }

  exportToPDF() {
    this.pdfExport.orientation = 'landscape';
    this.scheduler.getSchedulerEngine().features.pdfExport.showExportDialog();



    // this.scheduler.getSchedulerEngine().features.pdfExport.export({
    //   columns: this.scheduler.getSchedulerEngine().columns.map(c => c.id) // Required, set list of column ids to export
    // }).then(result => {
    //   //     // Response instance and response content in JSON
    //   let { response } = result;
    // });




  }
  exportToExcel() {
    // this.scheduler.getSchedulerEngine().setTimeSpan(DateHelper.add(date, 8, 'hour'), DateHelper.add(date, 18, 'hour'));
    this.scheduler.getSchedulerEngine().features.excelExporter.export();
  }


  exportNew() {

    this.scheduler.getSchedulerEngine().features.excelExporter.export();

  }
  // ngAfterViewInit() {
  //   // exposing scheduling engine to be easily accessible from console
  //   // window.scheduler = this.scheduler.getSchedulerEngine();

  // }

  ngOnDestroy(): void {
    localStorage.removeItem('lastScheduleDate');
    this.loaderService.hideLoader();
    if (this.sub) {
      this.sub.forEach(sb => sb.unsubscribe());
    }
  }

  filterMaintenanceOperations() {
    // this.maintenanceOrderPageFilter.dateBasicStart = '2020-11-03T19:00:00.000Z';
    this.maintenanceOrderSvc.filterObservable(this.maintenanceOrderPageFilter).toPromise().then(
      result => {
        const maintenanceOrders: Array<any> = result['content'];
        const operations = maintenanceOrders.filter(op => op.planningPlant && op.planningPlant.plantId === this.selectedPlant.plantId).map((ord) => {
          if (ord.maintenanceOrderOperationList && ord.maintenanceOrderOperationList.length > 0) {
            ord.maintenanceOrderOperationList.forEach(oprt => {
              if (!oprt.workstation) {
                oprt.workstation = ord.mainWorkStation;
              }
              oprt.maintenanceOrder = ord;
              oprt.dateBasicStart = ord.dateBasicStart;
              oprt.datebasicFinish = ord.datebasicFinish;
            });
          }
          return (ord.maintenanceOrderOperationList);
        });
        this.maintenanceOperations = [].concat.apply([], operations);
        this.dirtyDates = [];
        // const selectedWorkCenterIds = [];
        // const selectedWorkCenterNames = [];
        // this.selectedWorkCenters.forEach(item => {
        //   selectedWorkCenterIds.push(item.workCenterId);
        //   selectedWorkCenterNames.push(item.workCenterName);
        // });
        // this.loadedWorkCenter = selectedWorkCenterNames.join();
        this.getData(this.filterSchedule);
      }).catch(err => console.error(err));
  }
  filterMaintenanceOperations2() {
    // this.maintenanceOrderPageFilter.dateBasicStart = '2020-11-03T19:00:00.000Z';
    this.maintenanceOrderSvc.filterObservable(this.maintenanceOrderPageFilter).toPromise().then(
      result => {
        const maintenanceOrders: Array<any> = result['content'];
        const operations = maintenanceOrders.filter(op => op.planningPlant && op.planningPlant.plantId === this.selectedPlant.plantId).map((ord) => {
          if (ord.maintenanceOrderOperationList && ord.maintenanceOrderOperationList.length > 0) {
            ord.maintenanceOrderOperationList.forEach(oprt => {
              if (!oprt.workstation) {
                oprt.workstation = ord.mainWorkStation;
              }
              oprt.maintenanceOrder = ord;
              oprt.dateBasicStart = ord.dateBasicStart;
              oprt.datebasicFinish = ord.datebasicFinish;
            });
          }
          return (ord.maintenanceOrderOperationList);
        });
        this.maintenanceOperations = [].concat.apply([], operations);
        this.dirtyDates = [];

        this.scheduleJobOrders();
      }).catch(err => console.error(err));
  }

  filterMaintenanceOperationsFromSetting() {
    if (this.requestScheduleJobOrdersDto.startDate) {
      this.maintenanceOrderPageFilter.dateBasicStart = ConvertUtil.date2StartOfDay(this.requestScheduleJobOrdersDto.startDate);
    }
    this.maintenanceOrderPageFilter.datebasicFinish = ConvertUtil.date2EndOfDay(this.requestScheduleJobOrdersDto.finishDate);
    this.filterMaintenanceOperations();
  }
  filterMaintenanceOperationsFromSetting2() {

    // this.loaderService.showLoader('Schedule Job Order is running...');
    if (this.requestScheduleJobOrdersDto.startDate) {
      this.maintenanceOrderPageFilter.dateBasicStart = ConvertUtil.date2StartOfDay(this.requestScheduleJobOrdersDto.startDate);
    }
    this.maintenanceOrderPageFilter.datebasicFinish = ConvertUtil.date2EndOfDay(this.requestScheduleJobOrdersDto.finishDate);
    // this.showDueJobs = false;
    // if(this.scheduler) {
    //   const scheduler = this.scheduler.getSchedulerEngine();
    //   scheduler.showDueJobs = false;
    // }
    this.filterMaintenanceOperations2();
  }
  eventRenderer({ eventRecord, tplData }) {

    // const eventColors = [
    //   // 'red', this is reserved for event not draggable
    //   'green', 'blue', 'yellow', 'purple', 'cyan', 'indigo', 'orange', 'lime', 'teal', 'pink', 'violet'];
    // // Inline style
    // // // Add CSS class
    // // tplData.cls.add('my-custom-css');
    // let colorIndex = 0;
    // colorIndex = eventRecord.id % 11;
    // let colr = eventColors[colorIndex];
    // let fontClr = '#f5eff0';
    // if (colr === 'yellow' || colr === 'lime' || colr === 'cyan' ||  colr === 'pink' ||  colr === 'violet') {
    //   fontClr = '#3d3638';
    // }
    let colr = '';
    let fontClr = '';
    if (eventRecord && eventRecord.data && eventRecord.data['prodOrderId']) {
      if (eventRecord.data['prodOrderErpFinishDate'] && this.showDueJobs) {
        if ((new Date(eventRecord.data['prodOrderErpFinishDate']) < new Date(eventRecord.data['endDate']))) {
          colr = 'red';
          fontClr = '#ffffff';
        } else {
          const color = ReservedColor.GetColor(eventRecord.data['prodOrderId']);
          if (color) {
            colr = color;
          } else {
            colr = '#' + Math.floor(Math.random() * (16777215 + eventRecord.data['prodOrderId'])).toString(16);
            ReservedColor.AddColor(colr, eventRecord.data['prodOrderId']);
          }
          const lightOrDark = ConvertUtil.lightOrDark(colr);
          if (lightOrDark === 'dark') {
            fontClr = '#ffffff';
          }
        }
      } else if (eventRecord.data['prodOrderFinishDate'] && this.showDueJobs) {
        if ((new Date(eventRecord.data['prodOrderFinishDate']) < new Date(eventRecord.data['endDate']))) {
          colr = 'red';
          fontClr = '#ffffff';
        } else {
          const color = ReservedColor.GetColor(eventRecord.data['prodOrderId']);
          if (color) {
            colr = color;
          } else {
            colr = '#' + Math.floor(Math.random() * (16777215 + eventRecord.data['prodOrderId'])).toString(16);
            ReservedColor.AddColor(colr, eventRecord.data['prodOrderId']);
          }
          const lightOrDark = ConvertUtil.lightOrDark(colr);
          if (lightOrDark === 'dark') {
            fontClr = '#ffffff';
          }
        }
      } else {
        const color = ReservedColor.GetColor(eventRecord.data['prodOrderId']);
        if (color) {
          colr = color;
        } else {
          colr = '#' + Math.floor(Math.random() * (16777215 + eventRecord.data['prodOrderId'])).toString(16);
          ReservedColor.AddColor(colr, eventRecord.data['prodOrderId']);
        }
        const lightOrDark = ConvertUtil.lightOrDark(colr);
        if (lightOrDark === 'dark') {
          fontClr = '#ffffff';
        }
      }

    } else if (eventRecord && eventRecord.data && eventRecord.data['maintenanceOperationId']) {
      colr = 'red';
      fontClr = '#ffffff';
    }


    tplData.style = 'font-weight: bold; border-radius: 3px; background-color:' + colr + '; color:' + fontClr;
    eventRecord.eventColor = colr;

    if (eventRecord.data.status == JobOrderStatusEnum.PROCESSING) {
      colr = 'red';
      fontClr = '#ffffff';

      tplData.style = 'font-weight: bold; border-radius: 3px; border-color: red';

    }
    return eventRecord.name;
  }



  onDateChange(date) {
    if (date) {
      // this.scheduler.getSchedulerEngine().resourceStore.filter({id : 'my-resource-filter',
      // filterBy: record => record.startDate.toDateString() === this.calendarDate.toDateString()});
      this.scheduler.getSchedulerEngine().eventStore.filter({
        id: 'my-filter',
        filterBy: record => record.startDate.toDateString() === this.calendarDate.toDateString()
      });
      this.scheduler.getSchedulerEngine().setTimeSpan(DateHelper.add(date, 7, 'hour'), DateHelper.add(date, 19, 'hour'));
    } else {
      // this.scheduler.getSchedulerEngine().resourceStore.removeFilter('my-resource-filter');
      this.scheduler.getSchedulerEngine().eventStore.removeFilter('my-filter');
      this.scheduler.getSchedulerEngine().setTimeSpan(new Date(this.startDate),
        new Date(this.endDate));
    }
  }


  workCentersChanged(event) {
    if (event.itemValue) { // one selected or diselected

      if (event.value.indexOf(event.itemValue) !== -1) {// selection happened

        if (event.itemValue.workCenterId === -1) {
          this.filterSchedule.workCenterId = null;
          this.selectedWorkCenters = { workCenterName: 'All', workCenterId: -1 };
        } else {
          // this.selectedWorkCenters = this.selectedWorkCenters.filter(item => item.workCenterId !== -1);
          this.filterSchedule.workCenterId = event.itemValue.workCenterId;
        }

      } else {// diselection happened

      }
    } else {// whole selected or diselected
      if (event.value.length > 0) {
        // this.selectedWorkCenters = [{workCenterName: 'All', workCenterId: -1}];
      }
    }
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
  async getData(filterSchedule) {
    const me = this;
    const temp = Object.assign({}, filterSchedule);
    // if (this.searchBy === 'searchbyerp') {
    //   if (temp.erpStartDate) {
    //     temp.erpStartDate = ConvertUtil.date2StartOfDay(temp.erpStartDate);
    //     temp.erpStartDate = ConvertUtil.localDateShiftAsUTC(temp.erpStartDate);

    //   } if (temp.erpFinishDate) {
    //     temp.erpFinishDate = ConvertUtil.date2EndOfDay(temp.erpFinishDate);
    //     temp.erpFinishDate = ConvertUtil.localDateShiftAsUTC(temp.erpFinishDate);
    //   }

    // } else {
    //   if (temp.startDate) {
    //     temp.startDate = ConvertUtil.date2StartOfDay(temp.startDate);
    //     temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    //   } if (temp.finishDate) {
    //     temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
    //     temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    //   }
    // }

    try {
      const res = await this._workStationSvc.getWorkStationsScheduleJobs(temp);
      // if(!res) {
      //   me.loaderService.hideLoader();
      //   this.events = [];
      //   this.resources = [];
      //   me.showLoader = false;
      //   return 0;
      // }
      me.responseWorkCenterByWorkStationAndJobOrderDto = res || [];
      me.createEvents(res || []);
      me.loaderService.hideLoader();
      me.showLoader = false;
      if (this.selecteMenuItems.length === 6) {
        this.selecteMenuItems.splice(-1, 1);
      }

    } catch (error) {
      console.log(error);
      me.loaderService.hideLoader();
      me.showLoader = false;
      this.utilities.showErrorToast(error);
    }
  }

  private createEvents(res) {
    let minDate = 0;
    let maxDate = 0;
    this.resources = [];
    this.events = [];
    const me = this;
    const now = Date.now();
    const resources = [];
    ReservedColor.ResetColors();
    const events = [];
    me.workstations = [];
    if (res['workStationForWorkcenterDtos'] && res['workStationForWorkcenterDtos'].length > 0) {
      res['workStationForWorkcenterDtos'].forEach(item => {
        me.workstations.push({ workStationId: item.workStationId, workStationName: item.name });
        resources.push({
          id: item.workStationId,
          workStationId: item.workStationId,
          workStationNo: item.workStationNo,
          workCenterId: item.workCenterId,
          workCenterName: item.workCenterTypeName + " - " + item.workCenterName,
          workCenterTypeName: item.workCenterTypeName,
          name: item.workStationNo + ' | ' + item.name,
          startDate: item.startDate === null ? null : moment(new Date(item.startDate)).format('YYYY-MM-DD HH:mm:ss'),
          endDate: item.endDate === null ? null : moment(new Date(item.endDate)).format('YYYY-MM-DD HH:mm:ss'),
          // startDate: (this.searchBy==='searchbyerp')
          // ? moment(item.erpStartDate == null ? now : new Date(item.erpStartDate)).format('YYYY-MM-DD HH:mm:ss')
          // : moment(item.startDate == null ? now : new Date(item.startDate)).format('YYYY-MM-DD HH:mm:ss'),
          // endDate: (this.searchBy==='searchbyerp')
          // ? moment(item.erpFinishDate == null ? now : new Date(item.erpFinishDate)).format('YYYY-MM-DD HH:mm:ss')
          // : moment(item.endDate == null ? now : new Date(item.endDate)).format('YYYY-MM-DD HH:mm:ss'),
          jobCount: item.jobCount,
          allocation: Math.round(item.allocation * 100),
          allocationErp: Math.round(item.allocationErp * 100),
          individualCapacity: item.individualCapacity,

        })
      });
    }
    if (res['jobOrderForWorkCenterDtos'] && res['jobOrderForWorkCenterDtos'].length > 0) {
      let jobOrderForWorkCenterDtos = res['jobOrderForWorkCenterDtos'];
      if (this.searchBy === 'searchbyerp') {
        jobOrderForWorkCenterDtos = jobOrderForWorkCenterDtos.filter(item => item.erpStartDate != null || item.erpFinishDate != null);
      } else {
        jobOrderForWorkCenterDtos = jobOrderForWorkCenterDtos.filter(item => item.startDate != null || item.finishDate != null);
      }

      // console.log(this.find_duplicates(jobOrderForWorkCenterDtos.map(item => item.jobOrderId)));

      jobOrderForWorkCenterDtos.forEach((item, i) => {
        if (this.searchBy === 'searchbyerp') {
          if (minDate === 0) {
            minDate = item.erpStartDate;
          }
          if (minDate > item.erpStartDate) {
            minDate = item.erpStartDate;
          }
          if (maxDate === 0) {
            maxDate = item.erpEndDate;
          }
          if (maxDate < item.erpEndDate) {
            maxDate = item.erpEndDate;
          }
          if (maxDate < minDate) {
            const min = maxDate;
            maxDate = minDate;
            minDate = min;
          }

        } else {
          if (minDate === 0) {
            minDate = item.startDate;
          }
          if (minDate > item.startDate) {
            minDate = item.startDate;
          }
          if (maxDate === 0) {
            maxDate = item.endDate;
          }
          if (maxDate < item.endDate) {
            maxDate = item.endDate;
          }
          if (maxDate < minDate) {
            const min = maxDate;
            maxDate = minDate;
            minDate = min;
          }
        }


        const aEvent = {
          id: item.jobOrderId,
          resourceId: item.resourceId,
          jobOrderId: item.jobOrderId,
          name: this.getJobName(item),
          operationName: JSON.stringify(item.operationName),
          operationTaskCode: item.operationTaskCode,
          prodOrderReferenceId: item.prodOrderReferenceId,
          startDate: (this.searchBy === 'searchbyerp')
            ? moment(item.erpStartDate == null ? now : new Date(item.erpStartDate)).format('YYYY-MM-DD HH:mm:ss')
            : moment(item.startDate == null ? now : new Date(item.startDate)).format('YYYY-MM-DD HH:mm:ss'),
          endDate: (this.searchBy === 'searchbyerp')
            ? moment(item.erpEndDate == null ? now : new Date(item.erpEndDate)).format('YYYY-MM-DD HH:mm:ss')
            : moment(item.endDate == null ? now : new Date(item.endDate)).format('YYYY-MM-DD HH:mm:ss'),
          // startDate: moment(new Date(item.startDate)).format('YYYY-MM-DD HH:mm:ss'),
          // endDate: moment(new Date(item.endDate)).format('YYYY-MM-DD HH:mm:ss'),
          setupFinishDate: item.setupFinishDate == null ? null : moment(new Date(item.setupFinishDate)).format('YYYY-MM-DD HH:mm:ss'),
          status: item.status,
          erpStartDate: item.erpStartDate == null ? null : moment(new Date(item.erpStartDate)).format('YYYY-MM-DD HH:mm:ss'),
          erpEndDate: item.erpEndDate == null ? null : moment(new Date(item.erpEndDate)).format('YYYY-MM-DD HH:mm:ss'),
          showRelation: false,
          prodOrderId: item.prodOrderId,
          materialNo: item['materialNo'],
          totalSkillValue: item.totalSkillValue || 20,
          individualCapacity: item.individualCapacity,
          orderNo: item.orderNo,
          equipmentName: item.equipmentName,
          equipmentNo: item['equipmentNo'],
          neededPerson: item.neededPerson,
          totalDuration: item['totalDuration'],
          totalDurationAsString: ConvertUtil.longDuration2HHMMSSTime(item['totalDuration']),
          singleDuration: item.singleDuration,
          divided: item.divided,
          jobOrderOperationId: item.jobOrderOperationId,
          nextJobOrderOperationId: item.nextJobOrderOperationId,
          jobOrderOperationStatus: item.jobOrderOperationStatus,
          jobOrderOperationOrder: item.jobOrderOperationOrder,
          parentOperation: item.parentOperation,
          prodOrderErpFinishDate: item.prodOrderErpFinishDate == null ? null : moment(new Date(item.prodOrderErpFinishDate)).format('YYYY-MM-DD HH:mm:ss'),
          prodOrderFinishDate: item.prodOrderFinishDate,
          prodOrderScheduledStartDate: item.prodOrderScheduledStartDate,
          prodOrderScheduledFinishDate: item.prodOrderScheduledFinishDate,
          draggable: item.status !== JobOrderStatusEnum.PROCESSING,  // event in this status will not allowed to edit or delete
          alternativeWorkStationList: item.alternativeWorkStationList,
          plannedQuantity: item.plannedQuantity,
          producedQuantity: item.producedQuantity,
          erpRemainingQuantity: item.erpRemainingQuantity

        };







        // const res = resources.find(itm => itm.id === aEvent.resourceId);
        // if (res) {
        //   res.individualCapacity = aEvent.individualCapacity;
        // }
        if (!aEvent.draggable) {

          aEvent['eventColor'] = 'red';
        }
        if (item.jobOrderId <= 0) {
          aEvent['eventColor'] = 'red';
        }
        events.push(aEvent);

        me.addDateToDirty(item.startDate);
      });
    }
    if (this.maintenanceOperations && this.maintenanceOperations.length > 0) {
      this.maintenanceOperations.forEach((operation, i) => {
        if (operation.workstation) {
          const workstation = resources.find(re => re.id === operation.workstation.workStationId);
          if (!workstation) {
            me.workstations.push({ workStationId: operation.workstation.workStationId, workStationName: operation.workstation.workStationName });
            resources.push({
              id: operation.workstation.workStationId,
              workStationId: operation.workstation.workStationId,
              workStationNo: operation.workstation.workStationNo,
              workCenterId: operation.workstation.workCenterId,
              workCenterName: operation.workstation.workCenterTypeName + " - " + operation.workstation.workCenterName,
              workCenterTypeName: operation.workstation.workCenterTypeName,
              name: operation.workstation.workStationNo + ' | ' + operation.workstation.workStationName,
              startDate: operation.plannedStartDate === null ? null : moment(new Date(operation.plannedStartDate)).format('YYYY-MM-DD HH:mm:ss'),
              endDate: operation.plannedFinishDate === null ? null : moment(new Date(operation.plannedFinishDate)).format('YYYY-MM-DD HH:mm:ss'),
              // startDate: (this.searchBy==='searchbyerp')
              // ? moment(item.erpStartDate == null ? now : new Date(item.erpStartDate)).format('YYYY-MM-DD HH:mm:ss')
              // : moment(item.startDate == null ? now : new Date(item.startDate)).format('YYYY-MM-DD HH:mm:ss'),
              // endDate: (this.searchBy==='searchbyerp')
              // ? moment(item.erpFinishDate == null ? now : new Date(item.erpFinishDate)).format('YYYY-MM-DD HH:mm:ss')
              // : moment(item.endDate == null ? now : new Date(item.endDate)).format('YYYY-MM-DD HH:mm:ss'),
              jobCount: 0,
              allocation: 0,
              allocationErp: 0,
              individualCapacity: 0
            });
          }
          if (minDate === 0) {
            minDate = operation.plannedStartDate;
          }

          if (operation.plannedStartDate && minDate > operation.plannedStartDate) {
            minDate = operation.plannedStartDate;
          }
          if (operation.plannedFinishDate && maxDate < operation.plannedFinishDate) {
            maxDate = operation.plannedFinishDate;
          }
          const aEvent = {
            id: operation.maintenanceOrder.maintenanceId + 9999,
            maintenanceId: operation.maintenanceOrder.maintenanceId,
            resourceId: operation.workstation.workStationId,
            name: this.getOperationName(operation),
            maintenanceOperationId: operation.maintenanceOperationId,
            startDate: operation.plannedStartDate ? moment(new Date(operation.plannedStartDate)).format('YYYY-MM-DD HH:mm') : now,
            endDate: operation.plannedFinishDate ? moment(new Date(operation.plannedFinishDate)).format('YYYY-MM-DD HH:mm') : now,
            draggable: false
          };
          // aEvent['eventStyle'] = 'hollow';
          events.push(aEvent);
          me.addDateToDirty(operation.plannedStartDate);
        }
      });
    }
    // me.resources = [];
    // me.events = [];
    minDate = minDate === 0 ? now : minDate;
    maxDate = maxDate === 0 ? now : maxDate;
    const timerangearray = [];
    const datesArray = this.getDates(minDate, maxDate);
    datesArray.forEach((date, i) => {
      timerangearray.push({
        endDate: date + ' 08:00',
        id: i + 1,
        // cls: 'b-fa b-fa-bolt',
        name: 'There Is No Shift',
        startDate: date + ' 00:00',
        style: 'font-size: large;font-weight: 600;color: #3183fe;background: repeating-linear-gradient(-45deg, rgb(152 193 255), rgb(152 193 255) 8px, #1ac0e087 8px, rgb(0 0 0 / 0%) 16px);'
        // style: 'color: black;font-weight: 500;background:repeating-linear-gradient(45deg, rgba(155,155,155,0.5), rgba(155,155,155,0.5) 8px, transparent 8px, transparent 16px);'
      });
    });
    if (this.scheduler) {
      const features = this.scheduler.getSchedulerEngine().features;
      features.eventTooltip.doDestroy();
      features.scheduleTooltip.doDestroy();
    }
    setTimeout(() => {
      me.featuretimeRanges = {
        showCurrentTimeLine: true,
        showHeaderElements: false,
        'startDate': minDate,
        'endDate': maxDate
      };
      me.timeRanges = timerangearray;
      me.startDate = moment(minDate).format('YYYY-MM-DD HH:mm');
      me.endDate = moment(maxDate).format('YYYY-MM-DD HH:mm');
      // me.calendarDate = new Date(minDate);
      // this minCalenderData for resetting filter of scheduler date;
      me.startCalendarDate = new Date(minDate);
      me.endCalendarDate = new Date(maxDate);
      me.resources = resources;
      me.events = events;
      let allocations = 0;
      let individualCapacity = 0;
      me.resources.forEach(itm => {
        allocations = allocations + itm.allocation;
        individualCapacity = individualCapacity + itm.individualCapacity;
      });
      this.totalAllocationAverage = allocations / me.workstations.length;
      this.totalIndividualCapacity = individualCapacity;
    }, 50);

  }

  getDates(startDate, stopDate) {
    const dateArray = [];
    let currentDate = moment(startDate);
    stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format('YYYY-MM-DD'))
      currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
  }

  // find_duplicates(arr) {
  //   var len=arr.length,
  //       out=[],
  //       counts={};

  //   for (var i=0;i<len;i++) {
  //     var item = arr[i];
  //     counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
  //     if (counts[item] === 2) {
  //       out.push(item);
  //     }
  //   }

  //   return out;
  // }

  getJobName(item) {
    if (item.manualPlanned == true) { item.manualPlanned = "YES"; }
    if (item.manualPlanned == false) { item.manualPlanned = "NO"; }

    return '#r=' + ((item['prodOrderReferenceId']) ? item['prodOrderReferenceId'] : '')
      + ' - #m=' + item['materialNo']
      + ' - #jn=' + (item['orderNo'] ? this.convertToPointValue(item['orderNo'].toString()) : null)
      + ' - #o=' + item['operationName']
      + ' - #p=' + item['prodOrderId']
      + ' - #j=' + item['jobOrderId']
      + ' - #eq=' + item['equipmentNo']
      // + ' - #td=' + moment().startOf('day').seconds(item['totalDuration']).format('hh[h] mm[m]')
      + ' - #td=' + ConvertUtil.longDuration2DHHMMSSTime(item['totalDuration'])
      + ' - #ic=' + item['individualCapacity']
      + ' - #output=' + item['name']
      + ' - #man-pl=' + item['manualPlanned'];

  }

  getOperationName(operation) {
    return (operation['maintenanceOrder'] ? '#morder-id=' + operation['maintenanceOrder'].maintenanceId : '')
      + (operation['maintenanceOperationId'] ? ' - ' + '#moperation-id=' + operation['maintenanceOperationId'] : '')
      + (operation['equipmentOperation'] ? ' - ' + '#o=' + operation['equipmentOperation']?.operationDescription : '')
      + (operation['duration'] ? ' - ' + '#duration=' + ConvertUtil.longDuration2DHHMMSSTime(operation['duration']) : '')
  }

  convertToPointValue(str: string) {
    let pointedStr = '';
    if (str) {
      const splittedstr = str.split('');
      for (let i = 1; i <= splittedstr.length; i++) {
        if (i !== splittedstr.length) {
          pointedStr += splittedstr[i - 1] + '.';
        } else {
          pointedStr += splittedstr[i - 1];
        }
      }
    }
    return pointedStr;
  }

  onSchedulerEventSelected(event) {
    // selected event
    // selected event
    if (event && event.jobOrderId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, event.jobOrderId);
    } else if (event && event.maintenanceId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.MAINTENANCEORDER, event.maintenanceId);
    }
  }



  onCreateContextMenu(isScheduleJobOrders = false) {
    // if(isScheduleJobOrders) {
    this.eventContextMenu = {

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
      processItems({ eventRecord, items }) {
        items.deleteEvent = false;
        if (eventRecord.showRelation) {
          items.hideRelations = {
            text: 'Hide Relations',
            icon: 'b-fa b-fa-fw b-fa-tree',
            cls: 'b-separator',
            weight: 503,
            onItem({ eventRecord }) {
              JobOrderServiceStatic.hideRelations(eventRecord);
              eventRecord.showRelation = false;
            }
          }
        } else {
          items.showRelations = {
            text: 'Show Relations',
            icon: 'b-fa b-fa-fw b-fa-tree',
            cls: 'b-separator',
            weight: 503,
            onItem({ eventRecord }) {
              JobOrderServiceStatic.showRelations(eventRecord.prodOrderId);
              eventRecord.showRelation = true;
            }
          }
        }
        if (eventRecord.status != JobOrderStatusEnum.CANCELLED) {
          setProcessingStatus();

          setLongTermStatus();

          setPlannedStatus();


          setReadyStatus();

          items.cancelJobOrder = {
            text: 'Cancel Job Order',
            icon: 'b-fa b-fa-fw b-fa-ban',
            cls: 'b-separator',
            weight: 503,
            onItem({ eventRecord }) {
              JobOrderServiceStatic.cancelTask(eventRecord);
            }
          }
        }
        // Prevent menu for "locked" event
        return !eventRecord.locked;

        function setProcessingStatus() {
          if (eventRecord.status === JobOrderStatusEnum.PROCESSING) {
            // Remove "Edit" and "Delete" items for activities
            // items.splice(items.find(i => i.name === 'deleteEvent'), 1);
            // items.splice(items.find(i => i.name === 'editEvent'), 1);
            items.processingToPlanned = {
              text: 'Processing To Planned',
              icon: 'b-fa b-fa-fw b-fa-tasks',
              cls: 'b-separator',
              weight: 503,

              onItem({ eventRecord }) {
                // eventRecord.locked = false;
                eventRecord.draggable = true;
                JobOrderServiceStatic.jobOrderChangeStatus({ ...eventRecord.data, title: 'processing-to-planned' });
                eventRecord.status = JobOrderStatusEnum.PLANNED;
                setPlannedStatus();
                // eventRecord.status = JobOrderStatusEnum.PLANNED

              }
            };
            items.processingToComplete = {
              text: 'Processing To Completed',
              icon: 'b-fa b-fa-fw b-fa-list',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                // eventRecord.locked = false;
                eventRecord.draggable = true;
                JobOrderServiceStatic.jobOrderChangeStatus({ ...eventRecord.data, title: 'processing-to-completed' });
              }
            };

          }
        }

        function setReadyStatus() {
          if (eventRecord.status === JobOrderStatusEnum.READY || eventRecord.status === JobOrderStatusEnum.NOT_READY_YET_MATERIAL_MISSING ||
            eventRecord.status === JobOrderStatusEnum.NOT_READY_YET_WAITING_FOR_JOB || eventRecord.status === JobOrderStatusEnum.NOT_READY_YET_WAITING_FOR_JOB_AND_MATERIAL_MISSING
          ) {
            items.lock = {
              text: 'Lock Task',
              icon: 'b-fa b-fa-fw b-fa-lock',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                eventRecord.draggable = false;
                JobOrderServiceStatic.lock(eventRecord.jobOrderId);

                eventRecord.status = JobOrderStatusEnum.LONG_TERM_PROCESSING;
                setLongTermStatus();
              }
            };

            items.planManually = {
              text: 'Plan Manually',
              icon: 'b-fa b-fa-fw b-fa-tasks',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.planJobOrderManually({ ...eventRecord.data, title: 'plan-manually' });
                setPlannedStatus();
                eventRecord.status = JobOrderStatusEnum.PLANNED;
                eventRecord.draggable = true;
              }
            };

            items.changeToLongTermProcessing = {
              text: 'Change To Long Term Processing',
              icon: 'b-fa b-fa-fw b-fa-share',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                eventRecord.draggable = true;
                JobOrderServiceStatic.jobOrderChangeStatus({ ...eventRecord.data, title: 'change-to-long-term-processing' });
                eventRecord.status = JobOrderStatusEnum.LONG_TERM_PROCESSING;
                setLongTermStatus();
              }
            };

          }
        }

        function setLongTermStatus() {

          if (eventRecord.status === JobOrderStatusEnum.LONG_TERM_PROCESSING) {
            items.changeToLongTermProcessing = {
              text: 'Update Long Term Processing',
              icon: 'b-fa b-fa-fw b-fa-share',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                // eventRecord.locked = false;
                eventRecord.draggable = true;
                // eventRecord.status = JobOrderStatusEnum.PROCESSING;
                JobOrderServiceStatic.jobOrderChangeStatus({ ...eventRecord.data, title: 'update-long-term-processing' });
                setLongTermStatus();
              }

            };
            items.divideTast = {
              text: 'Divide Task',
              icon: 'b-fa b-fa-fw b-fa-divide',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.divideTask(eventRecord.jobOrderId);
                // eventRecord.locked = true;
                // eventRecord.draggable = false;
                // eventRecord.status = JobOrderStatusEnum.PROCESSING;
                // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
              }
            };
            items.cloneTast = {
              text: 'Clone Task',
              icon: 'b-fa b-fa-fw b-fa-clone',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.cloneTask(eventRecord);
                // eventRecord.locked = true;
                // eventRecord.draggable = false;
                // eventRecord.status = JobOrderStatusEnum.PROCESSING;
                // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
              }
            };

            items.changeToReady = {
              text: 'Change To Ready',
              icon: 'b-fa b-fa-fw b-fa-list',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.changeToReady(eventRecord);
                eventRecord.status = JobOrderStatusEnum.READY;

                setReadyStatus();
              }
            };

            items.unlockTask = {
              text: 'Unlock Task',
              icon: 'b-fa b-fa-fw b-fa-list',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                eventRecord.draggable = true;
                JobOrderServiceStatic.unlock(eventRecord.jobOrderId);
                eventRecord.status = JobOrderStatusEnum.PLANNED;
                setPlannedStatus();
              }
            };

          }
        }

        function setPlannedStatus() {
          if (eventRecord.status === JobOrderStatusEnum.PLANNED) {
            items.lock = {
              text: 'Lock Task',
              icon: 'b-fa b-fa-fw b-fa-lock',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                eventRecord.draggable = false;
                JobOrderServiceStatic.lock(eventRecord.jobOrderId);
                eventRecord.status = JobOrderStatusEnum.LONG_TERM_PROCESSING;
                setLongTermStatus();
              }
            };
            items.divideTast = {
              text: 'Divide Task',
              icon: 'b-fa b-fa-fw b-fa-divide',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.divideTask(eventRecord.jobOrderId);
              }
            };
            items.cloneTast = {
              text: 'Clone Task',
              icon: 'b-fa b-fa-fw b-fa-clone',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.cloneTask(eventRecord);
              }
            };
            items.changeToLongTermProcessing = {
              text: 'Change To Long Term Processing',
              icon: 'b-fa b-fa-fw b-fa-share',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                eventRecord.draggable = true;
                JobOrderServiceStatic.jobOrderChangeStatus({ ...eventRecord.data, title: 'change-to-long-term-processing' });
                eventRecord.status = JobOrderStatusEnum.LONG_TERM_PROCESSING;
                setLongTermStatus();
              }
            };

            items.updatePlannedTask = {
              text: 'Update Planned Task',
              icon: 'b-fa b-fa-fw b-fa-edit',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                eventRecord.draggable = true;
                JobOrderServiceStatic.jobOrderChangeStatus({ ...eventRecord.data, title: 'update-planned-task' });
              }
            };

            items.changeToReady = {
              text: 'Change To Ready',
              icon: 'b-fa b-fa-fw b-fa-list',
              cls: 'b-separator',
              weight: 503,
              onItem({ eventRecord }) {
                JobOrderServiceStatic.changeToReady(eventRecord);
                eventRecord.status = JobOrderStatusEnum.READY;

                setReadyStatus();

              }
            };

          }
        }
      }
    };
    // } else {
    //   this.eventContextMenu= {

    //     // Add extra items shown for each event
    //     // extraItems: [
    //     //   {
    //     //     text: 'Move left',
    //     //     icon: 'b-fa b-fa-fw b-fa-arrow-left',
    //     //     cls: 'b-separator',
    //     //     onItem({eventRecord}) {
    //     //       eventRecord.startDate = DateHelper.add(eventRecord.startDate, -1, 'hour');
    //     //     }
    //     //   },
    //     //   {
    //     //     text: 'Move right',
    //     //     icon: 'b-fa b-fa-fw b-fa-arrow-right',
    //     //     onItem({eventRecord}) {
    //     //       eventRecord.startDate = DateHelper.add(eventRecord.startDate, 1, 'hour');
    //     //     }
    //     //   }
    //     // ],
    // // Process items before context menu is shown, add or remove or prevent it
    //     processItems({eventRecord, items}) {
    //       items.deleteEvent = false;
    //       // if(eventRecord.showRelation) {
    //       //   items.hideRelations = {
    //       //     text   : 'Hide Relations',
    //       //     icon   : 'b-fa b-fa-fw b-fa-tree',
    //       //     cls    : 'b-separator',
    //       //     weight : 503,
    //       //     onItem({ eventRecord }) {
    //       //       JobOrderServiceStatic.hideRelations(eventRecord);
    //       //       eventRecord.showRelation = false;
    //       //     }
    //       //   }
    //       // } else {
    //       //   items.showRelations = {
    //       //     text   : 'Show Relations',
    //       //     icon   : 'b-fa b-fa-fw b-fa-tree',
    //       //     cls    : 'b-separator',
    //       //     weight : 503,
    //       //     onItem({ eventRecord }) {
    //       //       JobOrderServiceStatic.showRelations(eventRecord.prodOrderId);
    //       //       eventRecord.showRelation = true;
    //       //     }
    //       //   }


    //       // }
    //       if (eventRecord.status === JobOrderStatusEnum.PROCESSING) {
    //         // Remove "Edit" and "Delete" items for activities
    //         // items.splice(items.find(i => i.name === 'deleteEvent'), 1);
    //         // items.splice(items.find(i => i.name === 'editEvent'), 1);
    //         // items.unlock = {
    //         //   text   : 'UnLock Task',
    //         //   icon   : 'b-fa b-fa-fw b-fa-unlock',
    //         //   cls    : 'b-separator',
    //         //   weight : 503,
    //         //   onItem({ eventRecord }) {
    //         //       // eventRecord.locked = false;
    //         //       eventRecord.draggable = true;
    //         //       eventRecord.status = JobOrderStatusEnum.PLANNED;
    //         //       JobOrderServiceStatic.unlock(eventRecord.jobOrderId);
    //         //   }
    //         // }
    //         items.changeToLongTermProcessing = {
    //           text   : 'Change To Long Term Processing',
    //           icon   : 'b-fa b-fa-fw b-fa-share',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'change-to-long-term-processing'});
    //           }
    //         }
    //         items.processingToPlanned = {
    //           text   : 'Processing To Planned',
    //           icon   : 'b-fa b-fa-fw b-fa-tasks',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.PLANNED;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
    //           }
    //         }
    //         items.processingToComplete = {
    //           text   : 'Processing To Completed',
    //           icon   : 'b-fa b-fa-fw b-fa-list',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.COMPLETED;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-completed'});
    //           }
    //         }

    //       } else if(eventRecord.status === JobOrderStatusEnum.LONG_TERM_PROCESSING) {
    //         items.changeToLongTermProcessing = {
    //           text   : 'Update Long Term Processing',
    //           icon   : 'b-fa b-fa-fw b-fa-share',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'update-long-term-processing'});
    //           }
    //         }
    //         items.divideTast = {
    //           text   : 'Divide Task',
    //           icon   : 'b-fa b-fa-fw b-fa-divide',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //             JobOrderServiceStatic.divideTask(eventRecord.jobOrderId);
    //               // eventRecord.locked = true;
    //               // eventRecord.draggable = false;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.cloneTast = {
    //           text   : 'Clone Task',
    //           icon   : 'b-fa b-fa-fw b-fa-clone',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //             JobOrderServiceStatic.cloneTask(eventRecord);
    //               // eventRecord.locked = true;
    //               // eventRecord.draggable = false;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.processingToPlanned = {
    //           text   : 'Processing To Planned',
    //           icon   : 'b-fa b-fa-fw b-fa-tasks',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.PLANNED;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
    //           }
    //         }
    //         items.processingToComplete = {
    //           text   : 'Processing To Completed',
    //           icon   : 'b-fa b-fa-fw b-fa-list',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.COMPLETED;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-completed'});
    //           }
    //         }
    //       } else if(eventRecord.status === JobOrderStatusEnum.PLANNED) {
    //         items.lock = {
    //           text   : 'Lock Task',
    //           icon   : 'b-fa b-fa-fw b-fa-lock',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = true;
    //               eventRecord.draggable = false;
    //               eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.divideTast = {
    //           text   : 'Divide Task',
    //           icon   : 'b-fa b-fa-fw b-fa-divide',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //             JobOrderServiceStatic.divideTask(eventRecord.jobOrderId);
    //               // eventRecord.locked = true;
    //               // eventRecord.draggable = false;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.cloneTast = {
    //           text   : 'Clone Task',
    //           icon   : 'b-fa b-fa-fw b-fa-clone',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //             JobOrderServiceStatic.cloneTask(eventRecord);
    //               // eventRecord.locked = true;
    //               // eventRecord.draggable = false;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.changeToLongTermProcessing = {
    //           text   : 'Change To Long Term Processing',
    //           icon   : 'b-fa b-fa-fw b-fa-share',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'change-to-long-term-processing'});
    //           }
    //         }

    //         items.updatePlannedTask = {
    //           text   : 'Update Planned Task',
    //           icon   : 'b-fa b-fa-fw b-fa-edit',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = false;
    //               eventRecord.draggable = true;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'update-planned-task'});
    //           }
    //         }
    //       } else {
    //         items.lock = {
    //           text   : 'Lock Task',
    //           icon   : 'b-fa b-fa-fw b-fa-lock',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //               // eventRecord.locked = true;
    //               eventRecord.draggable = false;
    //               eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.divideTast = {
    //           text   : 'Divide Task',
    //           icon   : 'b-fa b-fa-fw b-fa-divide',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //             JobOrderServiceStatic.divideTask(eventRecord.jobOrderId);
    //               // eventRecord.locked = true;
    //               // eventRecord.draggable = false;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }
    //         items.cloneTast = {
    //           text   : 'Clone Task',
    //           icon   : 'b-fa b-fa-fw b-fa-clone',
    //           cls    : 'b-separator',
    //           weight : 503,
    //           onItem({ eventRecord }) {
    //             JobOrderServiceStatic.cloneTask(eventRecord);
    //               // eventRecord.locked = true;
    //               // eventRecord.draggable = false;
    //               // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //               // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //           }
    //         }


    //       }


    //       items.cancelJobOrder = {
    //         text   : 'Cancel Job Order',
    //         icon   : 'b-fa b-fa-fw b-fa-ban',
    //         cls    : 'b-separator',
    //         weight : 503,
    //         onItem({ eventRecord }) {
    //           JobOrderServiceStatic.cancelTask(eventRecord.jobOrderId);
    //             // eventRecord.locked = true;
    //             // eventRecord.draggable = false;
    //             // eventRecord.status = JobOrderStatusEnum.PROCESSING;
    //             // JobOrderServiceStatic.lock(eventRecord.jobOrderId);
    //         }
    //       }

    //       // Prevent menu for "locked" event
    //       return !eventRecord.locked;
    //     }
    //   };
    // }
  }

  moveToJoinTop() {
    this.dJoin.moveOnTop();
  }

  selectDivideJobs() {

    this.params.dialog.jobList = [];
    for (let i = 1; i <= this.params.dialog.numberOfJobs; i++) {
      this.params.dialog.jobList.push({ name: i, value: 0 });
    }
  }
  divideJobs(type) {
    this.params.dialog.error = '';
    let total = 0;
    const quantityList = [];

    if (type === 'manual') {

      for (const item of this.params.dialog.jobList) {
        total = total + item.value;
        quantityList.push(item.value);
      }
      if (total === this.selectedReadyJobOrders[0].quantity) {
        const data = { jobOrderId: this.selectedReadyJobOrders[0].jobOrderId, quantityList: quantityList };
        this.loaderService.showLoader();
        this._jbOrderSvc.divideJobOrder(data)
          .then(() => {
            this.utilities.showSuccessToast('success-divided');
            this.panel.visible = false;
            this.loaderService.hideLoader();
            this.selectedReadyJobOrders = [];
            // this.getData(this.filterSchedule);
            // this.reset();
            // this.initialize();
          })
          .catch(error => {
            this.utilities.showErrorToast(error);
            this.loaderService.hideLoader();
          });
      } else {
        this.params.dialog.error = this._translateSvc.instant('quantity-not-equal');
      }

    } else if (type === 'auto') {
      for (let i = 0; i < this.params.dialog.numberOfJobs - 1; i++) {
        total = total + Math.round(this.selectedReadyJobOrders[0].quantity / this.params.dialog.numberOfJobs);
        quantityList.push(Math.round(this.selectedReadyJobOrders[0].quantity / this.params.dialog.numberOfJobs));
      }
      quantityList[quantityList.length] = this.selectedReadyJobOrders[0].quantity - total;
      const data = { jobOrderId: this.selectedReadyJobOrders[0].jobOrderId, quantityList: quantityList };
      this.loaderService.showLoader();
      this._jbOrderSvc.divideJobOrder(data)
        .then(() => {
          this.utilities.showSuccessToast('success-divided');
          this.panel.visible = false;
          this.loaderService.hideLoader();
          this.selectedReadyJobOrders = [];
          // this.getData(this.filterSchedule);
          // this.reset();
          // this.initialize();
        })
        .catch(error => {
          this.utilities.showErrorToast(error);
          this.loaderService.hideLoader();
        });
    }
  }

  cloneOperation() {
    this.params.dialog.error = '';
    this.loaderService.showLoader();
    const temp = {
      "cloneNumber": this.params.dialog.numberOfJobs,
      "jobOrderOperationId": this.clonedEvent.jobOrderOperationId
    }
    this._jbOrderSvc.cloneJobOrderOperation(temp)
      .then(() => {
        this.utilities.showSuccessToast('success-cloned');
        this.panel.visible = false;
        this.loaderService.hideLoader();
        // this.getData(this.filterSchedule);
      })
      .catch(error => {
        this.utilities.showErrorToast(error);
        this.loaderService.hideLoader();
      });
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
  //
  //         const diff = Math.abs(start - end);
  //
  //
  //         const st = new Date(firstEvent.endDate);
  //         const en = DateHelper.add(secondEvent.endDate, diff, 'ms');
  //
  //         this.shiftDateByCaringWeekend(secondEvent, st, en);
  //       }
  //     }
  //   }
  // }

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

    // delete empty tasks
    if (event.jobOrderId === 0) {
      this.scheduler.removeEvent(event.id);
      this.myModal.hide();
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('delete-success');
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

    this.jobOrderDragged(aEvent);
    // this.moveToCorrectPlaceDroppedEvent(aEvent);

    const me = this;
    scheduler.eventStore.forEachScheduledEvent
      (
        function (event, startD, endD) {
          me.reArrangeResourceStartAndEndDate(event);
        }, this
      );
  }

  OnDivideHide() {
    this.panel.numberOfJobs = null;
    this.panel.title = null;
    this.panel.visible = false;
    this.panel.data = null;
    this.params.dialog.jobList = [];
    this.params.dialog.error = null;
    this.params.dialog.numberOfJobs = null;
    this.params.dialog.title = null;
  }

  showAllcationByShiftGraph(aEvent, type = null) {
    // console.log('@data', aEvent)

    let filter = {
      "startTime": null,
      "endTime": null,
      "orderByDirection": 'desc',
      "orderByProperty": 'workstationId',
      "pageNumber": 1,
      "pageSize": 9999999,
      "plantId": this.selectedPlant.plantId,
      "query": null,
      "workcenterId": null,//aEvent.workCenterId,
      "workstationId": null
    }

    if (this.filterSchedule.startDate) {
      filter.startTime = ConvertUtil.date2StartOfDay(this.filterSchedule.startDate);
      filter.startTime = ConvertUtil.localDateShiftAsUTC(filter.startTime);
    } if (this.filterSchedule.finishDate) {
      filter.endTime = ConvertUtil.date2EndOfDay(this.filterSchedule.finishDate);
      // filter.endTime = ConvertUtil.localDateShiftAsUTC(filter.endTime);
    }

    if (type == 'workstation') {
      this.allocationParams.dialog.title = 'allocation-by-shift';
    } else {
      this.allocationParams.dialog.title = 'allocation-by-shift-workstation';
      // filter.startTime = new Date(aEvent.data.startDate);
      // filter.endTime = new Date(aEvent.data.endDate);
      filter.workcenterId = aEvent.data.workCenterId;
      filter.workstationId = aEvent.data.workStationId;
    }

    this.loaderService.showLoader();
    this.allocationModal.show();

    if (!this.loadingshowAllcationByShift) {
      this.loadingshowAllcationByShift = true;
      this._scheduleReportSvc.getWorkstationActualCapacityShiftReport(filter).then(res => {
        this.loaderService.hideLoader();
        this.loadingshowAllcationByShift = false;
        if (res['content'] && res['content'].length > 0) {
          this.allocationSelection = 'Allocation';
          this.shiftData = res['content'].sort((a, b) => a.shiftStartDate - b.shiftStartDate);
          this.onSelectAllocation(this.allocationSelection);
          // const diff:any = new Date(data[data.length-1].shiftEndDate - data[0].shifStartDate);
          // console.log('@diff', diff)
          // const days:any = diff/1000/60/60/24;
          // console.log('@days', days)
          // if(days <=7){
          //     for(var i=0; i<7; i++){
          //       labels.push(moment(data.startDate).add(i, 'days').format('DD-MM-YYYY'))
          //     }
          //     console.log('@labels', labels);
          // };
        }
      }).catch(error => {
        this.loadingshowAllcationByShift = false;
        this.loaderService.hideLoader();
      });
    }
    this.initializeWorkStationChart();
  }

  onSelectWorkcenter(event) {
    this.selectedWorkCenter = event;
    this.initializeWorkStationChart();
  }
  onSelectWorkStation(event) {
    this.selectedWorkStation = event;
    this.initializeWorkStationChart();
  }

  initializeWorkStationChart() {
    let labels = [];
    let allocations = [];
    let allocationsErp = [];
    let datasets = [];

    if (this.selectedWorkCenter) {
      if (this.selectedWorkStation) {
        labels = this.resources.filter(rs => rs.workCenterId === this.selectedWorkCenter.workCenterId && rs.workStationId === this.selectedWorkStation.workStationId).map(res => res.name);
        allocations = this.resources.filter(rs => rs.workCenterId === this.selectedWorkCenter.workCenterId && rs.workStationId === this.selectedWorkStation.workStationId).map(res => res.allocation);
        allocationsErp = this.resources.filter(rs => rs.workCenterId === this.selectedWorkCenter.workCenterId && rs.workStationId === this.selectedWorkStation.workStationId).map(res => res.allocationErp);
      } else {
        labels = this.resources.filter(rs => rs.workCenterId === this.selectedWorkCenter.workCenterId).map(res => res.name);
        allocations = this.resources.filter(rs => rs.workCenterId === this.selectedWorkCenter.workCenterId).map(res => res.allocation);
        allocationsErp = this.resources.filter(rs => rs.workCenterId === this.selectedWorkCenter.workCenterId).map(res => res.allocationErp);
      }
    } else if (this.selectedWorkStation) {
      labels = this.resources.filter(rs => rs.workStationId === this.selectedWorkStation.workStationId).map(res => res.name);
      allocations = this.resources.filter(rs => rs.workStationId === this.selectedWorkStation.workStationId).map(res => res.allocation);
      allocationsErp = this.resources.filter(rs => rs.workStationId === this.selectedWorkStation.workStationId).map(res => res.allocationErp);
    } else {
      labels = this.resources.map(res => res.name);
      allocations = this.resources.map(res => res.allocation);
      allocationsErp = this.resources.map(res => res.allocationErp);
    }

    if (this.allocationSelection === 'ErpAllocation') {
      datasets.push({
        yAxisID: 'y-axis-1',
        label: 'Allocation Erp',
        fill: true, // for bar just comment here
        backgroundColor: '#3560f0',
        borderColor: '#3560f0',
        borderWidth: 1,
        data: allocationsErp,
        type: 'bar',
      });
    } else if (this.allocationSelection === 'Mixed') {
      datasets.push({
        yAxisID: 'y-axis-1',
        label: 'Allocation',
        fill: true, // for bar just comment here
        backgroundColor: '#3560f0',
        borderColor: '#3560f0',
        borderWidth: 1,
        data: allocations,
        type: 'bar',
      });
      datasets.push({
        yAxisID: 'y-axis-1',
        label: 'Allocation Erp',
        fill: true, // for bar just comment here
        backgroundColor: '#778899',
        borderColor: '#778899',
        borderWidth: 1,
        data: allocationsErp,
        type: 'bar',
      });
    } else {
      datasets.push({
        yAxisID: 'y-axis-1',
        label: 'Allocation',
        fill: true, // for bar just comment here
        backgroundColor: '#3560f0',
        borderColor: '#3560f0',
        borderWidth: 1,
        data: allocations,
        type: 'bar',
      });
    }


    this.barWorkstationData = {
      labels: labels,
      datasets: datasets
    }
  }

  // onSelectErpAllocation(event) {
  //   let labels = [];
  //   let datasets = [];
  //   if(this.shiftData && this.shiftData.length > 0){
  //     const data = this.shiftData.filter(itm => itm.erp === true);
  //     let dates:any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];
  //     let finalData = [];
  //     for (var i = 0; i < dates.length; i++) {
  //       labels.push(moment(dates[i].shiftStartDate).format('DD-MM-YYYY'));
  //       let dateShifts = data.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
  //       finalData.push(dateShifts);
  //     }
  //     for (var i = 0; i < finalData.length; i++) {
  //       let dataset = [];
  //       let datasetItems = [];
  //       finalData[i].forEach((item, index) => {
  //         datasetItems.push(item[index])
  //         dataset.push(item[index] ? item[index].plannedCapacity * 100 : 0);
  //       })
  //       datasets.push(this.getDataSetItem('#4188f5', datasetItems, dataset));
  //     }
  //   } else {
  //     for (var i = 0; i < 7; i++) {
  //       labels.push(moment(this.filterSchedule.startDate).add(i, 'days').format('DD-MM-YYYY'));
  //     }
  //   }
  //   this.barData = {
  //     labels: labels,
  //     datasets: datasets
  //   }
  // }

  onSelectErpAllocation(event) {

    this.loaderService.showLoader();

    setTimeout(() => {
      let labels = [];
      let datasets = [];
      if (this.shiftData && this.shiftData.length > 0) {
        const data = this.shiftData.filter(itm => itm.erp === true);
        let dates: any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];
        let shifts: any = [...new Map(data.map(item => [item.shiftId, item])).values()];
        shifts.forEach((shift, index) => {
          let dataset = [];
          let datasetItems = [];
          for (var i = 0; i < dates.length; i++) {
            if (index === 0) {
              labels.push(moment(dates[i].shiftStartDate).format('DD-MM-YYYY'));
            }
            let dateShifts = data.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
            let shiftData = dateShifts.filter(item => item.shiftId == shift.shiftId);
            if (shiftData) {
              datasetItems.push(shiftData[0]);
              dataset.push(shiftData[0] ? shiftData[0].plannedCapacity * 100 : 0);
            } else {
              dataset.push(0);
              datasetItems.push(null);
            }
          }
          datasets.push(this.getDataSetItem(this.getRandomColor(), datasetItems, dataset));
        });
      } else {
        for (var i = 0; i < 7; i++) {
          labels.push(moment(this.filterSchedule.startDate).add(i, 'days').format('DD-MM-YYYY'));
        }
      }
      this.barData = {
        labels: labels,
        datasets: datasets
      }

      this.initializeWorkStationChart();

      this.loaderService.hideLoader();
    }, 10);



  }
  onSelectAllocation(event) {

    this.loaderService.showLoader();
    setTimeout(() => {

      let labels = [];
      let datasets = [];
      if (this.shiftData && this.shiftData.length > 0) {
        const data = this.shiftData.filter(itm => itm.erp === false);
        let dates: any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];
        let shifts: any = [...new Map(data.map(item => [item.shiftId, item])).values()];
        shifts.forEach((shift, index) => {
          let dataset = [];
          let datasetItems = [];
          for (var i = 0; i < dates.length; i++) {
            if (index === 0) {
              labels.push(moment(dates[i].shiftStartDate).format('DD-MM-YYYY'));
            }
            let dateShifts = data.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
            let shiftData = dateShifts.filter(item => item.shiftId == shift.shiftId);
            if (shiftData) {
              datasetItems.push(shiftData[0]);
              dataset.push(shiftData[0] ? shiftData[0].plannedCapacity * 100 : 0);
            } else {
              dataset.push(0);
              datasetItems.push(null);
            }
          }
          datasets.push(this.getDataSetItem(this.getRandomColor(), shift.shiftName, dataset));
        });
      } else {
        for (var i = 0; i < 7; i++) {
          labels.push(moment(this.filterSchedule.startDate).add(i, 'days').format('DD-MM-YYYY'));
        }
      }
      this.barData = {
        labels: labels,
        datasets: datasets
      }
      this.initializeWorkStationChart();
      this.loaderService.hideLoader();
    }, 10)
  }
  onSelectMixed2(event) {
    this.loaderService.showLoader();
    setTimeout(() => {
      let labels = [];
      let datasets = [];
      if (this.shiftData && this.shiftData.length > 0) {
        const data = this.shiftData.filter(itm => itm.erp === false);
        const dataErp = this.shiftData.filter(itm => itm.erp === true);
        let dates: any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];
        // let shifts:any = [...new Map(data.map(item => [item.shiftId, item])).values()];

        let dataset = [];
        let datasetItems = [];
        for (var i = 0; i < dates.length; i++) {
          let dateShifts = data.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
          if (dateShifts && dateShifts.length > 0) {
            dateShifts.forEach(shiftData => {
              labels.push(moment(dates[i].shiftStartDate).format('DD-MM-YYYY') + "-" + shiftData.shiftName);
              datasetItems.push(shiftData);
              dataset.push(shiftData ? shiftData.plannedCapacity * 100 : null);
            });
          } else {
            dataset.push(null);
            datasetItems.push(null);
          }
        }
        datasets.push(this.getDataSetItem('lightslategrey', datasetItems, dataset, 'line'));

        let dataseterp = [];
        let datasetItemserp = [];
        for (var i = 0; i < dates.length; i++) {
          let dateShifts = dataErp.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
          if (dateShifts && dateShifts.length > 0) {
            dateShifts.forEach(shiftData => {
              datasetItemserp.push(shiftData);
              dataseterp.push(shiftData ? shiftData.plannedCapacity * 100 : null);
            });
          } else {
            dataseterp.push(null);
            datasetItemserp.push(null);
          }
        }
        datasets.push(this.getDataSetItem('lightblue', datasetItemserp, dataseterp, 'line'));

      } else {
        for (var i = 0; i < 7; i++) {
          labels.push(moment(this.filterSchedule.startDate).add(i, 'days').format('DD-MM-YYYY'));
        }
      }
      this.barData = {
        labels: labels,
        datasets: datasets
      };
      this.initializeWorkStationChart();
      this.loaderService.hideLoader();
    }, 10)
  }

  onSelectMixed(event) {
    let labels = [];
    let datasets = [];
    if (this.shiftData && this.shiftData.length > 0) {
      const dataErp = this.shiftData.filter(itm => itm.erp === true);
      const data = this.shiftData.filter(itm => itm.erp === false);
      let dates: any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];
      let finalData = [];
      for (var i = 0; i < dates.length; i++) {
        labels.push(moment(dates[i].shiftStartDate).format('DD-MM-YYYY'));
        let dateShifts = data.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
        let dateShiftsErp = dataErp.filter(item => moment(item.shiftStartDate).format('DD-MM-YY') == moment(dates[i].shiftStartDate).format('DD-MM-YY'))
        finalData.push([...dateShifts, ...dateShiftsErp]);
        // finalData.push(dateShiftsErp);
      }
      for (var i = 0; i < finalData.length; i++) {
        let dataset = [];
        let datasetItems = [];
        finalData.forEach((item, index) => {
          datasetItems.push(item[i])
          dataset.push(item[i] ? item[i].plannedCapacity * 100 : 0);
        })
        datasets.push(this.getDataSetItem(this.getRandomColor(), datasetItems, dataset, 'line'));
      }
    } else {
      for (var i = 0; i < 7; i++) {
        labels.push(moment(this.filterSchedule.startDate).add(i, 'days').format('DD-MM-YYYY'));
      }
    }
    this.barData = {
      labels: labels,
      datasets: datasets
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private getDataSetItem(hexColor, label, data, type = 'bar', axisId = 'y-axis-1') {

    return {
      yAxisID: axisId,
      label: label,
      fill: (type == 'line') ? false : true, // for bar just comment here
      backgroundColor: hexColor,
      borderColor: hexColor,
      borderWidth: 1,
      data: data,
      type: type,
    }
  }
  onSchedulerEventUpdated(aEvent) {
    const scheduler = this.scheduler.getSchedulerEngine();

    // update other job order operations on different workstations for same job order
    scheduler.eventStore.forEachScheduledEvent(
      function (event, startD, endD) {
        if (event.data.resourceId !== aEvent.data.resourceId && event.data.jobOrderId === aEvent.data.jobOrderId
          && event.data.jobOrderOperationId !== aEvent.data.jobOrderOperationId) {
          event.data.startDate = aEvent.data.startDate;
          event.data.endDate = aEvent.data.endDate;
        }
      }, this
    );

    // this.moveToCorrectPlaceDroppedEvent(aEvent);

    const me = this;
    scheduler.eventStore.forEachScheduledEvent
      (
        function (event, startD, endD) {
          me.reArrangeResourceStartAndEndDate(event);

        }, this
      );
  }


  private reArrangeResourceStartAndEndDate(aEvent) {
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

  private orderEventArray(array) {
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
    if (!this.selectedPlant) {
      this.utilities.showErrorToast('Plant is not selected!!');
      return;
    }

    this.requestScheduleJobOrdersDto.plantId = this.selectedPlant.plantId;

    const date = new Date();

    this.loaderService.showLoader("Save Changes is running...");
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
              setupFinishDate: event.setupFinishDate == null ? null : new Date(event.setupFinishDate),
              status: event.status,
              totalDuration: event.totalDuration,
              divided: event.divided,
              singleDuration: event.singleDuration,
              individualCapacity: event.individualCapacity,
              jobOrderOperationId: event.jobOrderOperationId,
              jobOrderOperationStatus: event.jobOrderOperationStatus,
              jobOrderOperationOrder: event.jobOrderOperationOrder,
              parentOperation: event.parentOperation,
              operationTaskCode: event.operationTaskCode,
              prodOrderReferenceId: event.prodOrderReferenceId,
              prodOrderId: event.prodOrderId,
              prodOrderScheduledStartDate: event.prodOrderScheduledStartDate,
              prodOrderScheduledFinishDate: event.prodOrderScheduledFinishDate
            });

            // console.log(event.data);
          }

        }, this
      );
    const requestProductionScheduleSaveDto = {
      requestJobOrderScheduleDtoList: events,
      requestScheduleJobOrdersDto: this.requestScheduleJobOrdersDto,
      requestWorkStationDtoList: this.resources
    }
    this._jbOrderSvc.updateJobOrderAutoScheduler(requestProductionScheduleSaveDto).then(res => {
      // this.releaseReservationAndReSchedule();
      this.loaderService.hideLoader();
      this.requestScheduleJobOrdersDto.lastScheduleDate = new Date();
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });


  }

  releaseReservationAndReSchedule() {
    this.loaderService.showLoader();
    this._jbOrderSvc.releaseReservationAndReSchedule(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }

  recheckJobOrderForUnrestrictedQuantities() {
    this.loaderService.showLoader();
    this._jbOrderSvc.recheckJobOrderStockHasUnReristrictedQuantity(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }

  createSemiFinishedProductionOrders() {
    this.loaderService.showLoader();
    this._jbOrderSvc.createSemiFinishProdOrders(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }
  deliverManualPurchaseOrder() {
    this.loaderService.showLoader();
    this._jbOrderSvc.deliverManualPurchaseOrder(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }
  releasePalletReservation() {
    this.loaderService.showLoader();
    this._jbOrderSvc.releasePalletReservation(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }
  divideJobOrderOperation(): void {
    this.loaderService.showLoader();
    this._jbOrderSvc.divideJobOrderOperation(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }
  checkStockReservation(): void {
    this.loaderService.showLoader();
    this._jbOrderSvc.checkStockReservation(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }


  combineJobOrders(): void {
    this.loaderService.showLoader();
    this._prodOrderSrvc.combineJobOrders(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }



  combineJobOrderOperations(): void {
    this.loaderService.showLoader();
    this._prodOrderSrvc.combineJobOrderOperations(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }






  warehouseShiftReport() {
    // this.loaderService.showLoader();
    // this._jbOrderSvc.deliverManualPurchaseOrder(this.filterSchedule.plantId).then(res => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showSuccessToast('saved-success');
    // }).catch(err => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showErrorToast(err);
    // });
  }
  warehousePOJOShiftReport() {
    // this.loaderService.showLoader();
    // this._jbOrderSvc.warehousePOJOShiftReport(this.filterSchedule.plantId).then(res => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showSuccessToast('saved-success');
    // }).catch(err => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showErrorToast(err);
    // });
  }
  warehousePurchaseShiftReport() {
    this.loaderService.showLoader();
    this._jbOrderSvc.shiftBaseStockReportPurchase(this.filterSchedule.plantId).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }

  saveShiftCapacity() {
    if (!this.selectedPlant) {
      this.utilities.showErrorToast('Plant is not selected!!');
      return;
    }
    this.requestScheduleJobOrdersDto.plantId = this.selectedPlant.plantId;
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
              setupFinishDate: event.setupFinishDate == null ? null : new Date(event.setupFinishDate),
              status: event.status,
              totalDuration: event.totalDuration,
              divided: event.divided,
              singleDuration: event.singleDuration,
              individualCapacity: event.individualCapacity,
              jobOrderOperationId: event.jobOrderOperationId,
              jobOrderOperationStatus: event.jobOrderOperationStatus,
              jobOrderOperationOrder: event.jobOrderOperationOrder,
              parentOperation: event.parentOperation,
              operationTaskCode: event.operationTaskCode,
              prodOrderReferenceId: event.prodOrderReferenceId,
              prodOrderId: event.prodOrderId,
              prodOrderScheduledStartDate: event.prodOrderScheduledStartDate,
              prodOrderScheduledFinishDate: event.prodOrderScheduledFinishDate
            });

            // console.log(event.data);
          }

        }, this
      );
    const requestProductionScheduleSaveDto = {
      requestJobOrderScheduleDtoList: events,
      requestScheduleJobOrdersDto: this.requestScheduleJobOrdersDto,
      requestWorkStationDtoList: this.resources
    }
    this._jbOrderSvc.saveShiftCapacity(requestProductionScheduleSaveDto).then(res => {
      // this.releaseReservationAndReSchedule();
      this.loaderService.hideLoader();
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

  scheduleJobOrders() {
    this.onCreateContextMenu(true);
    if (!this.selectedPlant) {
      this.utilities.showErrorToast('Plant is not selected!!');
      return;
    }

    if (!this.stopCauseList) {
      this.getStopCauseList();
    }

    this.requestScheduleJobOrdersDto.plantId = this.selectedPlant.plantId;
    // this.requestScheduleJobOrdersDto.finishDate = ConvertUtil.date2EndOfDay(this.requestScheduleJobOrdersDto.finishDate);

    const me = this;
    this.loaderService.showLoader("Schedule job order is running...");
    this.showLoader = true;
    this._jbOrderSvc.scheduleJobOrders(this.requestScheduleJobOrdersDto).then(res => {
      me.responseWorkCenterByWorkStationAndJobOrderDto = res;
      me.filterAndCreateEvents();
      me.loaderService.hideLoader();
      me.showLoader = false;
      me.utilities.showSuccessToast('success');

      /// this is for scheduling job orders if capacity is not available
      if (this.selecteMenuItems.length === 5) {
        this.selecteMenuItems.push({ ...this.saveCapObj });
      }
    }).catch(err => {
      me.loaderService.hideLoader();
      me.showLoader = false;
      me.utilities.showErrorToast(err);
    });
  }

  workcenterChanged(event) {
    if (event) {
      if (event.value?.workCenterId === -1) {
        this.filterSchedule.workCenterId = null;
      } else {
        this.filterSchedule.workCenterId = event.value?.workCenterId;
      }
    } else {
      this.filterSchedule.workCenterId = null;
    }
  }
  workcenterTypeChanged(event) {
    if (event) {
      if (event.value?.workCenterTypeId === -1) {
        this.filterWorkcenter.workCenterTypeId = null;
      } else {
        this.filterWorkcenter.workCenterTypeId = event.value?.workCenterTypeId;
      }
    } else {
      this.filterWorkcenter.workCenterTypeId = null;
    }
    this.filterSchedule.workCenterTypeId = this.filterWorkcenter.workCenterTypeId;
    this.requestScheduleJobOrdersDto.workCenterTypeId = this.filterWorkcenter.workCenterTypeId;

    this.filterWorkCenters();
  }

  simulationChanged(event) {
    this.filterSchedule.scheduleSimulationId = event.value?.scheduleSimulationId;
    this.requestScheduleJobOrdersDto.scheduleSimulationId = event.value?.scheduleSimulationId;

  }


  filterAndCreateEvents() {
    if (this.responseWorkCenterByWorkStationAndJobOrderDto) {
      const res = Object.assign({}, this.responseWorkCenterByWorkStationAndJobOrderDto);
      if (!this.showEmptyJobs) {
        if (res.jobOrderForWorkCenterDtos) {
          res.jobOrderForWorkCenterDtos = res.jobOrderForWorkCenterDtos.filter(item => item.jobOrderId > 0);
        }
        // res.workStationForWorkcenterDtos = res.workStationForWorkcenterDtos
        //   .filter(item => res.jobOrderForWorkCenterDtos.some(o => o.resourceId === item.workStationId));
      }

      res.workStationForWorkcenterDtos.forEach(item => {
        let taskList = [];
        if (res.jobOrderForWorkCenterDtos) {
          taskList = res.jobOrderForWorkCenterDtos.filter(o => o.resourceId === item.workStationId);
        }
        item.jobCount = taskList.length;
        if (item.jobCount > 0) {
          item.startDate = taskList[0].startDate;
          item.endDate = taskList[item.jobCount - 1].endDate;
        }
      });

      this.createEvents(res);
    }

    // if (this.showEmptyJobs) {
    //   this.events = this.eventsAll;
    //   this.resources = this.resourcesAll;
    // } else {
    //   this.events = this.eventsAll.filter(item => item.jobOrderId > 0);
    //   this.resources = this.resourcesAll.filter(item => this.events.some(o => o.resourceId === item.id));
    // }
  }

  openScheduleSettingsModal() {
    // this.params.dialog.visible = true;
    this.settingsModal.show();
  }

  closeScheduleSettingsModal() {
    // this.params.dialog.visible = false;
    this.settingsModal.hide();
  }

  // checkInput(event) {
  //   if (!Number(event.value)) {
  //     // this.requestScheduleJobOrdersDto.emptyTaskDurationList.splice(this.requestScheduleJobOrdersDto.emptyTaskDurationList.indexOf(event.value), 1)
  //     this.utilities.showErrorToast('Not Number');

  //     // const exist = this.requestScheduleJobOrdersDto.emptyTaskDurationList.find(item => item === event.value);
  //     // if (!exist) {
  //     //   this.requestScheduleJobOrdersDto.emptyTaskDurationList.push(event.value);
  //     // }
  //   }
  // }

  getStopCauseList() {
    this._stopCauseSvc.filter({ pageSize: 100000, pageNumber: 1, plantId: this.selectedPlant?.plantId }).then(result => {
      this.stopCauseList = result['content'];
      this.stopCauseList = this.stopCauseList.filter(item => item.plant != null
        && item.plant.plantId === this.selectedPlant.plantId && item.planned === true);
      const offset = moment().utcOffset();
      this.stopCauseList.forEach(item => {
        if (item.startTime) {
          item.startTime = moment(item.startTime.toString(), 'HH:mm:ss').add(offset, 'minutes').toDate();
        }
        // console.log(this.offset);
      });
    }).catch(error => {
      console.log(error);
      this.utilities.showErrorToast(error);
    });
  }

  saveScheduleParameters(modal) {
    if (!this.selectedPlant) {
      this.utilities.showErrorToast('Plant is not selected!!');
      return;
    }

    this.requestScheduleJobOrdersDto.plantId = this.selectedPlant.plantId;
    // this.requestScheduleJobOrdersDto.finishDate = ConvertUtil.date2EndOfDay(this.requestScheduleJobOrdersDto.finishDate);
    this.loaderService.showLoader();
    this._jbOrderSvc.saveProductionSchedulingParameters(this.requestScheduleJobOrdersDto).then(res => {
      this.loaderService.hideLoader();
      this.utilities.showSuccessToast('saved-success');
      modal.hide();
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    });
  }
  jobOrderDragged(eventOrder) {
    this.loaderService.showLoader();
    this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId = eventOrder.jobOrderOperationId;
    this.reqChangeJobOrderOperationStatusDto.startDate = new Date(eventOrder.startDate);
    this.reqChangeJobOrderOperationStatusDto.finishDate = null;


    // SAVING AFTER DRAG AND DROP IS NOT DESIRED
    // this._jbOrderSvc.removeProcessingStatusToPlanned(this.reqChangeJobOrderOperationStatusDto).then(res => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showSuccessToast('job-operation-updated');
    // }).catch(err =>{
    //   this.loaderService.hideLoader();
    //   console.error(err)
    // });
    this.loaderService.hideLoader();

  }
  jobOrderChangeStatus() {
    this.loaderService.showLoader();
    if (this.panel.title === 'processing-to-planned' || this.panel.title === 'update-planned-task') {
      this._jbOrderSvc.removeProcessingStatusToPlanned(this.reqChangeJobOrderOperationStatusDto).then(res => {
        this.panel.visible = false;
        this.loaderService.hideLoader();
        const scheduler = this.scheduler.getSchedulerEngine();
        const eventDataArray = scheduler.eventStore.data;
        if (eventDataArray && eventDataArray.length > 0) {
          const event = eventDataArray.find(event => event.jobOrderOperationId === this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId);
          if (event) {
            event.startDate = this.reqChangeJobOrderOperationStatusDto.startDate ? moment(this.reqChangeJobOrderOperationStatusDto.startDate).format('YYYY-MM-DD HH:mm:ss') : event.startDate;
            event.endDate = this.reqChangeJobOrderOperationStatusDto.finishDate ? moment(this.reqChangeJobOrderOperationStatusDto.finishDate).format('YYYY-MM-DD HH:mm:ss') : event.endDate;
            event.status = JobOrderStatusEnum.PLANNED;
            scheduler.eventStore.data = [...eventDataArray];
          }
        }

        // this.getData(this.filterSchedule);
      }).catch(err => console.error(err));
    } else if (this.panel.title === 'processing-to-completed') {
      this._jbOrderSvc.removeProcessingStatusToComplete(this.reqChangeJobOrderOperationStatusDto).then(res => {
        this.panel.visible = false;
        this.loaderService.hideLoader();
        const scheduler = this.scheduler.getSchedulerEngine();
        const eventDataArray = scheduler.eventStore.data;
        if (eventDataArray && eventDataArray.length > 0) {
          const event = eventDataArray.find(event => event.jobOrderOperationId === this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId);
          if (event) {
            event.startDate = this.reqChangeJobOrderOperationStatusDto.startDate ? moment(this.reqChangeJobOrderOperationStatusDto.startDate).format('YYYY-MM-DD HH:mm:ss') : event.startDate;
            event.endDate = this.reqChangeJobOrderOperationStatusDto.finishDate ? moment(this.reqChangeJobOrderOperationStatusDto.finishDate).format('YYYY-MM-DD HH:mm:ss') : event.endDate;
            event.status = JobOrderStatusEnum.COMPLETED;
            scheduler.eventStore.data = [...eventDataArray];
          }
        }
        // this.getData(this.filterSchedule);
      }).catch(err => console.error(err));
    } else if (this.panel.title === 'change-to-long-term-processing' || this.panel.title === 'update-long-term-processing') {
      this._jbOrderSvc.changeToLongTermProcessing(this.reqChangeJobOrderOperationStatusDto).then(res => {
        this.panel.visible = false;
        this.loaderService.hideLoader();
        const scheduler = this.scheduler.getSchedulerEngine();
        const eventDataArray = scheduler.eventStore.data;
        if (eventDataArray && eventDataArray.length > 0) {
          const event = eventDataArray.find(event => event.jobOrderOperationId === this.reqChangeJobOrderOperationStatusDto.jobOrderOperationId);
          if (event) {
            event.startDate = this.reqChangeJobOrderOperationStatusDto.startDate ? moment(this.reqChangeJobOrderOperationStatusDto.startDate).format('YYYY-MM-DD HH:mm:ss') : event.startDate;
            event.endDate = this.reqChangeJobOrderOperationStatusDto.finishDate ? moment(this.reqChangeJobOrderOperationStatusDto.finishDate).format('YYYY-MM-DD HH:mm:ss') : event.endDate;
            event.status = JobOrderStatusEnum.LONG_TERM_PROCESSING;
            scheduler.eventStore.data = [...eventDataArray];
          }
        }
        // this.getData(this.filterSchedule);
      }).catch(err => console.error(err));
    }
  }


  planJobOrderManually() {
    this.loaderService.showLoader();
    if (this.panel.title === 'plan-manually') {
      this._jbOrderSvc.updateStatusReadyToPlan(this.reqJobOrderPlanManuallyDto).then(res => {
        this.panel.visible = false;
        this.loaderService.hideLoader();
        const scheduler = this.scheduler.getSchedulerEngine();
        const eventDataArray = scheduler.eventStore.data;
        if (eventDataArray && eventDataArray.length > 0) {
          const event = eventDataArray.find(event => event.jobOrderOperationId === this.reqJobOrderPlanManuallyDto.jobOrderOperationId);
          if (event) {
            event.startDate = this.reqJobOrderPlanManuallyDto.startDate ? moment(this.reqJobOrderPlanManuallyDto.startDate).format('YYYY-MM-DD HH:mm:ss') : event.startDate;
            event.endDate = this.reqJobOrderPlanManuallyDto.finishDate ? moment(this.reqJobOrderPlanManuallyDto.finishDate).format('YYYY-MM-DD HH:mm:ss') : event.endDate;

            event.resourceId = this.reqJobOrderPlanManuallyDto.workStationId;
            event.status = JobOrderStatusEnum.PLANNED;
            scheduler.eventStore.data = [...eventDataArray];
          }
        }

      }).catch(err => console.error(err));
    }

  }

  filterEvents(field, value) {
    if (this.scheduler) {
      const scheduler = this.scheduler.getSchedulerEngine();
      switch (field) {
        case 'name':
          value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          setTimeout(() => {
            scheduler.eventStore.filter({
              filters: event => event.name.match(new RegExp(value, 'i')),
              replace: true
            });
          }, 100);
          // if(scheduler.eventStore.records.length <= 50) {
          //   await scheduler.eventStore.forEach(task => {
          //     const taskClassList = new DomClassList(task.cls);
          //     if (value !== '' && task.name.toLowerCase().includes(value.toLowerCase())) {
          //         taskClassList.add('b-match');
          //     } else {
          //         taskClassList.remove('b-match');
          //     }
          //     task.cls = taskClassList.value;
          //   });
          //   scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
          // } else {
          //   await scheduler.eventStore.forEach(task => {
          //     const taskClassList = new DomClassList(task.cls);
          //     taskClassList.remove('b-match');
          //     task.cls = taskClassList.value;
          //   });
          //   scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
          // }
          // await scheduler.eventStore.forEach(task => {
          //   const taskClassList = new DomClassList(task.cls);
          //   if (value !== '' && task.name.toLowerCase().includes(value.toLowerCase())) {
          //       taskClassList.add('b-match');
          //   } else {
          //       taskClassList.remove('b-match');
          //   }
          //   task.cls = taskClassList.value;
          // });
          // scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
          break;
      }
    }
  }

  onStartDateSelected(event) {
    if (!event) {
      this.requestScheduleJobOrdersDto.startDate = null;
    }
  }

  onSearchByChanged(event) {
    if (this.searchBy === 'searchbyscheduled') {
      this.filterSchedule.startDate = this.filterSchedule.erpStartDate;
      this.filterSchedule.finishDate = this.filterSchedule.erpFinishDate;
      this.filterSchedule.erpStartDate = null;
      this.filterSchedule.erpFinishDate = null;
    } else {
      this.filterSchedule.erpStartDate = this.filterSchedule.startDate;
      this.filterSchedule.erpFinishDate = this.filterSchedule.finishDate;
      this.filterSchedule.startDate = null;
      this.filterSchedule.finishDate = null;
    }
  }
  showFullScreen() {
    const elem = document.getElementById('fullscreenview');
    if (document.fullscreen) {
      this.isFullScreen = false;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else if (elem.requestFullscreen) {
      elem.requestFullscreen();
      this.isFullScreen = true;
    }
    // } else if (elem.mozRequestFullScreen) {
    //   /* Firefox */
    //   elem.mozRequestFullScreen();
    // } else if (elem.webkitRequestFullscreen) {
    //   /* Chrome, Safari and Opera */
    //   elem.webkitRequestFullscreen();
    // } else if (elem.msRequestFullscreen) {
    //   /* IE/Edge */
    //   elem.msRequestFullscreen();
    // }
  }

  setSelectedScheduleMode(event) {
    if (event) {
      this.requestScheduleJobOrdersDto.scheduleType = event;
      if (this.requestScheduleJobOrdersDto.scheduleType === JobOrderScheduleTypeEnum.BEST_CASE) {
        this.filterSchedule.bestCase = true;
      } else {
        this.filterSchedule.bestCase = false;
      }
    }
  }



  detailList2Node(detailList, frntlevel?, apilevel?) {
    const me = this;
    if (!apilevel) {
      apilevel = '';
    } else {
      apilevel = apilevel + '';
    }
    if (!frntlevel) {
      frntlevel = '';
    } else {
      frntlevel = frntlevel + '.';
    }
    const list = [];

    if (detailList) {

      detailList.forEach((item, index) => {
        const frntlvl = (frntlevel + (index !== 0 ? (index + 10) : 10));
        const apilvl = (apilevel + (index !== 0 ? (index + 10) : 10));
        const treeNode = me.detail2Node(item, frntlvl, apilvl);
        list.push(treeNode);
      });

    }
    return list;

  }

  detail2Node(detail, frntlevel?, apilevel?) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail, { children: null }, { orderNo: apilevel, orderFNo: frntlevel }),
        children: detail.children ? me.detailList2Node(detail.children, frntlevel, apilevel) : [],
        key: ConvertUtil.getSimpleUId(),
        label: this.generatingLabelName(detail, frntlevel),
        expanded: true
      };
      return node;
    }
    return node;

  }
  generatingLabelName(item, frntlevel?) {
    let label = '';
    // label+= '#lvl=(' + frntlevel + ')';
    item?.jobOrderOperations?.forEach((op, index) => {
      if (index > 0) {
        label += ','
      }
      label += op.operation?.operationName;

      // label+= '#on=(' +  op.orderNo + ')';
    });
    return label;
  }

  listToTree = (arr = []) => {
    let map = {}, node, res = [], i;
    for (i = 0; i < arr.length; i++) {
      map[arr[i].jobOrderId] = i;
      arr[i].children = [];
    };
    for (i = 0; i < arr.length; i++) {
      node = arr[i];
      if (!(node.previousJobOrderId === null || node.previousJobOrderId == 0 || node.previousJobOrderId == '0'
        || !arr[map[node.previousJobOrderId]])) {
        if (!arr[map[node.previousJobOrderId]]?.children) {
          arr[map[node.previousJobOrderId]].children = [];
        }
        arr[map[node.previousJobOrderId]].children.push(node);
      } else {
        res.push(node);
      };
    };
    res = this.sortArray(res);
    return res;
  };

  sortArray(arr: any) {
    arr.sort((a, b) => parseInt(a.orderNo) - parseInt(b.orderNo));
    arr.forEach((ar: any) => {
      if (ar.children && ar.children.length) {
        this.sortArray(ar.children);
      }
    });
    return arr;
  }

  viewChart(options, chartData) {
    this.dailogOptions = { ...options };
    this.dialogChartData = { ...chartData };
    this.widthSize = 700;
    if (this.dialogChartData.datasets[0].data.length && this.dialogChartData.datasets[0].data.length > 12) {
      this.widthSize = 700 + (this.dialogChartData.datasets[0].data.length * 20);
    } else {
      this.widthSize = 1;
    }
    setTimeout(() => {
      this.modal.active = true;
    }, 10);
  }

  onHide() {
    this.dailogOptions = null;
    this.dialogChartData = null;
    this.modal.active = false;
  }

  viewOptionChange(event) {
    if (event.length > 0) {
      event.forEach(x => {
        if (x.field == 'showPlannedStops') {
          this.isPlannedStopVisible = true;
          this.isPlannedStopVisibleEvent(event);
        }
        if (x.field == 'visibleDueJobs') {
          this.showDueJobs = true;
          this.showDueJobsEvent(event);
        }
      })
    } else {
      this.showDueJobs = false;
      this.isPlannedStopVisible = false;
      this.isPlannedStopVisibleEvent(event);
      this.showDueJobsEvent(event);
    }

    // if (event && event == '1') {
    //   this.isPlannedStopVisible = true;
    //   this.isPlannedStopVisibleEvent(event);
    // } else if (event == '2') {

    // } else {
    //   this.showDueJobs = false;
    //   this.isPlannedStopVisible = false;
    // }
  }
}

