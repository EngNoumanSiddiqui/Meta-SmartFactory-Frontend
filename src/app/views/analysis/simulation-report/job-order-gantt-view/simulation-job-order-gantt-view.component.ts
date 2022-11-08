import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SchedulerComponent } from 'app/components/scheduler/scheduler.component';
import { JobOrderStatusEnum } from 'app/dto/job-order/job-order.model';
import { AuthService } from 'app/services/auth/auth-service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { JobOrderService } from 'app/services/dto-services/job-order/job-order.service';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';
import { WorkcenterTypeService } from 'app/services/dto-services/workcenter-type/workcenter-type.service';
import { WorkcenterService } from 'app/services/dto-services/workcenter/workcenter.service';
import { WorkstationService } from 'app/services/dto-services/workstation/workstation.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { EventHelper, DateHelper, DomClassList } from 'scheduler';
import zipcelx from 'zipcelx';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'simulation-job-order-gantt-view',
  templateUrl: './simulation-job-order-gantt-view.component.html'
})
export class SimulationJobOrderGanttViewComponent implements OnInit {
  sub: Subscription;
  barData: any;
  options: any;
  subInterval: Subscription;

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
        delegate: '#referenceId',
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

  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('allocationModal') public allocationModal: ModalDirective;
  selectedPlant: any;
  presetView = 'dayAndWeek';
  searchBy = 'searchbyscheduled';
  workstations;
  selectedRecord;
  filterSchedule = {
    finishDate: moment().add(7, 'd').toDate(),
    plantId: null,
    startDate: new Date(),
    erpStartDate: null,
    erpFinishDate: null,
    scheduleProdOrderType: 'STANDARD',
    workCenterId: null,
    workCenterTypeId: null,
    workStationId: null,
    bestCase: false,
    scheduleSimulationId: null
  };

  allocationParams = {
    dialog: { title: '', data: '', visible: false },
  };
  loadingshowAllcationByShift = false;

  shiftWeekend = false;
  workcenters;
  workcenterTypes;
  showLoader = false;
  loadedWorkCenter;
  selectedWorkCenters = null;
  selectedWorkCenterTypes = null;
  filterWorkcenter = { pageNumber: 1, pageSize: 500, workCenterName: null, workCenterTypeId: null, plantId: null };
  // bind properties from the application to the scheduler component
  rowHeight = 50;
  selectedEvent = '';
  events = [];
  resources = [];
  timeRanges;
  barMargin = 5;
  startDate;
  endDate;
  columns = [
    {
      text: 'jobOrderId', field: 'jobOrderId', width: 100, filterable: true, editor: false,
      renderer({ cellElement, record }) {
        if (cellElement) {
          cellElement.id = 'machinename';
          cellElement['data-recordid'] = record.id;

        }
        return record.jobOrderId;
      }
    },
    {
      text: 'ReferenceId', field: 'prodOrderReferenceId', width: 100, filterable: true, editor: false,
      renderer({ cellElement, record }) {
        if (cellElement) {
          cellElement.id = 'referenceId';
          cellElement['data-recordid'] = record.id;

        }
        return record.prodOrderReferenceId;
      }
    },
  ];
  calendarDate;

