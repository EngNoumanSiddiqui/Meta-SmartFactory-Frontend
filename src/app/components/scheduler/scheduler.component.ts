import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, HostListener} from '@angular/core';
import {RecurringTimeSpan, TimeSpan, RecurringTimeSpansMixin, Store, EventHelper,WidgetHelper, Scheduler} from 'scheduler';
import * as moment from 'moment';

// Define a new Model extending TimeSpan class
// with RecurringTimeSpan mixin which adds recurrence support
class MyTimeRange extends RecurringTimeSpan(TimeSpan) {}

// Define a new store extending the Store class
// with RecurringTimeSpansMixin mixin to add recurrence support to the store.
// This store will contain time ranges.
class MyTimeRangeStore extends RecurringTimeSpansMixin(Store) {
  static get defaultConfig() {
    return {
      // use our new MyTimeRange model
      modelClass : MyTimeRange,
      storeId    : 'timeRanges'
    };
  }

  

  
  construct(config) {
    super.construct(config, true);
    // setup recurrence support
    // @ts-ignore
    this.setupRecurringTimeSpans();
  }
}


@Component({
  selector: 'scheduler',
  template: '<div id="screen"></div>'
})




export class SchedulerComponent implements OnInit, OnChanges {

  private elementRef: ElementRef;
  private schedulerEngine: Scheduler;

  // private getScreenWidth: any;
  // private getScreenHeight: any;


  // Available features
  private featureInputs = [
    'cellEdit', 'cellTooltip', 'pdfExport', 'excelExporter', 'columnLines', 'columnPicker', 'columnReorder', 'columnResize', 'contextMenu',
    'dependencies', 'eventDrag', 'eventContextMenu', 'eventDragCreate', 'eventEdit',
    'eventFilter', 'eventResize', 'eventTooltip', 'filter', 'filterBar', 'group', 'groupSummary', 'headerContextMenu', 'labels',
    'nonWorkingTime', 'regionResize', 'search', 'scheduleTooltip', 'showDeleteButton', 'sort', 'stripe', 'summary', 'timeRanges', 'tree',
  ];

  // Available configs
  private configInputs = ['assignments', 'autoHeight', 'barMargin', 'columns', 'dependencies', 'emptyText', 'endDate', 'enableDeleteKey', 'events',
    'eventBodyTemplate', 'eventColor', 'eventLayout', 'eventStyle', 'eventRenderer', 'resources', 'readOnly',
    'rowHeight', 'responsiveLevels', 'viewPreset' , 'viewPeriod', 'startDate', 'crudManager', 'eventStore', 'resourceStore',
    'assignmentStore', 'dependencyStore',
    'timeRanges',
    'showRemoveRowInContextMenu', // hide delete menu when right click on resource
    'showRemoveEventInContextMenu', // hide delete menu when right click on event
    'showAddEventInContextMenu',
    'createEventOnDblClick'
  ];

  @Input() frameHeight : any;

  // Configs
 
  @Input() assignments: object[];
  @Input() autoHeight = true;
  @Input() enableDeleteKey = true;
  @Input() barMargin = 5;
  @Input() columns: object[];
  @Input() emptyText: string;
  @Input() endDate: any;
  @Input() events: object[];
  @Input() showDueJobs = false;
  @Input() eventBodyTemplate: any;
  @Input() eventColor: string;
  @Input() eventLayout: string;
  @Input() eventStyle: string;
  @Input() eventRenderer: any;
  @Input() resources: object[];
  @Input() readOnly = false;
  @Input() responsiveLevels: any;
  @Input() rowHeight = 50;
  @Input() startDate: any;
  @Input() viewPreset = 'hourAndDay';
  @Input() viewPeriod = 1;
  @Input() crudManager: object;
  @Input() eventStore: object;
  @Input() resourceStore: object;
  @Input() dependencyStore: object;
  @Input() assignmentStore: object;
  

