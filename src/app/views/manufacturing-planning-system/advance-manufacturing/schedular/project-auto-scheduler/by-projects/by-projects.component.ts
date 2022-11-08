import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SchedulerComponent } from 'app/components/scheduler/scheduler.component';
import {DateHelper, EventHelper, DomClassList} from 'scheduler';
import zipcelx from 'zipcelx';
import { ProjectService } from 'app/services/dto-services/project/project.service';
import { ProjectStaticService } from 'app/services/dto-services/project/project-static.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { UtilitiesService } from 'app/services/utilities.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { delay, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-by-projects',
  templateUrl: './by-projects.component.html',
  styleUrls: ['./by-projects.component.scss']
})
export class ByProjectsComponent implements OnInit, OnChanges {
  responseLaborSchedular: any = [];
  selectedRecord: any;
  shiftWeekend: any;

  @ViewChild(SchedulerComponent) set ft(scheduler: SchedulerComponent) {
    this.scheduler = scheduler;
    if (scheduler) {
      const me = this;
      EventHelper.addListener({
        element: scheduler.getSchedulerEngine().element,
        delegate: '#projectId',
        click(event) {
          const record = scheduler.getSchedulerEngine().getRecordFromElement(event.target);
          if (record && record.projectId) {
            me.loaderService.showDetailDialog(DialogTypeEnum.PROJECT, record.projectId);
          }
        }
      });
    }
  };

  @ViewChild(SchedulerComponent) scheduler: SchedulerComponent;