  eventDrag = {
    validatorFn: (context) => {
      const task = context.draggedRecords[0],
        newResource = context.newResource;
      if (newResource.get('workCenterName') !== task.resource.get('workCenterName')) {
        return {
          valid: false,
          message: 'allowed to drag in workcenter ' + task.resource.get('workCenterName')
        };
      }

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

  eventTooltip = {
    // Tooltip configs can be used here
    // align : 'l-r' // Align left to right,
    // A custom HTML template
    template: data => `<dl>
      <dd>${data.eventRecord.name}</dd>
      <dd>
      <b>#m= ${data.eventRecord.materialNo}</b>
      </dd>
      <dd>
      <b>${this._translateSvc.instant('start-date')}</b>: ${DateHelper.format(data.eventRecord.startDate, 'L LT')} 
      </dd>
      <dd>
      <b>${this._translateSvc.instant('end-date')}</b>: ${DateHelper.format(data.eventRecord.endDate, 'L LT')}
      </dd>
    </dl>`
  }

  pdfExport = {
    // exportServer : 'http://localhost:8080'
    exportServer: 'https://dev.bryntum.com:8082'

  };

  excelExporter = {
    zipcelx
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
    processItems({ eventRecord, items }) {
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

      if (eventRecord.status === JobOrderStatusEnum.PROCESSING) {
        // Remove "Edit" and "Delete" items for activities
        // ArrayHelper.remove(
        //   items,
        //   items.find(i => i.name === 'editEvent'),
        //   items.find(i => i.name === 'deleteEvent')
        // );
        items.splice(items.find(i => i.name === 'deleteEvent'), 1);
        items.splice(items.find(i => i.name === 'editEvent'), 1);

        // Add a "Done" item
        // items.push({
        //   text: 'Done',
        //   icon: 'b-fa b-fa-fw b-fa-check',
        //   cls: 'b-separator',
        //   onItem({eventRecord}) {
        //     // eventRecord.done = true;
        //   }
        // });
      }

      // Prevent menu for "locked" event
      return !eventRecord.locked;
    }
  };
  dirtyDates = [];

  @Input() filterDto = null;

  @ViewChild('datePickerContainer') datePickerContainer: ElementRef;

  validateDelete(context) {
    console.log(context.status)
    return context && context.status !== JobOrderStatusEnum.PROCESSING;
  }
  eventRenderer({ eventRecord, tplData }) {
    const eventColors = [
      // 'red', this is reserved for event not draggable
      'green', 'blue', 'yellow', 'purple', 'cyan', 'indigo', 'orange', 'lime', 'teal', 'pink', 'violet'];
    // Inline style
    // // Add CSS class
    // tplData.cls.add('my-custom-css');
    let colorIndex = 0;
    if (eventRecord && eventRecord['prodOrderId']) {
      colorIndex = (eventRecord['prodOrderId'] + eventColors.length) % eventColors.length;
    }
    const colr = eventColors[colorIndex];
    let fontClr = '#f5eff0';
    if (colr === 'yellow' || colr === 'lime' || colr === 'cyan' || colr === 'pink' || colr === 'violet') {
      fontClr = '#3d3638';
    }
    tplData.style = 'font-weight: bold; border-radius: 3px; background-color:' + colr + '; color:' + fontClr;

    eventRecord.eventColor = colr;
    return eventRecord.name;
  }

  constructor(private _workcenterSvc: WorkcenterService,
    private wcTypesrv: WorkcenterTypeService,
    private _jbOrderSvc: JobOrderService,
    private _workStationSvc: WorkstationService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private _translateSvc: TranslateService,
    private loaderService: LoaderService,
    private appStateService: AppStateService,
    private _scheduleReportSvc: ScheduleReportService,
    private utilities: UtilitiesService) {

  }


  loadData() {


    // if (this.selectedWorkCenters != null) {
    this.dirtyDates = [];
    // const selectedWorkCenterIds = [];
    // const selectedWorkCenterNames = [];
    // this.selectedWorkCenters.forEach(item => {
    //   selectedWorkCenterIds.push(item.workCenterId);
    //   selectedWorkCenterNames.push(item.workCenterName);
    // });
    // this.loadedWorkCenter = selectedWorkCenterNames.join();
    this.showLoader = true;
    this.loaderService.showLoader();
    this.getData((this.selectedPlant ? this.selectedPlant.plantId : null));

    // if(this.subInterval) {
    //   this.subInterval?.unsubscribe();
    // }
    // this.subInterval = interval(1000 * 60 * 5).subscribe(x => {
    //   this.getData((this.selectedPlant ? this.selectedPlant.plantId : null));
    // });
    // } else {
    //   this.utilities.showErrorToast('choose-valid-work-center');
    // }

  }


  ngOnInit() {
    this.authService.disableAuthChecking();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if ((res) && res.plantId) {
        this.selectedPlant = res;
        this.filterSchedule.plantId = res.plantId;
        this.filterWorkcenter.plantId = res.plantId;
        this.filterWorkCenter();
        this.filterWorkCenterTypes(this.filterWorkcenter.plantId);
        if (this.filterDto) {

          this.filterSchedule.workCenterId = this.filterDto.workCenterId;
          this.filterSchedule.workStationId = this.filterDto.workStationId;
          this.filterSchedule.startDate = this.filterDto.startDate;
          this.filterSchedule.finishDate = this.filterDto.finishDate;
          if (this.filterDto.scheduleSimulationIdList && this.filterDto.scheduleSimulationIdList.length > 0) {
            this.filterSchedule.scheduleSimulationId = this.filterDto.scheduleSimulationIdList[0];
          }

          this.loadData();
        }

      } else {
        this.selectedPlant = null;
        this.filterWorkcenter.plantId = null;
      }

    });


    this.setOptions();

  }