  // Features, only used for initialization
  @Input() cellEdit: boolean | object = true;
  @Input() cellTooltip: boolean | object = true;
  @Input() columnLines: boolean | object = true;
  @Input() columnPicker = true;
  @Input() columnReorder = true;
  @Input() columnResize = true;
  @Input() createEventOnDblClick = true;
  @Input() contextMenu: boolean | object;
  @Input() dependencies: boolean | object = false;
  @Input() eventDrag: boolean | object = true;
  @Input() eventContextMenu: boolean | object = true;
  @Input() eventDragCreate: boolean | object = true;
  @Input() eventEdit: boolean | object = true;
  @Input() pdfExport: boolean | object = true;
  @Input() excelExporter: boolean | object = true;
  @Input() eventFilter: boolean | object = true;
  @Input() eventResize: boolean | object = true;
  @Input() eventTooltip: boolean | object = true;
  @Input() filter: boolean | object;
  @Input() filterBar: boolean | object;
  @Input() group: boolean | object | string = true;
  @Input() groupSummary: boolean | object;
  @Input() headerContextMenu: boolean | object;
  @Input() labels: boolean | object;
  @Input() nonWorkingTime: boolean;
  @Input() regionResize: boolean;
  @Input() search: boolean;
  @Input() showAddEventInContextMenu = true;
  @Input() showRemoveEventInContextMenu: boolean;
  @Input() showRemoveRowInContextMenu: boolean;
  @Input() scheduleTooltip: boolean | object = true;
  @Input() sort: boolean | object | string = true;
  @Input() stripe: boolean;
  @Input() summary: boolean | object;
  // @Input() timeRanges: boolean | object[] = true;
  @Input() configtimeRanges: any;
  @Input() featuretimeRanges: any;
  @Input() tree: boolean;

  @Input() validateDelete: (eventRecord) => boolean;
  @Input() validateDropEvent: (eventRecord) => boolean;
  @Input() stopCauseList: any;

  @Output() selectedEvent = '';
  @Output() onSchedulerEventSelected = new EventEmitter<object>();
  @Output() onSchedulerEventUpdated = new EventEmitter<object>();
  @Output() onSchedulerEventDropped = new EventEmitter<object>();
  @Output() onSchedulerEventDeleted = new EventEmitter<object>();
  @Output() onSchedulerEventDbClicked = new EventEmitter<object>();

  // stopCauseList = [
  //   {
  //     name         : 'New time range 1',
  //     startDate    : new Date('2020/05/10 12:00:00'),
  //     duration     : 3600000,
  //     durationUnit : 'ms',
  //     style        : 'backgroundColor: red; color: red; font-weight: 800'
  //   },
  //   {
  //     name         : 'New time range 2',
  //     startDate    : new Date('2020/05/10 18:00:00'),
  //     duration     : 7200000,
  //     durationUnit : 'ms',
  //     style        : 'backgroundColor: red; color: red; font-weight: 800'
  //   },
  // ]

  myTimeRangeStore = new MyTimeRangeStore();

  constructor(element: ElementRef) {
    // Needed later, used as target when rendering Bryntum Grid
    this.elementRef = element;
  }

  screenHeight () {
    if(this.frameHeight)
   {

    setTimeout(() => {
      let resizedHeight = window.innerHeight;
      let schedulerHeight =  resizedHeight -  this.frameHeight ;
      document.getElementById("screen").style.height= schedulerHeight + "px";

    }, 50);

  // let height = screen.height;

  // this.screenHeight(height) ;

  // if(resizedHeight > 900) {
  //   document.getElementById("screen").style.height= "68vh";

  // } else {
  //   document.getElementById("screen").style.height= "49vh";
  // }
    } 
    
  }