  @Input() selectedPlant = null;
  @Input() searchBy=null;
  @Input('Data') Data = null;
  @Input('presetView') presetView = 'dayAndWeek';
  rowHeight = 50;
  selectedEvent = '';
  resources = [];
  events = [];
  timeRanges = [];
  featuretimeRanges: any;
  barMargin = 5;
  startDate;
  endDate;
  totalAllocationAverage = 0;
  dirtyDates = [];
  showLoader = false;
  sub: Subscription[] = [];
  columns = [
    {text: 'Project Id', field: 'id', hidden: true, width: 100},
    // {text: 'Employee Id', field: 'employeeId', width: 100, editor: false },
    // {
    //   // type: 'template'
    //   text: 'Project Code', field: 'code', type: 'template', editor: false, filterable: false,
    //   showEventCount: false, width: 100,
    //   template: ((value, record, field) => `<a href="javascript:void;" id="projectId">${value.value}</a>`)
    // },
    // {
    //   text: 'Project Name', field: 'name', editor: false, filterable: false, hidden: false,
    //   showEventCount: false, width: 100,
    // },

    // {
    //   text: 'Project Name',
    //   field: 'name',
    //   editor: false,
    //   width: 115,
    //   filterable: true,
    //   showEventCount: false,
    //   flex: 1,
    //   renderer({cellElement, record}) {
    //     const eventColors = [
    //       // 'red', this is reserved for event not draggable
    //       'green', 'blue', 'yellow', 'purple', 'cyan', 'indigo', 'orange', 'lime', 'teal', 'pink', 'violet'];
    //     const resourceColors = [
    //       // '#EF5350',
    //       '#66BB6A',
    //       '#42A5F5',
    //       '#FDD835',
    //       '#AB47BC',
    //       '#26C6DA',
    //       '#5C6BC0',
    //       '#FFA726',
    //       '#c5d252',
    //       '#26A69A',
    //       '#EC407A',
    //       '#7E57C2'];
    //     const num = record.projectId % 11;
    //     const color = eventColors[num];
    //     const rcolor = resourceColors[num];
    //     if (cellElement) {
    //       cellElement.style.backgroundColor = rcolor;
    //       cellElement.style.color = '#fff';
    //       cellElement.style.fontWeight = 400;
    //     }
    //     // return `
    //     //     <a href="javascript:void;" id="projectiId">${record.name}</a>
    //     //   `
    //     // record.eventColor = color;

    //     return record.name;
    //   },

    //   // template: (value, record, field) => {
    //   //   return `
    //   //   <a href="javascript:void;" id="projectiId">${value.value}</a>
    //   // `
    //   // }

    // },
    // {
    //   type    : 'action',
    //   text    : 'Action',
    //   width   : 45,
    //   align   : 'center',
    //   actions : [{
    //     cls     : 'b-fa b-fa-fw b-fa-line-chart',
    //     renderer : ({ action, record }) => {
    //       if(record.employeeAllocation > 0) {
    //         return `
    //           <button type="button" class="btn btn-primary" 
    //           data-toggle="tooltip" data-placement="top" title="Show Allocation By Shift"
    //           style="margin-left: 10%;" id="allocationByShift"><i class="fa fa-line-chart"></i></button>
    //         `
    //       } else {
    //         return '';
    //       }
    //     },
    //     tooltip : 'Report',
    //     onClick : ({ record }) => {
    //         await schedulerPro.project.addEvent({
    //             name         : 'New task',
    //             startDate    : schedulerPro.startDate,
    //             duration     : 4,
    //             durationUnit : 'h',
    //             resourceId   : record.id
    //         });

    //         schedulerPro.editEvent(schedulerPro.eventStore.last);
    //     }
    //   }]
    // }

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
    processItems({eventRecord, items}) {
      items.deleteEvent = false;
      if (eventRecord.status === 'PLANNED') { 

        items.toProcessing = {
          text   : 'Change To Processing',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'PROCESSING';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-processing'});
          }
        }
        items.toCompleted = {
          text   : 'Change To Completed',
          icon   : 'b-fa b-fa-fw b-fa-list',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'COMPLETED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-completed'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        items.toCancelled = {
          text   : 'Change To Cancelled',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'CANCELLED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-cancelled'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }

      } else if (eventRecord.status === 'PROCESSING') { 
        items.toPlanned = {
          text   : 'Change To Planned',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'PLANNED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-planned'});
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        items.toCompleted = {
          text   : 'Change To Completed',
          icon   : 'b-fa b-fa-fw b-fa-list',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'COMPLETED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-completed'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        items.toCancelled = {
          text   : 'Change To Cancelled',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'CANCELLED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-cancelled'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }

      } else if (eventRecord.status === 'COMPLETED') { 
        items.toPlanned = {
          text   : 'Change To Planned',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              eventRecord.draggable = true;
              eventRecord.status = 'PLANNED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-planned'});
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        items.toProcessing = {
          text   : 'Change To Processing',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'PROCESSING';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-processing'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        
        items.toCancelled = {
          text   : 'Change To Cancelled',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'CANCELLED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-cancelled'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }

      } else if (eventRecord.status === 'CANCELLED') { 

        items.toPlanned = {
          text   : 'Change To Planned',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              eventRecord.draggable = true;
              eventRecord.status = 'PLANNED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-planned'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        items.toProcessing = {
          text   : 'Change To Processing',
          icon   : 'b-fa b-fa-fw b-fa-tasks',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'PROCESSING';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-processing'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        items.toCompleted = {
          text   : 'Change To Completed',
          icon   : 'b-fa b-fa-fw b-fa-list',
          cls    : 'b-separator',
          weight : 503,
          onItem({ eventRecord }) {
              // eventRecord.locked = false;
              // eventRecord.draggable = true;
              eventRecord.status = 'COMPLETED';
              ProjectStaticService.jobOrderChangeStatus({...eventRecord.data, title:'to-completed'});
              // eventRecord.status = JobOrderStatusEnum.PLANNED;
              // JobOrderServiceStatic.jobOrderChangeStatus({...eventRecord.data, title:'processing-to-planned'});
          }
        }
        

      }
      // Prevent menu for "locked" event
      return !eventRecord.locked;
    }
  };

  constructor(private datePipe: DatePipe,
    private loaderService: LoaderService, private utilities: UtilitiesService,
    private projectService: ProjectService,) { }

  ngOnInit() {
    this.sub.push(ProjectStaticService.getjobOrderChangeStatusObs().subscribe((eventOrder: any) => {
      if(eventOrder) {
        const reqDto = {
          projectId: eventOrder.projectId,
          plantId: this.selectedPlant.plantId,
          milestoneId: eventOrder.milestoneId,
          status: eventOrder.status
        }
        if(eventOrder.title === 'to-completed') {
          reqDto.status = 'COMPLETED'
        } else if(eventOrder.title === 'to-processing') {
          reqDto.status = 'PROCESSING';
        } else if(eventOrder.title === 'to-cancelled') {
          reqDto.status = 'CANCELLED';
        } else {
          reqDto.status = 'PLANNED';
        }
       
        this.loaderService.showLoader();
        this.projectService.updateMilestoneStatus(reqDto).then(res => {
          this.loaderService.hideLoader();
          this.utilities.showSuccessToast('status-updated');
        }).catch(err => {
          this.loaderService.hideLoader();
          this.utilities.showErrorToast(err);
        })
      }
    }));

    this.sub.push(ProjectStaticService.getexportPDFObs().subscribe(() => {
      this.exportToPDF();
    }));
    this.sub.push(ProjectStaticService.getexportExcelObs().subscribe(() => {
      this.exportToExcel();
    }));
    this.sub.push(ProjectStaticService.getfilterByObs().pipe(delay(1000), distinctUntilChanged()).subscribe((res: any) => {
      this.filterEvents(res.name, res.value);
    }));
    this.sub.push(ProjectStaticService.getNavigateToDateObs().subscribe((res: any) => {
      this.onDateChange(res);
    }));
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges.Data && simpleChanges.Data.currentValue) {
      this.responseLaborSchedular = simpleChanges.Data.currentValue;
      let minDate = 0;
      let maxDate = 0;
      const now = Date.now();
      if (this.responseLaborSchedular && this.responseLaborSchedular.length > 0) {
        this.resources = [];
        this.events = [];
        this.resources.push({
          projectId: this.responseLaborSchedular[0].projectId,
          // code: item.code,
          // name: item.name,
          id: this.responseLaborSchedular[0].plant?.plantId,
          startDate:Date.now() ,
          finishDate: Date.now()
        })
        this.responseLaborSchedular.forEach(item => {
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
            resourceId: item.plant?.plantId,
            projectId: item.projectId,
            // milestoneId: ml.milestoneId,
            // milestoneCode: ml.code,
            // milestoneName: ml.name,
            // responsibleEmployeeId: ml.responsibleEmployee?.employeeId,
            actualStartDate: item.actualStartDate,
            actualFinishDate: item.actualFinishDate,
            description: item.description,
            resoureCode: item.code,
            resoureName: item.name,
            name: '#pc= '+ item.code + ', #pn= ' + item.name,
            status: item.status,
            startDate: moment(item.startDate == null ? item.startDate : item.startDate).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(item.finishDate == null ? item.finishDate : item.finishDate).format('YYYY-MM-DD HH:mm:ss'),
            draggable: true// event in this status will not allowed to edit or delete
          };
          if (!aEvent.draggable) {
            aEvent['eventColor'] = 'red';
          }
          if (item.projectId <= 0 ) {
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
      this.startDate = moment(minDate).format('YYYY-MM-DD HH:mm');
      this.endDate = moment(maxDate).format('YYYY-MM-DD HH:mm');
      this.calendarDate = new Date(minDate);
    }
  }

  ngOnDestroy() {
    this.sub.forEach(s => s.unsubscribe());
  }


  onDateChange(date) {
    if(date) {
      this.scheduler.getSchedulerEngine().eventStore.filter({id : 'my-filter',
      filterBy: record => record.startDate.toDateString() === this.calendarDate.toDateString()});
      this.scheduler.getSchedulerEngine().setTimeSpan(DateHelper.add(date, 0, 'hour'), DateHelper.add(date, 24, 'hour'));
    } else {
      this.scheduler.getSchedulerEngine().eventStore.removeFilter('my-filter');
      this.scheduler.getSchedulerEngine().setTimeSpan(new Date(this.startDate),
      new Date(this.endDate));
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

  onSchedulerEventSelected(event) {
    // selected event
    if (event && event.projectId) {
      // const employees = this.events.filter(evt => evt.jobOrderId === event.jobOrderId).map(evmp => evmp.employee);
      this.loaderService.showDetailDialog(DialogTypeEnum.PROJECT, event.projectId);
    }
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

    // this._jbOrderSvc.changeJobOrderStatusToCancel(event.jobOrderId).then(res => {
    //   this.utilities.showSuccessToast('delete-success');
    //   this.scheduler.removeEvent(event.id);
    //   this.myModal.hide();
    //   this.loaderService.hideLoader();
    // }).catch(error => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showErrorToast(error);
    // });
  }

  concatEventOfRecord(event) {
    const scheduler = this.scheduler.getSchedulerEngine();
    const events: Array<any> = scheduler.eventStore.getEventsForResource(event);

    this.removeEmptySpaces(events);
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

  onSchedulerEventDropped(aEvent) {
    // const dto = {
    //   projectId: aEvent.projectId,
    //   milestoneId: aEvent.milestoneId,
    //   code: aEvent.milestoneCode,
    //   name: aEvent.milestoneName,
    //   responsibleEmployeeId: aEvent.responsibleEmployeeId,
    //   actualStartDate: aEvent.actualStartDate,
    //   actualFinishDate: aEvent.actualFinishDate,
    //   startDate: aEvent.startDate,
    //   finishDate: aEvent.endDate,
    //   status: aEvent.status,
    //   description: aEvent.description,
    // }
    // this.loaderService.showLoader();
    // this.projectService.updateMilestone(dto).then(res => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showSuccessToast('updated')
    // }).catch(err => {
    //   this.loaderService.hideLoader();
    //   this.utilities.showErrorToast(err);
    // });
    const scheduler = this.scheduler.getSchedulerEngine();
    const me = this;
    scheduler.eventStore.forEachScheduledEvent
    (
      function (event, startD, endD) {
        me.reArrangeResourceStartAndEndDate(event);

      }, this
    );
  }

  filterEvents(field, value) {
    if (this.scheduler) {
      let minDate:any = 0;
      let maxDate:any = 0;
      const now = new Date();
      const scheduler = this.scheduler.getSchedulerEngine();
      switch (field) {
        case 'name':
          value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          scheduler.eventStore.filter({
            filters: event => event.name.match(new RegExp(value, 'i')),
            replace: true
          });
          scheduler.eventStore.forEach(evt => {
            if (minDate === 0) {
              minDate = evt.startDate;
            }
            if (minDate > evt.startDate) {
              minDate = evt.startDate;
            }
            if (maxDate === 0) {
              maxDate = evt.endDate;
            }
            if (maxDate < evt.endDate) {
              maxDate = evt.endDate;
            }
            setTimeout(() => {
              const taskClassList = new DomClassList(evt.cls);
              if (value !== '' && evt.name.toLowerCase().includes(value.toLowerCase())) {
                  taskClassList.add('b-match');
              } else {
                  taskClassList.remove('b-match');
              }
              evt.cls = taskClassList.value;
            }, 100);
          });
          minDate = minDate === 0 ? now : minDate;
          maxDate = maxDate === 0 ? now : maxDate;
          scheduler.scrollToDate(minDate, { block : 'center', animate : 500 });
          scheduler.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
          break;
      }
    }
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
  private  orderEventArray(array) {
    array.sort(function (a, b) {
      return DateHelper.compare(a.startDate, b.startDate, null);
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
    if (eventRecord && eventRecord['projectId']) {
      colorIndex = (eventRecord['projectId'] + eventColors.length) % eventColors.length;
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

  exportToPDF() {
    this.scheduler.getSchedulerEngine().features.pdfExport.showExportDialog();
  }
  exportToExcel() {
    this.scheduler.getSchedulerEngine().features.excelExporter.export();
  }

}