  filterWorkCenter() {
    this._workcenterSvc.filter(this.filterWorkcenter).then(result => {
      this.workcenters = [...[{ workCenterName: 'All', workCenterId: -1 }], ...result['content']];
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

  ngOnDestroy() {
    this.authService.enableAuthChecking();
    this.sub?.unsubscribe();
    this.subInterval?.unsubscribe();
  }

  exportToPDF() {
    this.scheduler.getSchedulerEngine().features.pdfExport.showExportDialog();
  }
  exportToExcel() {
    this.scheduler.getSchedulerEngine().features.excelExporter.export();
  }

  ngAfterViewInit() {
    // exposing scheduling engine to be easily accessible from console
    // window.scheduler = this.scheduler.getSchedulerEngine();

  }


  onDateChange(date) {
    // this.scheduler.getSchedulerEngine().setTimeSpan(DateHelper.add(date, 0, 'hour'), DateHelper.add(date, 24, 'hour'));
    if (date) {
      // this.scheduler.getSchedulerEngine().eventStore.filter({id : 'my-filter',
      // filterBy: record => record.startDate.toDateString() === this.calendarDate.toDateString()});
      this.scheduler.getSchedulerEngine().setTimeSpan(DateHelper.add(date, 0, 'hour'), DateHelper.add(date, 24, 'hour'));
    } else {
      // this.scheduler.getSchedulerEngine().eventStore.removeFilter('my-filter');
      this.scheduler.getSchedulerEngine().setTimeSpan(new Date(this.startDate),
        new Date(this.endDate));
    }
    this.scrollToEvent();
  }

  scrollToEvent() {
    setTimeout(() => {
      const scheduler = this.scheduler?.getSchedulerEngine();
      // if(scheduler.eventStore.data.filter(event =>
      //   new Date(event.startDate).getTime() === new Date(this.calendarDate).getTime())[0] !== undefined) {
      if (scheduler?.eventStore && scheduler.eventStore.data && scheduler.eventStore.data.length > 0) {
        let minDate = 0;
        scheduler.eventStore.data.forEach(event => {
          let stDate = new Date(event.startDate);
          let selctddate = new Date(this.calendarDate);
          if (stDate.getDate() === selctddate.getDate()) {
            if (minDate === 0) {
              minDate = event.startDate;
            } else if (new Date(minDate) > new Date(event.startDate)) {
              minDate = event.startDate;
            }
          }

        });
        if (minDate !== 0) {
          for (let i = 0; i < scheduler.eventStore.data.length; i++) {
            // console.log(new Date(scheduler.eventStore.data[i].startDate).getDate());
            // console.log("Min: " + new Date(minDate).getDate());
            if (new Date(scheduler.eventStore.data[i].startDate).getDate() === new Date(minDate).getDate()) {
              let index = this.resources.findIndex(res => res.id === scheduler.eventStore.data[i].resourceId)
              const res = this.resources[index];
              this.resources.splice(index, 1);
              this.resources.splice(0, 0, res);
              this.resources = [...this.resources];
              // scheduler.scrollEventIntoView(scheduler.eventStore.data[i], {
              //   highlight:true,
              //   animate : {
              //     easing   : 'easeFromTo',
              //     duration : 1000
              //   }
              // });
              // break;
            }
          }
        }

      }
      // }
    }, 500);
  }

  filterEvents(field, value) {
    if (this.scheduler) {
      const scheduler = this.scheduler.getSchedulerEngine();
      switch (field) {
        case 'name':
          value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          scheduler.eventStore.filter({
            filters: event => event.name.match(new RegExp(value, 'i')),
            replace: true
          });
          scheduler.eventStore.forEach(task => {
            const taskClassList = new DomClassList(task.cls);
            if (value !== '' && task.name.toLowerCase().includes(value.toLowerCase())) {
              taskClassList.add('b-match');
            } else {
              taskClassList.remove('b-match');
            }
            task.cls = taskClassList.value;
          });
          scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
          break;
      }
    }
  }


  workCentersChanged(event) {

    if (event.itemValue) { // one selected or diselected

      if (event.value.indexOf(event.itemValue) !== -1) {// selection happened

        if (event.itemValue.workCenterId === -1) {
          this.selectedWorkCenters = { workCenterName: 'All', workCenterId: -1 };
        } else {
          // this.selectedWorkCenters = this.selectedWorkCenters.filter(item => item.workCenterId !== -1);
        }

      } else {// diselection happened

      }
    } else {// whole selected or diselected
      if (event.value.length > 0) {
        // this.selectedWorkCenters = [{workCenterName: 'All', workCenterId: -1}];
      }
    }
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
    this.filterWorkCenter();
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
  getData(plantId) {
    let minDate = 0;
    let maxDate = 0;
    const me = this;
    const now = Date.now();
    if (plantId) {
      this._workStationSvc.getWorkStationsScheduleJobs(this.filterSchedule).then(res => {
        const resources = [];
        const events = [];
        me.workstations = [];
        if (!res) {
          me.loaderService.hideLoader();
          this.events = [];
          this.resources = [];
          me.showLoader = false;
          return 0;
        }
        // res['workStationForWorkcenterDtos'].forEach(item => {
        //   me.workstations.push({workStationId: item.workStationId, workStationName: item.name});
        //   resources.push({
        //     id: item.workStationId,
        //     workStationNo: item.workStationNo,
        //     workCenterName: item.workCenterTypeName + " - " +item.workCenterName,
        //     workCenterTypeName: item.workCenterTypeName,
        //     name: item.workStationNo + '-' +item.name,
        //     startDate: moment(item.startDate == null ? now : item.startDate).format('YYYY-MM-DD HH:mm'),
        //     endDate: moment(item.endDate == null ? now : item.endDate).format('YYYY-MM-DD HH:mm'),
        //     jobCount: item.jobCount
        //   })
        // });

        if (res['jobOrderForWorkCenterDtos'] && res['jobOrderForWorkCenterDtos'].length > 0) {

          const jobOrderList: any = [...new Map(res['jobOrderForWorkCenterDtos'].map(item =>
            [item['jobOrderId'], item])).values()];

          jobOrderList.forEach(item => {
            resources.push({
              id: item.jobOrderId,
              jobOrderId: item.jobOrderId,
              jobOrderOperationId: item.jobOrderOperationId,
              name: item.orderNo,
              prodOrderReferenceId: item.prodOrderReferenceId,
              startDate: moment(item.startDate == null ? now : item.startDate).format('YYYY-MM-DD HH:mm'),
              endDate: moment(item.endDate == null ? now : item.endDate).format('YYYY-MM-DD HH:mm'),
              // jobCount: item.jobCount
            });
          });
          // res['jobOrderForWorkCenterDtos'] = res['jobOrderForWorkCenterDtos'].sort((a, b) => a.startDate - b.startDate);
          let jobOrderForWorkCenterDtos = res['jobOrderForWorkCenterDtos'];
          if (this.searchBy === 'searchbyerp') {
            jobOrderForWorkCenterDtos = jobOrderForWorkCenterDtos.filter(item => item.erpStartDate != null || item.erpFinishDate != null);
          } else {
            jobOrderForWorkCenterDtos = jobOrderForWorkCenterDtos.filter(item => item.startDate != null || item.finishDate != null);
          }
          jobOrderForWorkCenterDtos.forEach(item => {
            if (this.searchBy == "searchbyscheduled") {
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
              const aEvent = {
                resourceId: item.jobOrderId,
                jobOrderId: item.jobOrderId,
                name: this.getJobName(item),
                materialNo: item.materialNo,
                startDate: item.startDate ? moment(new Date(item.startDate)).format('YYYY-MM-DD HH:mm') : moment(new Date(now)).format('YYYY-MM-DD HH:mm'),
                endDate: item.endDate ? moment(new Date(item.endDate)).format('YYYY-MM-DD HH:mm') : moment(new Date(now)).format('YYYY-MM-DD HH:mm'),
                status: item.status,
                prodOrderId: item.prodOrderId,
                jobOrderOperationId: item.jobOrderOperationId,
                jobOrderOperationStatus: item.jobOrderOperationStatus,
                jobOrderOperationOrder: item.jobOrderOperationOrder,
                parentOperation: item.parentOperation,
                draggable: item.status !== JobOrderStatusEnum.PROCESSING// event in this status will not allowed to edit or delete
              };
              if (!aEvent.draggable) {
                aEvent['eventColor'] = 'red';
              }
              events.push(aEvent)
              me.addDateToDirty(item.startDate);
            } else {
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
              const aEvent = {
                resourceId: item.jobOrderId,
                jobOrderId: item.jobOrderId,
                name: this.getJobName(item),
                startDate: item.erpStartDate ? moment(new Date(item.erpStartDate)).format('YYYY-MM-DD HH:mm') : moment(new Date(now)).format('YYYY-MM-DD HH:mm'),
                endDate: item.erpEndDate ? moment(new Date(item.erpEndDate)).format('YYYY-MM-DD HH:mm') : moment(new Date(now)).format('YYYY-MM-DD HH:mm'),
                status: item.status,
                prodOrderId: item.prodOrderId,
                jobOrderOperationId: item.jobOrderOperationId,
                jobOrderOperationStatus: item.jobOrderOperationStatus,
                jobOrderOperationOrder: item.jobOrderOperationOrder,
                parentOperation: item.parentOperation,
                draggable: item.status !== JobOrderStatusEnum.PROCESSING// event in this status will not allowed to edit or delete
              };
              if (!aEvent.draggable) {
                aEvent['eventColor'] = 'red';
              }
              events.push(aEvent)
              me.addDateToDirty(item.erpStartDate);
            }
          });
        }
        me.resources = [];
        me.events = [];
        minDate = minDate === 0 ? now : minDate;
        maxDate = maxDate === 0 ? now : maxDate;
        me.timeRanges = {
          'startDate': minDate,
          'endDate': maxDate
        };
        me.startDate = moment(new Date(minDate)).format('YYYY-MM-DD HH:mm');
        me.endDate = moment(new Date(maxDate)).format('YYYY-MM-DD HH:mm');
        me.calendarDate = new Date(minDate);
        me.loaderService.hideLoader();

        setTimeout(() => {
          me.showLoader = false;
          me.resources = resources;
          me.events = events;
        }, 10);
        setTimeout(() => {
          this.scrollToEvent();
        }, 500);
      }).catch(err => {
        me.loaderService.hideLoader();
        me.showLoader = false;
        this.utilities.showErrorToast(err);
      });
    }
  }

  getJobName(item) {
    return '#rf=' + item['prodOrderReferenceId']
      + "<br>"
      + '#m=' + item['materialNo'].replace('_PR', '').slice(-4)
      + ' - #jn=' + item['orderNo']
      + ' - #o=' + item['operationName']
      + ' - #p=' + item['prodOrderId']
      + ' - #j=' + item['jobOrderId']
      + ' - #ic=' + item['individualCapacity']
      + ' - #output=' + item['name'];
  }


  onSchedulerEventSelected(event) {
    // selected event
    if (event && event.jobOrderId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, event.jobOrderId);
    }
  }


  saveEvent(event) {

    const scheduler = this.scheduler.getSchedulerEngine();
    const aEvent = scheduler.eventStore.getById(event.id);

    aEvent.data.startDate = (event.startDate);
    aEvent.data.endDate = (event.endDate);
    if (aEvent.data.resourceId !== event.resourceId) {
      const oldresource = scheduler.resourceStore.getById(aEvent.data.resourceId);
      const newresource = scheduler.resourceStore.getById(event.resourceId);
      scheduler.eventStore.reassignEventFromResourceToResource(aEvent, oldresource, newresource);
    }
    // this.moveToCorrectPlaceDroppedEvent(aEvent);


    this.reArrangeResourceStartAndEndDate(aEvent);
    scheduler.eventStore.commit();
    this.myModal.hide();

  }

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
      filter.endTime = ConvertUtil.localDateShiftAsUTC(filter.endTime);
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
        let labels = [];
        let datasets = [];
        if (res['content'] && res['content'].length > 0) {

          let data = res['content'].sort((a, b) => a.shiftStartDate - b.shiftStartDate);
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
          let dates: any = [...new Map(data.map(item => [moment(item.shiftStartDate).format('DD-MM-YYYY'), item])).values()];

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
            })
            datasets.push(this.getDataSetItem('#4188f5', datasetItems, dataset));
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
      }).catch(error => {
        this.loadingshowAllcationByShift = false;
        this.loaderService.hideLoader();
      });
    }

  }

  setOptions() {
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

  private reArrangeResourceStartAndEndDate(aEvent) {
    const scheduler = this.scheduler.getSchedulerEngine();
    const resource = scheduler.resourceStore.getById(aEvent.data.resourceId);
    // let myEvent = scheduler.eventStore.getById(aEvent.data.id);
    const events: Array<any> = scheduler.eventStore.getEventsForResource(resource);

    this.orderEventArray(events);
    if (events.length > 0) {
      resource.startDate = moment(events[0].startDate).format('YYYY-MM-DD HH:mm');
      resource.endDate = moment(events[events.length - 1].endDate).format('YYYY-MM-DD HH:mm');

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
    const date = new Date();

    this.loaderService.showLoader();
    const scheduler = this.scheduler.getSchedulerEngine();

    const events = [];
    scheduler.eventStore.forEachScheduledEvent
      (
        function (event, startD, endD) {

          events.push({
            workStationId: event.resourceId,
            jobOrderId: event.jobOrderId,
            startDate: startD,
            endDate: endD,
            status: event.status
          })

          console.log(event.data);

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


  addEvent(event) {
    const scheduler = this.scheduler.getSchedulerEngine();
    scheduler.eventStore.add({
      resourceId: event.resourceId,
      startDate: event.startDate,
      endDate: event.endDate,
      name: event.name,
      status: event.status
    })
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

}