  async ngOnInit() {
    const me = this;
    const mytypes = [];
    const
      // Features config object
      featureConfig = {
        // add recurringTimeSpans feature processing timeRangesStore store
        recurringTimeSpans : {
          store : this.myTimeRangeStore
        },
        timeRanges : {
          // tell timeRanges feature to use the store we made
          store : this.myTimeRangeStore,
          showCurrentTimeLine : true,
          showHeaderElements : false
        }
      },


      // Grid config object
      config = {
        startDate: new Date(2019, 0, 1, 6),
        endDate: new Date(2019, 0, 1, 20),
        // Render scheduler to components element
        appendTo: this.elementRef.nativeElement.firstElementChild,
        // to add cell custom click event open this comment
        // onCellClick: (context) => {
        //     this.onRecordCellClicked.emit(context.record);
        // },


        // Listeners, will relay events
        listeners: {
          catchAll(event) {

            // if (mytypes.indexOf(event.type) === -1) {
            //   mytypes.push(event.type);
            //   console.log(mytypes);
            // }
            if (event.type === 'eventclick') {
              // this.selectedEvent = event.selected.length ? event.selected[0].name : '';
              this.selectedEvent = event.eventRecord;
              this.onSchedulerEventSelected.emit(event.eventRecord.data);
            // }
            } else if (event.type === 'beforeeventdropfinalize') {
              if (me.validateDropEvent && me.validateDropEvent(event.context)) {
                
                let record = {
                  jobOrderOperationId: event.context.record.data.jobOrderOperationId,
                  startDate: event.context.startDate,
                };
                
                this.onSchedulerEventDropped.emit(record);
                
                event.context.finalize();
                event.context.valid=true;
                event.context.context.valid=true;
              } else {
                event.context.valid=false;
                event.context.context.valid=false;
                // this.abort();
                
              }
            // else if (event.type === 'eventdrop') {
            //   this.onSchedulerEventDropped.emit(event.eventRecords[0]);
            }else if (event.type === 'aftereventsave') {
              if (me.validateDelete && me.validateDelete(event.eventRecord)) {
                this.onSchedulerEventUpdated.emit(event.eventRecord);
              } else {
                return false;
              }
            } else if (event.type === 'beforeeventdelete') {
              if (me.validateDelete && me.validateDelete(event.eventRecord)) {
                this.onSchedulerEventDeleted.emit(event.eventRecord);
              } else {
                return false;
              }
            } else if (event.type === 'eventdblclick') {
              return me.validateDelete && me.validateDelete(event.eventRecord)
              // this.onSchedulerEventDbClicked.emit(event.eventRecord);
            } else if (event.type === 'beforeeventedit') {
              return me.validateDelete && me.validateDelete(event.eventRecord)
              // return false;
            } else if (event.type === 'beforeEventAdd') {
              return false;
            }

          },

          thisObj: this
        },

        features: featureConfig,

      };

    if (this.stopCauseList) {
      if (!this.configtimeRanges) {
        this.configtimeRanges = [];
      }

      const startDate = moment(this.featuretimeRanges.startDate).toDate();

      this.stopCauseList.forEach(item => {
        const stopStartDate = moment(startDate)
          .set({ hour: item.startTime.getHours(), minute: item.startTime.getMinutes(), second: item.startTime.getSeconds()})
          .toDate();
        const stopTimeSpan = {
          name         : item.stopCauseName,
          startDate    : stopStartDate,
          duration     : item.duration,
          durationUnit : 'ms',
          style        : 'background-color: red; opacity: 0.75',
          // cls          : '...',
          // recurrenceRule : 'FREQ=WEEKLY;BYDAY=MO,TH;'
          recurrenceRule : 'FREQ=DAILY;'
        };
        // engine.features.timeRanges.store.add(timeSpan);
        this.configtimeRanges.push(stopTimeSpan);
      });
    }

    // Pass configs on to scheduler
    this.configInputs.forEach(configName => {
      if (configName in this) {
        config[configName] = this[configName];
      }
    });
    config['timeRanges'] = this.configtimeRanges;
    config['showDueJobs'] = this.showDueJobs;
    // config['presets'] = [{
    //   base : 'hourAndDay',
    //   id   : 'MyHourAndDay',
    //   timeResolution : {                  // Override time resolution
    //     unit      : 'hour',
    //     increment : 2                  // Make it increment every 15 mins
    //   }
    // }];
    // config['viewPreset'] = 'MyHourAndDay';

    // config['endDate'] = new Date(2021, 10, 1, 20);
    // this.featuretimeRanges.endDate = config['endDate'];

    // Pass feature configs on to scheduler
    this.featureInputs.forEach(featureName => {
      if (featureName in this) {
        featureConfig[featureName] = this[featureName];
      }
    });
    // featureConfig['timeRanges'] = this.featuretimeRanges;

    // featureConfig['timeRanges'] = {
    //   // tell timeRanges feature to use the store we made
    //   store : this.myTimeRangeStore,
    //   showHeaderElements : false,
    // };
    // featureConfig['recurringTimeSpans'] = {
    //   store : this.myTimeRangeStore
    // };

    const engine = this.schedulerEngine = new Scheduler(config);
    // const mask = WidgetHelper.mask(engine.element, 'Generating records');
    // mask.text = 'Loading data';

    // await AsyncHelper.sleep(100);
    // engine.suspendRefresh();
    // Relay events from eventStore and resourceStore, making them a bit easier to catch in your app.
    // The events are prefixed with 'events' and 'resources', turning and 'add' event into either 'eventsAdd' or
    // 'resourcesAdd'
    engine.eventStore.relayAll(engine, 'events');
    engine.resourceStore.relayAll(engine, 'resources');
    engine?.dependencyStore?.relayAll(engine, 'dependencies');

    // engine.resumeRefresh(true);

    // await engine.project.await('refresh');
    // mask.close();

    this.screenHeight ();


  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {


    this.screenHeight() ;
    // this.getScreenWidth = window.innerWidth;
    // this.getScreenHeight = window.innerHeight;
  }

  addStopCauseList(engine: Scheduler) {
    const allStopCauseList = [];
    const startDate = moment(this.featuretimeRanges.startDate).toDate();
    // set end time to 23:59:59 of selected day.
    const endDate = moment(this.featuretimeRanges.endDate).endOf('day').toDate();
    // let date = startDate;
    //
    // while (date <= endDate) {
    //   this.stopCauseList.forEach(item => {
    //     const tempNode = Object.assign({}, item);
    //     const stopStartDate = moment(date)
    //       .set({ hour: tempNode.startTime.getHours(), minute: tempNode.startTime.getMinutes(), second: tempNode.startTime.getSeconds()})
    //       .toDate();
    //     tempNode.startTime = stopStartDate;
    //     allStopCauseList.push(tempNode);
    //   });
    //   date = moment(date).add(1, 'days').toDate();
    // }
    //
    // allStopCauseList.forEach(item => {
    //     const timeSpan = {
    //         name         : item.stopCauseName,
    //         startDate    : item.startTime,
    //         duration     : item.duration,
    //         durationUnit : 'ms',
    //         style        : 'background-color: red; opacity: 0.75',
    //         // cls          : '...',
    //       };
    //   engine.features.timeRanges.store.add(timeSpan);
    // });
  }


  addStopCauseList2(engine: Scheduler) {
    if (this.stopCauseList) {
      this.configtimeRanges = [];
      const startDate = moment(this.featuretimeRanges.startDate).toDate();

      this.stopCauseList.forEach(item => {
        const stopStartDate = moment(startDate)
          .set({ hour: item.startTime.getHours(), minute: item.startTime.getMinutes(), second: item.startTime.getSeconds()})
          .toDate();
        const stopTimeSpan = {
          name         : item.stopCauseName,
          startDate    : stopStartDate,
          duration     : item.duration,
          durationUnit : 'ms',
          style        : 'background-color: red; opacity: 0.75',
          // cls          : '...',
          // recurrenceRule : 'FREQ=WEEKLY;BYDAY=MO,TH;'
          recurrenceRule : 'FREQ=DAILY;'
        };
        // engine.features.timeRanges.store.add(timeSpan);
        this.configtimeRanges.push(stopTimeSpan);
      });
    }
    engine['timeRanges'] = this.configtimeRanges;
  }

  
  getHeaders(type: string) {
    let headers = [];
    switch (type) {
      case 'minuteAndHour':
        headers = [

        ]
        break;
      case 'hourAndDay':
        
        break;

      case 'dayAndWeek':
      
        break;
      case 'weekAndMonth':
        
        break;
      case 'monthAndYear':
        
        break;
      default:
        break;
    }

    return headers;
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const me = this;
    if (me.schedulerEngine) {
      // Iterate over all changes
      setTimeout(() => {
        this.iteration(changes).then(() => {});  
      }, 10);
      
    }
  }


   iteration(changes: SimpleChanges) {
    let me = this;
    return new Promise((resolve, reject) => {
      try {
        Object.entries(changes).forEach(([name, {currentValue}]) => {
          // Apply changes that match configs to grid
          if (me.configInputs.includes(name)) {
            if(name === 'viewPreset' || name === 'viewPeriod') {
              setTimeout(() => {
                this.executeViewPreset().then(() =>{});
              }, 5); 
            }  else {
              me.schedulerEngine[name] = currentValue;
            } 
          }
          if (me.featureInputs.includes(name)) {
            me.schedulerEngine[name] = currentValue;
          }
          if(name === 'stopCauseList'){
            setTimeout(() => {
              this.addStopCauseList2(me.schedulerEngine);
            }, 5);
          }
        });
        resolve('Ok');
      } catch (error) {
        reject(error);
      }
    }); 
  }
  async executeViewPreset() {
    let me = this;
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          me.schedulerEngine.viewPreset = this.viewPreset;
          me.schedulerEngine.viewPreset.headers[me.schedulerEngine.viewPreset.headers.length-1].increment = this.viewPeriod;
          me.schedulerEngine.presets = [{
            base: this.viewPreset,
            id: 'my'+this.viewPreset,
            headers : me.schedulerEngine.viewPreset.headers,
            timeResolution : {unit: me.schedulerEngine.viewPreset.headers[me.schedulerEngine.viewPreset.headers.length-1].unit, increment: this.viewPeriod}
          }]
          me.schedulerEngine.viewPreset  = 'my'+this.viewPreset;
          resolve('Completed');
        }, 3);
      } catch (error) {
        reject(error);
      }          
    });
   
    // if(me.schedulerEngine.viewPreset.data.headers) {
    //   me.schedulerEngine.viewPreset.data.headers[me.schedulerEngine.viewPreset.data.headers.length-1].increment = currentValue;
    //   me.schedulerEngine.viewPreset.data.timeResolution = {
    //     unit      : me.schedulerEngine.viewPreset.data.headers[me.schedulerEngine.viewPreset.data.headers.length-1].unit, 
    //     increment : me.schedulerEngine.viewPreset.data.headers[me.schedulerEngine.viewPreset.data.headers.length-1].increment
    //   };
    //   me.schedulerEngine['viewPreset'] = me.schedulerEngine.viewPreset;
    // }
  }

  removeEvent(eventId) {
    const scheduler = this.schedulerEngine;
    // scheduler.eventStore.remove(scheduler.selectedEvents);
    // this.selectedEvent = '';
    scheduler.eventStore.remove(eventId);
  }

  addEvent() {
    const scheduler = this.schedulerEngine,
      startDate = new Date(scheduler.startDate.getTime()),
      endDate = new Date(startDate.getTime());

    endDate.setHours(endDate.getHours() + 1);

    scheduler.eventStore.add({
      resourceId: scheduler.resourceStore.first.id,
      startDate: startDate,
      endDate: endDate,
      name: 'New task',
      eventType: 'Meeting'
    })
  }

  getSchedulerEngine() {
    return this.schedulerEngine;
  }


}
