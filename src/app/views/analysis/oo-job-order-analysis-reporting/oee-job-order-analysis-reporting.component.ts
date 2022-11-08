import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';

//models
import { environment } from 'environments/environment';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';

//services
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { OeeService } from 'app/services/dto-services/oee/oee-service';
import { DatePipe } from '@angular/common';
import { UIChart, MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { ShiftSettingsService } from 'app/services/dto-services/shift-setting/shift-setting.service';
import { TranslateService } from '@ngx-translate/core';
import { BookType } from 'xlsx';


@Component({
  templateUrl: './oee-job-order-analysis-reporting.html',
  styleUrls: ['./oee-job-order-analysis-reporting.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OeeJobOrderAnalysisReportingComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart: UIChart;

  modal = {
    active : false,
    stopCauseId: null,
    startDate: null,
    finishDate: null,
    shiftId: null, 
    workstationId: null
  }

  selectedWorkStation;
  display = false;
  selectedShift = null;
  filteredShift: any[];
  filterCon = {
    oeeReportId: 0,
    orderByDirection: null,
    orderByProperty: null,
    query: null,
    rangeStart: ConvertUtil.date2StartOfDay(new Date()),
    rangeEnd: new Date(),
    shiftId: null,
    plantId: null,
    showOnlySetupLoss: false,
    workcenterId: null,
    workstationId: null,
    pageNumber: 1,
    pageSize: 90
  };

  filterAverageOee = {
    oeeReportId: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 9,
    query: null,
    plantId: null,
    rangeEnd: null,
    rangeStart: null,
    shiftId: null,
    workcenterId: null,
    workstationId: null,
  }

  availability = 'Availability';
  performance = 'Performance';
  quality = 'Quality';

  chartModal = {
    active: false,
    data: null
  };

  selecteMenuItems: MenuItem[] = [
    {
      label: this._translateSvc.instant('export-csv'), icon: 'fa fa-file-archive-o',
      command: () => {
        this.exportCSV('csv');
      }
    },
    {
      label: this._translateSvc.instant('export-excel'), icon: 'fa b-fa-file-excel',
      command: () => {
        this.exportCSV('xlsx');
      }
    }
  ];

  selectedOees = [];
  selectedOeeAvgs = [];
  lossType: string = 'availability';
  pageFilter = {
    pageNumber: 1,
    pageSize: Number(environment.filterRowSize) ? Number(environment.filterRowSize) : 10,
    orderByProperty: null,
    orderByDirection: 'desc'
  };

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

  cols = [
    { field: 'dimension', header: 'dimension' },
    { field: 'availability', header: 'availability' },
    { field: 'performance', header: 'performance' },
    { field: 'quality', header: 'quality' },
    { field: 'oee', header: 'oee' },
    { field: 'plannedProductionTime', header: 'planned-product-time' },
    { field: 'runTime', header: 'run-time' },
    { field: 'netRunTime', header: 'net-run-time' },
    { field: 'fullyProductiveTime', header: 'fully-productive-time' },
  ];


  treeData;
  jobOrderReportData: any = {
    oee: null,
    availability: null,
    performance: null,
    quality: null,
    teep: null,
    plannedProductionTime: null,
    runTime: null,
    availabilityLost: null,
    availabilityLostPercentage: null,
    qualityLostPercentage: null,
    performanceLostPercentage: null,
    scheduleLostPercentage: null,
    scheduleLost: null,
    netRunTime: null,
    realPerformance: null,
    realNetRunTime: null,
    realFullyProductiveTime: null,
    performanceLost: null,
    fullyProductiveTime: null,
    qualityLost: null,
    goodCount: null,
    scrapCount: null,
    reportItemList: null,
    qualityLossScrapReasonList: null,
    topQualityLostList: null,
    topSetupAvailabilityLostList: null,
    scheduleLossReasonList: null,
    topPerformanceLostList: null,
    topPerformanceLostReasonList: null,
    topAvailabilityLostList: null
  }
  options: any;
  plantId: any;
  data: any;
  performanceGraphOptions: any;
  qualityGraphOptions: any;
  availabilityLossGraphOptions: any;
  myOriginalOeeReport2Items: any;
  averageCurntWsOeeBetweenDate: any;
  averageCurntWsOeeTillEndDate: any;
  averageAllWsOeeBetweenDate: any;
  averageAllWsOeeTillEndDate: any;
  sub: Subscription;

  showAllTarget = true;
  showAllAverages = true;
  showAllDay = true;
  showAllShift = true;
  showLineview = true;
  showBarview = false;
  showWeekly = true;
  showDaily = false;
  showMonthly= false;
  shiftList: any;
  averageOeeReportJobTrendData: any;

  constructor(private utilities: UtilitiesService,
    private loader: LoaderService,
    private _oeeSvc: OeeService,
    private appStateService: AppStateService,
    private shiftService: ShiftSettingsService,
    private _translateSvc: TranslateService,
    private datePipe: DatePipe) {

  }

  ngOnInit() {
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (res) {
        this.plantId = res.plantId;
        this.filterCon.plantId = this.plantId;
        this.filterAverageOee.plantId = this.plantId;
        
        this.shiftService.getShiftSettingsListByPlantId(this.filterCon.plantId).then((res: any) => {
          this.shiftList = res;
        });
        this.selectedShift = null;
        this.shiftService.getShiftByPlantAndCurrentDate(this.filterCon.plantId).then((res: any) => {
          this.selectedShift = res;
          this.selectedShift.startTime = ConvertUtil.UTCTime2LocalTime(this.selectedShift.startTime);
          this.selectedShift.endTime = ConvertUtil.UTCTime2LocalTime(this.selectedShift.endTime);
          this.filterCon.shiftId = this.selectedShift.shiftId;
          if(this.selectedShift.startTime && this.filterCon.rangeStart) {
            let splitedTime = this.selectedShift.startTime.split(":");
            this.filterCon.rangeStart = new Date(this.filterCon.rangeStart);
            this.filterCon.rangeStart.setHours(splitedTime[0]);
            this.filterCon.rangeStart.setMinutes(splitedTime[1]);
            this.filterCon.rangeStart.setSeconds(splitedTime[2]);

          }
          if(this.selectedShift.endTime && this.filterCon.rangeEnd) {
            let splitedTime = this.selectedShift.endTime.split(":");
            this.filterCon.rangeEnd = new Date(this.filterCon.rangeEnd);
            this.filterCon.rangeEnd.setHours(splitedTime[0]);
            this.filterCon.rangeEnd.setMinutes(splitedTime[1]);
            this.filterCon.rangeEnd.setSeconds(splitedTime[2]);
          }
          if(this.filterCon.rangeStart) {
            this.analyze();
          }
          // this.analyze();
        }).catch(err =>  console.error(err));
      } else {
        // this.plantId = res.plantId;
      }
    });
    this.setChartOptions();
    this.setPerformanceOptions();
    this.setQualityGraphOptions();
    this.setAvailabilityLossGraphOptions()



    // this.analyze();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
  onShiftChanged(shft) {
    if(shft) {
      let shift = JSON.parse(JSON.stringify(shft));
      this.filterCon.shiftId = shift.shiftId;
      shift.startTime = ConvertUtil.UTCTime2LocalTime(shift.startTime);
      shift.endTime = ConvertUtil.UTCTime2LocalTime(shift.endTime);
      if(shift.startTime && this.filterCon.rangeStart) {
        let splitedTime = shift.startTime.split(":");
        this.filterCon.rangeStart = new Date(this.filterCon.rangeStart);
        this.filterCon.rangeStart = new Date(this.filterCon.rangeStart.getFullYear(), this.filterCon.rangeStart.getMonth(), this.filterCon.rangeStart.getDate())
        this.filterCon.rangeStart.setHours(splitedTime[0]);
        this.filterCon.rangeStart.setMinutes(splitedTime[1]);
        this.filterCon.rangeStart.setSeconds(splitedTime[2]);

      }
      if(shift.endTime && this.filterCon.rangeEnd) {
        let splitedTime = shift.endTime.split(":");
        this.filterCon.rangeEnd = new Date(this.filterCon.rangeEnd);
        this.filterCon.rangeEnd = new Date(this.filterCon.rangeEnd.getFullYear(), this.filterCon.rangeEnd.getMonth(), this.filterCon.rangeEnd.getDate())
        this.filterCon.rangeEnd.setHours(splitedTime[0]);
        this.filterCon.rangeEnd.setMinutes(splitedTime[1]);
        this.filterCon.rangeEnd.setSeconds(splitedTime[2]);
      }
    } else {
      this.filterCon.shiftId=null;
      this.filterCon.rangeStart = ConvertUtil.date2StartOfDay(this.filterCon.rangeStart);
      this.filterCon.rangeEnd = ConvertUtil.date2EndOfDay(this.filterCon.rangeEnd);
      // shift.endTime = ConvertUtil.UTCTime2LocalTime(shift.endTime);
    }
    // this.analyze();
    // const day = ConvertUtil.localDateShiftAsUTC(this.filterModel.day);
    // this.filterChangeData = Object.assign({}, this.filterModel, {day: day});
    // this.selectedShift = shift;
  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId, 'OEE Job Order Analysis Reporting.jpeg', 'Export as Image Successful');
  }

  skipWorkstation = false;

  analyze() {

    // if(this.skipWorkstation==false) {
    //   if(!this.filterCon.workstationId) {
    //     this.utilities.showWarningToast('please-select-workstation');
    //     return;
    //   }
    // }
 

    this.treeData = null;
    this.loader.showLoader();
    const temp = Object.assign({}, this.filterCon);
    // 3rd Request
    const filterAverageCurntWsOeeTillEndDate = Object.assign({}, temp);
    filterAverageCurntWsOeeTillEndDate.rangeStart = null;
    // 4th Request
    const filterAverageAllWsOeeBetweenDate = Object.assign({}, temp);
    filterAverageAllWsOeeBetweenDate.workstationId = null;
    filterAverageAllWsOeeBetweenDate.workcenterId = null;
    // 5th Request
    const filterAverageAllWsOeeTillEndDate = Object.assign({}, temp);
    filterAverageAllWsOeeTillEndDate.workstationId = null;
    filterAverageAllWsOeeTillEndDate.workcenterId = null;
    filterAverageAllWsOeeTillEndDate.rangeStart = null;
     // 6th Request
     const getAverageOeeReportJobTrendFilter: any = Object.assign({}, temp);
     getAverageOeeReportJobTrendFilter.weekly = this.showWeekly;
     getAverageOeeReportJobTrendFilter.monthly = this.showMonthly;
    //  getAverageOeeReportJobTrendFilter.dayly = this.showDaily;

    Promise.all([
      this._oeeSvc.getOeeReport2(temp),
      this._oeeSvc.getAverageOeeReportJob(temp),
      this._oeeSvc.getAverageOeeReportJob(filterAverageCurntWsOeeTillEndDate),
      this._oeeSvc.getAverageOeeReportJob(filterAverageAllWsOeeBetweenDate),
      this._oeeSvc.getAverageOeeReportJob(filterAverageAllWsOeeTillEndDate),
      this._oeeSvc.getAverageOeeReportJobTrend(getAverageOeeReportJobTrendFilter),
    ]).then((result: any) => {

      if(result) {
        const result1 = result[0]
        if (result1.reportItemList) {
          const filter = result1.reportItemList.content.map((item) => {
            item.dimension = this.datePipe.transform(item.dimension, 'dd.MM.yyyy');
            return item;
          })
          this.treeData = this.detailList2Node(filter);
          this.pagination.currentPage = result1.reportItemList.currentPage;
          this.pagination.totalElements = this.getMultiLength(this.treeData);
          this.pagination.totalPages = result1.reportItemList.totalPages;
        }
        this.myOriginalOeeReport2Items = result1;
        /// second Result Data
        this.averageCurntWsOeeBetweenDate = result[1];
        this.averageCurntWsOeeBetweenDate['type'] = 'Avg. Curr. Ws';
        this.averageCurntWsOeeBetweenDate.workstationId = this.filterCon.workstationId;
        // 3rd Result Data
        this.averageCurntWsOeeTillEndDate = result[2];
        this.averageCurntWsOeeTillEndDate['type'] = 'Avg. Curr. Ws Till End';
        this.averageCurntWsOeeTillEndDate.workstationId = this.filterCon.workstationId;
        // 4th Result Data
        this.averageAllWsOeeBetweenDate = result[3];
        this.averageAllWsOeeBetweenDate['type'] = 'Avg. All. Ws Between Dates';
        this.averageAllWsOeeBetweenDate.workstationId = this.filterCon.workstationId;
        // 5th Result Data
        this.averageAllWsOeeTillEndDate = result[4];
        this.averageAllWsOeeTillEndDate['type'] = 'Avg. All. Ws Till End';
        this.averageAllWsOeeTillEndDate.workstationId = this.filterCon.workstationId;
        // 6th Result Data
        this.averageOeeReportJobTrendData = result[5];
        this.averageOeeReportJobTrendData['type'] = 'Trend';
        this.averageOeeReportJobTrendData.workstationId = this.filterCon.workstationId;

      }
      this.loader.hideLoader();
      this.setJobOrderOEEReport(this.myOriginalOeeReport2Items,
        this.averageCurntWsOeeBetweenDate,
        this.averageCurntWsOeeTillEndDate,
        this.averageAllWsOeeBetweenDate,
        this.averageAllWsOeeTillEndDate,
        this.averageOeeReportJobTrendData);
      
    }).catch(err => {
      this.loader.hideLoader();
      console.error(err);
      this.utilities.showErrorToast(err);
    });

  }

  getMultiLength(array) {
    var sum = 0;
    for (var count = 0; count < array.length; count++) {
      if(array[count] && array[count].children && array[count].children.length > 0) {
        if((array[count].data.jobOrderId === 0) || (array[count].data.quality == 0 )) {
        } else {
          sum = sum + this.getMultiLength(array[count].children);
        }
      } else {
        if((array[count].data.jobOrderId === 0) || (array[count].data.quality == 0 )) {
        } else {
          if(array[count].data.jobOrderId !== null) {
            sum = sum +1;
          }
        }
      }

      
    }
    return sum;
  }

  detail2Node(detail) {
    const me = this;
    let node = null;

    if (detail) {
      node = {
        data: Object.assign({}, detail,
          { availability: this.getPercentage(detail.availability) },
          { quality: this.getPercentage(detail.quality) },
          { performance: this.getPercentage(detail.performance) },
          { oee: this.getPercentage(detail.oee) },
          { plannedProductionTime: this.getReadableTime(detail.plannedProductionTime * 1000) },
          { productionTime: this.getReadableTime(detail.productionTime * 1000) },
          { runTime: this.getReadableTime(detail.runTime * 1000) },
          { netRunTime: this.getReadableTime(detail.netRunTime * 1000) },
          { fullyProductiveTime: this.getReadableTime(detail.fullyProductiveTime * 1000) },
          { children: null }
        ),
        children: detail.children ? me.detailList2Node(detail.children) : [],
        key:
          ConvertUtil.getSimpleUId(),
        expanded: !!detail.expanded
      }
        ;
      return node;
    }
    return node;

  }

  detailList2Node(detailList) {
    const me = this;
    const list = [];

    if (detailList) {

      detailList.forEach((item) => {
        if(item.quality == 0 || item.jobOrderId === 0) {
        } else {
          const treeNode = me.detail2Node(item);
          list.push(treeNode);
        }
      });

    }
    return list;
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
    this.pageFilter.pageNumber = this.pagination.pageNumber;
    this.pageFilter.pageSize = this.pagination.pageSize;

    this.filterCon.pageNumber = this.pageFilter.pageNumber;
    this.filterCon.pageSize = this.pageFilter.pageSize;
    setTimeout(() => {
      this.analyze()
    }, 500);
  }

  private normalizeAvgValues(res: any) {
    res.availability = this.getPercentage(res.availability);
    res.quality = this.getPercentage(res.quality);
    res.oee1 = this.getPercentage(res.oee1);
    res.oee2 = this.getPercentage(res.oee2);
    res.actualPerformance = this.getPercentage(res.actualPerformance);
    res.workPerformance = this.getPercentage(res.workPerformance);
    res.teep = this.getPercentage(res.teep);
    res.utilization = this.getPercentage(res.utilization);
    res.fullyProductiveTime = this.getReadableTime(res.fullyProductiveTime * 1000); // server returns in millisecond format.
    res.hiddenFactory = this.getReadableTime(res.hiddenFactory);
  }

  setJobOrderOEEReport(data: any, averageCurntWsOeeBetweenDate,
    averageCurntWsOeeTillEndDate,
    averageAllWsOeeBetweenDate,
    averageAllWsOeeTillEndDate, averageOeeReportJobTrendData) {
    //convert percentage value
    this.jobOrderReportData.oee = this.getPercentageVal(data.oee);
    this.jobOrderReportData.availability = this.getPercentageVal(data.availability);
    this.jobOrderReportData.performance = this.getPercentageVal(data.performance);
    this.jobOrderReportData.quality = this.getPercentageVal(data.quality);
    this.jobOrderReportData.teep = this.getPercentageVal(data.teep);
    this.jobOrderReportData.availabilityLostPercentage = data.availabilityLostPercentage;
    this.jobOrderReportData.scheduleLostPercentage = data.scheduleLostPercentage;
    this.jobOrderReportData.performanceLostPercentage = data.performanceLostPercentage;
    this.jobOrderReportData.qualityLostPercentage = data.qualityLostPercentage;
    this.jobOrderReportData.scheduleLossReasonList = data.scheduleLossReasonList;

    //readable time
    this.jobOrderReportData.plannedProductionTime = this.getReadableTime(data.plannedProductionTime * 1000)
    this.jobOrderReportData.runTime = this.getReadableTime(data.runTime * 1000);
    this.jobOrderReportData.availabilityLost = this.getReadableTime(data.availabilityLost * 1000);
    this.jobOrderReportData.scheduleLost = this.getReadableTime(data.scheduleLost * 1000);
    this.jobOrderReportData.netRunTime = this.getReadableTime(data.netRunTime * 1000);
    this.jobOrderReportData.realPerformance = this.getReadableTime(data.realPerformance);
    this.jobOrderReportData.realNetRunTime = this.getReadableTime(data.realNetRunTime * 1000);

    this.jobOrderReportData.fullyProductiveTime = this.getReadableTime(data.fullyProductiveTime * 1000);
    this.jobOrderReportData.realFullyProductiveTime = this.getReadableTime(data.realFullyProductiveTime * 1000);
    this.jobOrderReportData.performanceLost = this.getReadableTime(data.performanceLost * 1000);
    this.jobOrderReportData.qualityLost = this.getReadableTime(data.qualityLost * 1000);
    this.jobOrderReportData.goodCount = data.goodCount;
    this.jobOrderReportData.scrapCount = data.scrapCount;

    if (data.topAvailabilityLostList) {
      //sort higher to lower
      this.jobOrderReportData.topAvailabilityLostList = data.topAvailabilityLostList.sort((n1, n2) => n2.actualStopDuration - n1.actualStopDuration);

    } else {
      this.jobOrderReportData.topAvailabilityLostList = [];
    }
    if (data.topPerformanceLostList) {
      this.jobOrderReportData.topPerformanceLostList = data.topPerformanceLostList.filter(itm => itm.jobOrderId !==0).sort(
        (n1, n2) => n2.performanceLoss - n1.performanceLoss);

    } else {
      this.jobOrderReportData.topPerformanceLostList = []
    }
    if (data.topPerformanceLostReasonList) {
      this.jobOrderReportData.topPerformanceLostReasonList = data.topPerformanceLostReasonList.sort(
        (n1, n2) => n2.actualStopDuration - n1.actualStopDuration);

    } else {
      this.jobOrderReportData.topPerformanceLostReasonList = [];
    }
    if(data.qualityLossScrapReasonList) {
      this.jobOrderReportData.qualityLossScrapReasonList = data.qualityLossScrapReasonList.sort(
        (n1, n2) => n2.scrapCausePercentage - n1.scrapCausePercentage);
    } else {
      this.jobOrderReportData.qualityLossScrapReasonList = [];
    }

    if (data.topQualityLostList) {
      this.jobOrderReportData.topQualityLostList = data.topQualityLostList.filter(itm => itm.rejectedPieces !== 0);
      //check first if qualitylost scrap count is same for all or not
      // var ids = new Set(data.topQualityLostList.map(d => d.scrapCount));
      // if (ids.size === 1) {
      //   this.jobOrderReportData.topQualityLostList = data.topQualityLostList.sort(
      //     (n1, n2) => (n2.scrapCount + n2.goodCount) - (n1.scrapCount + n1.goodCount));
      // } else {
      //   this.jobOrderReportData.topQualityLostList = data.topQualityLostList.sort(
      //     (n1, n2) => n2.scrapCount - n1.scrapCount);
      // }
    } else {
      this.jobOrderReportData.topQualityLostList = [];
    }

    if (data.topSetupAvailabilityLostList) {
      this.jobOrderReportData.topSetupAvailabilityLostList = [...data.topSetupAvailabilityLostList];
    } else {
      this.jobOrderReportData.topSetupAvailabilityLostList = [];
    }
    
    if (data.reportItemList) {
      this.jobOrderReportData.reportItemList = data.reportItemList.content;
      this.drawReportGraphs(data.reportItemList.content, 'oee', averageCurntWsOeeBetweenDate,
        averageCurntWsOeeTillEndDate,
        averageAllWsOeeBetweenDate,
        averageAllWsOeeTillEndDate, 
        averageOeeReportJobTrendData);
    } else {
      this.jobOrderReportData.reportItemList = [];
      this.drawReportGraphs(this.jobOrderReportData.reportItemList, 'oee', averageCurntWsOeeBetweenDate,
      averageCurntWsOeeTillEndDate,
      averageAllWsOeeBetweenDate,
      averageAllWsOeeTillEndDate,
      averageOeeReportJobTrendData);
    }
  }

  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(1) + '%';
    }
    return '';
  }

  getPercentageVal(val) {
    if (val) {
      return Number((val * 100).toFixed(1));
    }
    return 0;
  }

  getReadableTime(time) {
    return ConvertUtil.longDuration2DHHMMSSTime(time)
  }

  seconds2Min(seconds) {
    if (seconds) {
      return seconds / 60;
    }
    return 0;
  }
  setSelectedWorkStation(event) {
    if (event && event.hasOwnProperty('workStationId')) {
      this.filterCon.workstationId = event.workStationId;
      this.selectedWorkStation = event;
    } else {
      this.selectedWorkStation = null;
      this.filterCon.workstationId = null;
    }
  }
  setSelectedWorkcenter(event) {
    if (event) {
      this.filterCon.workcenterId = event.workCenterId;
    } else {
      this.filterCon.workcenterId = null;
    }
  }

  setChartOptions() {
    this.options = {
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
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        }
      },
    };
  }

  setQualityGraphOptions() {
    this.qualityGraphOptions = {
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
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Pieces',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        }
      }
    };
  }
  setPerformanceOptions() {
    this.performanceGraphOptions = {
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
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Minutes',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        }
      },
      tooltips: {
        enable: true,
        callbacks: {
          label: function (tooltipItem, data, abc) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            if (tooltipItem.datasetIndex > 6) {
              label += ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
            } else {
              label += tooltipItem.yLabel;
            }
            return label;
          }
        }
      },
    };
  }
  setAvailabilityLossGraphOptions() {
    this.availabilityLossGraphOptions = {
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
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: '%',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Minutes',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        },
      //   onClick: function(e, legendItem) {
      //     var index = legendItem.datasetIndex;
      //     var ci = this.chart;
      //     var meta = ci.getDatasetMeta(index);

      //     // See controller.isDatasetVisible comment
      //     meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

      //     // We hid a dataset ... rerender the chart
      //     ci.update();
      // }
      },
      tooltips: {
        enable: true,
        callbacks: {
          label: function (tooltipItem, data, abc) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            if (tooltipItem.datasetIndex > 5) {
              label += ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
            } else {
              label += tooltipItem.yLabel;
            }
            return label;
          }
        }
      }
    };
  }
  drawReportGraphs(data, graph: string = 'oee', 
  averageCurntWsOeeBetweenDate = this.averageCurntWsOeeBetweenDate,
  averageCurntWsOeeTillEndDate = this.averageCurntWsOeeTillEndDate,
  averageAllWsOeeBetweenDate = this.averageAllWsOeeBetweenDate,
  averageAllWsOeeTillEndDate= this.averageAllWsOeeTillEndDate,
  averageOeeReportJobTrendData = this.averageOeeReportJobTrendData) {

    // this.lossType = graph;

    this.data = null;
    var labels = [];
    //oee
    var oeeShifts = [];
    var oeeDay = [];
    var oeeAvgCurntWsBetweenDate = [];
    var oeeAvgCurntWsTillEndDate = [];
    var oeeAvgAllWsBetweenDate = [];
    var oeeAvgAllWsTillEndDate = [];

    var averageOeeReportJobTrendDate = [];
    //quanity
    var totalQuantityByShift = [];
    var totalQuantityByDay = [];
    var scrapByShift = [];
    var scrapByDay = [];

    //Target
    let targetAvailability = [];
    let targetOee = [];
    let targetPerformance = [];
    let targetQuality = [];
    let targetTeep = [];

    //performance
    var runTimeByShift = [];
    var runTimeByDay = [];
    var netRunTimeByShift = [];
    var netRunTimeByDay = [];

    //availability

    var plannedProductionTimeByShift = [];
    var plannedProductionTimeByDay = [];

    var myItems = data.map(obj => ({ ...obj })).reverse();

    //sort by date
    myItems = myItems.sort((n1, n2) => {
      var dateA:any = new Date(n1.day);
      var dateB:any = new Date(n2.day);
      return dateA - dateB;
    });

    myItems.map((obj) => {
      obj.children.forEach(element => {
        labels.push(this.datePipe.transform(element.day, 'dd.MM.yyyy') + ' ' + element.dimension);
        oeeDay.push(this.getPercentageVal(obj[graph]));
        if(graph === 'oee') {
          // if(this.filterCon.workstationId) {
            oeeAvgCurntWsBetweenDate.push(this.jobOrderReportData.oee);
          // } else {
            // oeeAvgCurntWsBetweenDate.push(this.getPercentageVal(averageCurntWsOeeBetweenDate.oee1))
          // }
          oeeAvgCurntWsTillEndDate.push(this.getPercentageVal(averageCurntWsOeeTillEndDate.oee1))
          if(!this.filterCon.workstationId) {
            oeeAvgAllWsBetweenDate.push(this.jobOrderReportData.oee);
          } else {
            oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.oee1))
          }
          oeeAvgAllWsTillEndDate.push(this.getPercentageVal(averageAllWsOeeTillEndDate.oee1))
        
          let data = undefined;
          averageOeeReportJobTrendData.forEach(jbTrend => {
            let date1 = new Date(element.day);
            let splitterDate = jbTrend.groupDate.split('-');
            let date2 = new Date(splitterDate[2]+ '-'+ (Number(splitterDate[1]) < 10 ? '0'+splitterDate[1]: splitterDate[1]) + '-'+ splitterDate[0]);
            if(date2.getTime() <= date1.getTime()) {
              data = jbTrend.oee1;
            }
          });
          averageOeeReportJobTrendDate.push(this.getPercentageVal(data));


          // Target
          if(this.selectedWorkStation) {
            targetOee.push(this.selectedWorkStation.targetOee | 0)
          }
        } else if(graph === 'availability') {
          oeeAvgCurntWsBetweenDate.push(this.jobOrderReportData.availability);
          // oeeAvgCurntWsBetweenDate.push(this.getPercentageVal(averageCurntWsOeeBetweenDate.availability))
          oeeAvgCurntWsTillEndDate.push(this.getPercentageVal(averageCurntWsOeeTillEndDate.availability))
          if(!this.filterCon.workstationId) {
            oeeAvgAllWsBetweenDate.push(this.jobOrderReportData.availability);
          } else {
            oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.availability))
          }
          // oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.availability))
          oeeAvgAllWsTillEndDate.push(this.getPercentageVal(averageAllWsOeeTillEndDate.availability))
          // Target
          if(this.selectedWorkStation) {
            targetAvailability.push(this.selectedWorkStation.targetAvailability | 0)
          }

          let data = undefined;
          averageOeeReportJobTrendData.forEach(jbTrend => {
            let date1 = new Date(element.day);
            let splitterDate = jbTrend.groupDate.split('-');
            let date2 = new Date(splitterDate[2]+ '-'+ (Number(splitterDate[1]) < 10 ? '0'+splitterDate[1]: splitterDate[1]) + '-'+ splitterDate[0]);
            if(date2.getTime() <= date1.getTime()) {
              data = jbTrend.availability;
            }
          });
          averageOeeReportJobTrendDate.push(this.getPercentageVal(data));
        } else if(graph === 'performance') {
          oeeAvgCurntWsBetweenDate.push(this.jobOrderReportData.performance);
          // oeeAvgCurntWsBetweenDate.push(this.getPercentageVal(averageCurntWsOeeBetweenDate.actualPerformance))
          oeeAvgCurntWsTillEndDate.push(this.getPercentageVal(averageCurntWsOeeTillEndDate.actualPerformance))
          if(!this.filterCon.workstationId) {
            oeeAvgAllWsBetweenDate.push(this.jobOrderReportData.performance);
          } else {
            oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.actualPerformance))
          }
          // oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.actualPerformance))
          oeeAvgAllWsTillEndDate.push(this.getPercentageVal(averageAllWsOeeTillEndDate.actualPerformance))
          if(this.selectedWorkStation) {
            targetPerformance.push(this.selectedWorkStation.targetPerformance | 0)
          }
          let data = undefined;
          averageOeeReportJobTrendData.forEach(jbTrend => {
            let date1 = new Date(element.day);
            let splitterDate = jbTrend.groupDate.split('-');
            let date2 = new Date(splitterDate[2]+ '-'+ (Number(splitterDate[1]) < 10 ? '0'+splitterDate[1]: splitterDate[1]) + '-'+ splitterDate[0]);
            if(date2.getTime() <= date1.getTime()) {
              data = jbTrend.actualPerformance;
            }
          });
          averageOeeReportJobTrendDate.push(this.getPercentageVal(data));
        } else if(graph === 'quality') {
          oeeAvgCurntWsBetweenDate.push(this.jobOrderReportData.quality);
          // oeeAvgCurntWsBetweenDate.push(this.getPercentageVal(averageCurntWsOeeBetweenDate.quality))
          oeeAvgCurntWsTillEndDate.push(this.getPercentageVal(averageCurntWsOeeTillEndDate.quality))
          if(!this.filterCon.workstationId) {
            oeeAvgAllWsBetweenDate.push(this.jobOrderReportData.quality);
          } else {
            oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.quality))
          }
          // oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.quality))
          oeeAvgAllWsTillEndDate.push(this.getPercentageVal(averageAllWsOeeTillEndDate.quality))
          if(this.selectedWorkStation) {
            targetQuality.push(this.selectedWorkStation.targetQuality | 0)
          }

          let data = undefined;
          averageOeeReportJobTrendData.forEach(jbTrend => {
            let date1 = new Date(element.day);
            let splitterDate = jbTrend.groupDate.split('-');
            let date2 = new Date(splitterDate[2]+ '-'+ (Number(splitterDate[1]) < 10 ? '0'+splitterDate[1]: splitterDate[1]) + '-'+ splitterDate[0]);
            if(date2.getTime() <= date1.getTime()) {
              data = jbTrend.quality;
            }
          });
          averageOeeReportJobTrendDate.push(this.getPercentageVal(data));
          
        } else if (graph === 'teep') {
          oeeAvgCurntWsBetweenDate.push(this.jobOrderReportData.teep);
          // oeeAvgCurntWsBetweenDate.push(this.getPercentageVal(averageCurntWsOeeBetweenDate.teep))
          oeeAvgCurntWsTillEndDate.push(this.getPercentageVal(averageCurntWsOeeTillEndDate.teep))
          // oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.teep))
          if(!this.filterCon.workstationId) {
            oeeAvgAllWsBetweenDate.push(this.jobOrderReportData.teep);
          } else {
            oeeAvgAllWsBetweenDate.push(this.getPercentageVal(averageAllWsOeeBetweenDate.teep))
          }
          oeeAvgAllWsTillEndDate.push(this.getPercentageVal(averageAllWsOeeTillEndDate.teep))
          if (this.selectedWorkStation) {
            targetTeep.push(this.selectedWorkStation.targetTeep | 0)
          }

          let data = undefined;
          averageOeeReportJobTrendData.forEach(jbTrend => {
            let date1 = new Date(element.day);
            let splitterDate = jbTrend.groupDate.split('-');
            let date2 = new Date(splitterDate[2]+ '-'+ (Number(splitterDate[1]) < 10 ? '0'+splitterDate[1]: splitterDate[1]) + '-'+ splitterDate[0]);
            if(date2.getTime() <= date1.getTime()) {
              data = jbTrend.teep;
            }
          });
          averageOeeReportJobTrendDate.push(this.getPercentageVal(data));
        }
        oeeShifts.push(this.getPercentageVal(element[graph]));
        totalQuantityByShift.push(element.scrapCount + element.goodCount);
        totalQuantityByDay.push(obj.scrapCount + obj.goodCount);
        scrapByDay.push(obj.scrapCount);
        scrapByShift.push(element.scrapCount);
        runTimeByShift.push(this.seconds2Min(element.runTime));
        runTimeByDay.push(this.seconds2Min(obj.runTime));
        netRunTimeByShift.push(this.seconds2Min(element.netRunTime));
        netRunTimeByDay.push(this.seconds2Min(obj.netRunTime));
        plannedProductionTimeByShift.push(this.seconds2Min(element.plannedProductionTime));
        plannedProductionTimeByDay.push(this.seconds2Min(obj.plannedProductionTime));


      });
    });

    // let targets = {
    //   targetAvailability, targetOee,targetPerformance,targetQuality,targetTeep
    // }

    if (graph == 'oee') {
      this.drawDefaultGraph(labels, oeeShifts, oeeDay, oeeAvgCurntWsBetweenDate,
        oeeAvgCurntWsTillEndDate,
        oeeAvgAllWsBetweenDate,
        oeeAvgAllWsTillEndDate, targetOee, averageOeeReportJobTrendDate);
    } else if (graph == 'availability') {
      this.drawAvailabilityLossGraph(labels, oeeDay, oeeShifts, runTimeByShift, runTimeByDay,
         plannedProductionTimeByShift, plannedProductionTimeByDay,
         oeeAvgCurntWsBetweenDate,
        oeeAvgCurntWsTillEndDate,
        oeeAvgAllWsBetweenDate,
        oeeAvgAllWsTillEndDate, targetAvailability, averageOeeReportJobTrendDate);
    } else if (graph == 'performance') {
      this.drawPerformanceGraph(labels, oeeDay, oeeShifts, runTimeByShift, runTimeByDay, netRunTimeByShift, netRunTimeByDay,
        oeeAvgCurntWsBetweenDate,
        oeeAvgCurntWsTillEndDate,
        oeeAvgAllWsBetweenDate,
        oeeAvgAllWsTillEndDate, targetPerformance, averageOeeReportJobTrendDate);
    } else if (graph == 'quality') {
      this.drawQualityGraph(labels, oeeDay, oeeShifts, totalQuantityByShift, totalQuantityByDay, scrapByShift, scrapByDay,
        oeeAvgCurntWsBetweenDate,
        oeeAvgCurntWsTillEndDate,
        oeeAvgAllWsBetweenDate,
        oeeAvgAllWsTillEndDate, targetQuality, averageOeeReportJobTrendDate);
    }else if (graph == 'teep') {
      // this.drawTeepGraph(labels, oeeDay, oeeShifts, totalQuantityByShift, totalQuantityByDay, scrapByShift, scrapByDay,
      //   oeeAvgCurntWsBetweenDate,
      //   oeeAvgCurntWsTillEndDate,
      //   oeeAvgAllWsBetweenDate,
      //   oeeAvgAllWsTillEndDate,targetTeep);
    }
  }
  drawDefaultGraph(labels, oeeShifts, oeeDay, oeeAvgCurntWsBetweenDate,
    oeeAvgCurntWsTillEndDate,
    oeeAvgAllWsBetweenDate,
    oeeAvgAllWsTillEndDate, target, averageOeeReportJobTrendDate) {
    this.data = {
      labels: labels,
      datasets: [
        {
          label: `OEE by Shift`,
          data: oeeShifts,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#17b625',
          borderColor: '#17b625'
        },
        {
          label: `OEE by Day`,
          data: oeeDay,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#cc9f42',
          borderColor: '#cc9f42'
        },
        {

          label: 'AVG Curnt. Ws. Btw. Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#ff9c3d',
          borderColor: '#ff9c3d',
          data: oeeAvgCurntWsBetweenDate
        }, {

          label: 'AVG Curnt. Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#9e76ff',
          borderColor: '#9e76ff',
          data: oeeAvgCurntWsTillEndDate
        }, {

          label: 'AVG All Ws Btw. Date.',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#51c6ff',
          backgroundColor: '#51c6ff',
          data: oeeAvgAllWsBetweenDate
        },
        {
          label: 'AVG All Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#9c1c3a',
          borderColor: '#9c1c3a',
          data: oeeAvgAllWsTillEndDate
        },
        {
          label: 'Target OEE',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#044682',
          borderColor: '#044682',
          data: target
        },
        {
          label: this.showWeekly? 'Weekly Trend' : 'Monthly Trend',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#229490',
          borderColor: '#229490',
          data: averageOeeReportJobTrendDate
        },
        // {
        //   label: 'Target OEE',
        //   pointStyle: 'rect',
        //   fill: false,
        //   pointBorderWidth: 1,
        //   backgroundColor: '#e35928',
        //   borderColor: '#e35928',
        //   data: targets.targetOee
        // },
        // {
        //   label: 'Target Quality',
        //   pointStyle: 'rect',
        //   fill: false,
        //   pointBorderWidth: 1,
        //   backgroundColor: '#645943',
        //   borderColor: '#645943',
        //   data: targets.targetQuality
        // },
        // {
        //   label: 'Target Teep',
        //   pointStyle: 'rect',
        //   fill: false,
        //   pointBorderWidth: 1,
        //   backgroundColor: '#abdbe3',
        //   borderColor: '#abdbe3',
        //   data: targets.targetTeep
        // }
      ]
    }

    setTimeout(() => {
      if(this.showBarview) {
        this.onShowAllBarChanged(this.showBarview);
      }
      this.onShowAllDayChanged(this.showAllDay);
      this.onShowAllShiftChanged(this.showAllShift);
      this.onShowAllAverageChanged(this.showAllAverages);
      this.onShowAllTargetChanged(this.showAllTarget);
    }, 100);
    // console.log(this.data.datasets);
  }

  getTotal = (reasons) => {
    if(reasons) {
      return reasons.reduce(((acc, item) => acc + item.rejectedPieces), 0);
    } else {
      return 0;
    }

  }
  
  getTotalQuantity = (reasons) => {
    if(reasons) {
      return reasons.reduce(((acc, item) => acc + (item.rejectedPieces + item.goodPieces)), 0);
    } else {
      return 0;
    }

  }
  getTotalPerformanceLostReason = (reasons) => {
    if(reasons) {
      return reasons.reduce(((acc, item) => acc + item.actualStopDuration), 0);
    } else {
      return 0;
    }
  }

  
  getTotalLoss = (losses) => {
    if(losses) {
      return losses.reduce(((acc, item) => acc + item.totalLostDuration), 0);
    } else {
      return 0;
    }
  }
  getPerformanceLostReasonTotalLoss = (losses) => {
    if(losses) {
      return losses.reduce(((acc, item) => acc + (item.actualStopDuration * 1000)), 0);
    } else {
      return 0;
    }
  }
  getTotalCost = (losses) => {
    if(losses) {
      return losses.reduce(((acc, item) => acc + item.actualCost), 0);
    } else {
      return 0;
    }
  }
  getTotalperformanceLostCost = (losses) => {
    if(losses) {
      return losses.reduce(((acc, item) => acc + item.performanceLostCost), 0);
    } else {
      return 0;
    }
  }

  drawAvailabilityLossGraph(labels, availabilityByDay, availabilityByShift,
     runTimeByShift, runTimeByDay, plannedProductionTimeByShift, plannedProductionTimeByDay,
     oeeAvgCurntWsBetweenDate,
        oeeAvgCurntWsTillEndDate,
        oeeAvgAllWsBetweenDate,
        oeeAvgAllWsTillEndDate, target, averageOeeReportJobTrendDate) {
    let availabilityLossGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Availability by Shift`,
          data: availabilityByShift,
          fill: false,
          order: 1,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#17b625',
          backgroundColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Availability by Day`,
          data: availabilityByDay,
          fill: false,
          order: 1,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9c9f42',
          backgroundColor: '#9c9f42'
        },
        {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Btw. Date',
          fill: false,
          order: 1,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          backgroundColor: '#ff9c3d',
          data: oeeAvgCurntWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Till End Date',
          fill: false,
          order: 1,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9e76ff',
          backgroundColor: '#9e76ff',
          data: oeeAvgCurntWsTillEndDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws Btw. Date.',
          fill: false,
          order: 1,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#51c6ff',
          backgroundColor: '#51c6ff',
          data: oeeAvgAllWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws. Till End Date',
          fill: false,
          order: 1,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff7b6a',
          backgroundColor: '#ff7b6a',
          data: oeeAvgAllWsTillEndDate
        },
        {
          yAxisID: "y-axis-1",
          label: 'Target Availability',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#044682',
          borderColor: '#044682',
          data: target
        },

        {
          yAxisID: "y-axis-2",
          label: `RunTime by Shift`,
          data: runTimeByShift,
          fill: false,
          order: 1,
         
          borderColor: '#be3bce',
          backgroundColor: '#be3bce'
        },
        {
          yAxisID: "y-axis-2",
          label: `RunTime by Day`,
          data: runTimeByDay,
          fill: false,
          order: 1,
        
          borderColor: '#c30f46',
          backgroundColor: '#c30f46'
        },
        {
          yAxisID: "y-axis-2",
          label: `Planned Production Time by Shift`,
          data: plannedProductionTimeByShift,
          fill: false,
          order: 1,
         
          borderColor: '#62d8cb',
          backgroundColor: '#62d8cb'
        },
        {
          yAxisID: "y-axis-2",
          label: `Planned Production Time by Day`,
          data: plannedProductionTimeByDay,
          fill: false,
          order: 1,
          borderColor: '#0f4ac3',
          backgroundColor: '#0f4ac3'
        },
        {
          label: this.showWeekly? 'Weekly Trend' : 'Monthly Trend',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#229490',
          borderColor: '#229490',
          data: averageOeeReportJobTrendDate
        },
      ]
    }
    this.data = availabilityLossGraphData;
    this.chart.options = this.availabilityLossGraphOptions;
    setTimeout(() => {
      if(this.showBarview) {
        this.onShowAllBarChanged(this.showBarview);
      }
      this.onShowAllDayChanged(this.showAllDay);
      this.onShowAllShiftChanged(this.showAllShift);
      this.onShowAllAverageChanged(this.showAllAverages);
      this.onShowAllTargetChanged(this.showAllTarget);
    }, 100);
  }
  drawPerformanceGraph(labels, performanceByDay, performanceByShift, runTimeByShift, runTimeByDay, netRunTimeByShift, netRunTimeByDay,
    oeeAvgCurntWsBetweenDate,
    oeeAvgCurntWsTillEndDate,
    oeeAvgAllWsBetweenDate,
    oeeAvgAllWsTillEndDate, target, averageOeeReportJobTrendDate) {
    let performanceGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Performance by Shift`,
          data: performanceByShift,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Performance by Day`,
          data: performanceByDay,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9c9f42'
        },
        {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Btw. Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: oeeAvgCurntWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9e76ff',
          data: oeeAvgCurntWsTillEndDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws Btw. Date.',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#51c6ff',
          data: oeeAvgAllWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff7b6a',
          data: oeeAvgAllWsTillEndDate
        },
        {
          yAxisID: "y-axis-1",
          label: 'Target Performance',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#eed7ae',
          borderColor: '#eed7ae',
          data: target
        },
        {
          yAxisID: "y-axis-2",
          label: `RunTime by Shift`,
          data: runTimeByShift,
          fill: false,
          borderColor: '#be3bce'
        },
        {
          yAxisID: "y-axis-2",
          label: `RunTime by Day`,
          data: runTimeByDay,
          fill: false,
          borderColor: '#c30f46'
        },
        {
          yAxisID: "y-axis-2",
          label: `Net Run Time Shift`,
          data: netRunTimeByShift,
          fill: false,
          borderColor: '#62d8cb'
        },
        {
          yAxisID: "y-axis-2",
          label: `Net Run Time by Day`,
          data: netRunTimeByDay,
          fill: false,
          borderColor: '#0f4ac3'
        },
        {
          label: this.showWeekly? 'Weekly Trend' : 'Monthly Trend',
          pointStyle: 'rect',
          fill: false,
          pointBorderWidth: 1,
          backgroundColor: '#229490',
          borderColor: '#229490',
          data: averageOeeReportJobTrendDate
        },
      ]
    }
    this.data = performanceGraphData;
    // this.options = this.performanceGraphOptions;
    this.chart.options = this.performanceGraphOptions;
    setTimeout(() => {
      if(this.showBarview) {
        this.onShowAllBarChanged(this.showBarview);
      }
      this.onShowAllDayChanged(this.showAllDay);
      this.onShowAllShiftChanged(this.showAllShift);
      this.onShowAllAverageChanged(this.showAllAverages);
      this.onShowAllTargetChanged(this.showAllTarget);
    }, 100);
  }

  drawQualityGraph(labels, qualityByDay, qualityByShift, totalQuantityByShift, totalQuantityByDay, scrapByShift, scrapByDay,
    oeeAvgCurntWsBetweenDate,
    oeeAvgCurntWsTillEndDate,
    oeeAvgAllWsBetweenDate,
    oeeAvgAllWsTillEndDate,target, averageOeeReportJobTrendDate) {
    let qualityGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Quality by Shift`,
          data: qualityByShift,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Quality by Day`,
          data: qualityByDay,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9c9f42'
        },
        {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Btw. Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: oeeAvgCurntWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9e76ff',
          data: oeeAvgCurntWsTillEndDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws Btw. Date.',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#51c6ff',
          data: oeeAvgAllWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff7b6a',
          data: oeeAvgAllWsTillEndDate
        },
        {
          yAxisID: "y-axis-1",
          label: 'Target Quality',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#645943',
          borderColor: '#645943',
          data: target
        },

        {
          yAxisID: "y-axis-2",
          label: `Total Quantity by Shift`,
          data: totalQuantityByShift,
          fill: false,
          borderColor: '#be3bce'
        },
        {
          yAxisID: "y-axis-2",
          label: `Total Quantity by Day`,
          data: totalQuantityByDay,
          fill: false,
          borderColor: '#c30f46'
        },
        {
          yAxisID: "y-axis-2",
          label: `Scrap by Shift`,
          data: scrapByShift,
          fill: false,
          borderColor: '#62d8cb'
        },
        {
          yAxisID: "y-axis-2",
          label: `Scrap by Day`,
          data: scrapByDay,
          fill: false,
          borderColor: '#0f4ac3'
        },
        {
          label: this.showWeekly? 'Weekly Trend' : 'Monthly Trend',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#229490',
          borderColor: '#229490',
          data: averageOeeReportJobTrendDate
        },
      ]
    }
    this.data = qualityGraphData;
    // this.options = this.qualityGraphOptions;
    this.chart.options = this.qualityGraphOptions;
    setTimeout(() => {
      if(this.showBarview) {
        this.onShowAllBarChanged(this.showBarview);
      }
      this.onShowAllDayChanged(this.showAllDay);
      this.onShowAllShiftChanged(this.showAllShift);
      this.onShowAllAverageChanged(this.showAllAverages);
      this.onShowAllTargetChanged(this.showAllTarget);
    }, 100);
  }

  drawTeepGraph(labels, qualityByDay, qualityByShift, totalQuantityByShift, totalQuantityByDay, scrapByShift, scrapByDay,
                   oeeAvgCurntWsBetweenDate,
                   oeeAvgCurntWsTillEndDate,
                   oeeAvgAllWsBetweenDate,
                   oeeAvgAllWsTillEndDate,target) {
    let qualityGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Teep by Shift`,
          data: qualityByShift,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Teep by Day`,
          data: qualityByDay,
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9c9f42'
        },
        {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Btw. Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: oeeAvgCurntWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG Curnt. Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#9e76ff',
          data: oeeAvgCurntWsTillEndDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws Btw. Date.',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#51c6ff',
          data: oeeAvgAllWsBetweenDate
        }, {
          yAxisID: "y-axis-1",
          label: 'AVG All Ws. Till End Date',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff7b6a',
          data: oeeAvgAllWsTillEndDate
        },
        {
          yAxisID: "y-axis-1",
          label: 'Target Teep',
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          backgroundColor: '#645943',
          borderColor: '#645943',
          data: target
        },

        {
          yAxisID: "y-axis-2",
          label: `Total Teep by Shift`,
          data: totalQuantityByShift,
          fill: false,
          borderColor: '#be3bce'
        },
        {
          yAxisID: "y-axis-2",
          label: `Total Teep by Day`,
          data: totalQuantityByDay,
          fill: false,
          borderColor: '#c30f46'
        },
        {
          yAxisID: "y-axis-2",
          label: `Net by Shift`,
          data: scrapByShift,
          fill: false,
          borderColor: '#62d8cb'
        },
        {
          yAxisID: "y-axis-2",
          label: `Net by Day`,
          data: scrapByDay,
          fill: false,
          borderColor: '#0f4ac3'
        }
      ]
    }
    this.data = qualityGraphData;
    // this.options = this.qualityGraphOptions;
    this.chart.options = this.qualityGraphOptions;
    setTimeout(() => {
      if(this.showBarview) {
        this.onShowAllBarChanged(this.showBarview);
      }
      this.onShowAllDayChanged(this.showAllDay);
      this.onShowAllShiftChanged(this.showAllShift);
      this.onShowAllAverageChanged(this.showAllAverages);
      this.onShowAllTargetChanged(this.showAllTarget);
    }, 100);
  }

  showJobOrderIDDetail(id) {
    this.loader.showDetailDialog(DialogTypeEnum.JOBORDER, id);
  }

  showStopCauseDetail(id) {
    this.loader.showDetailDialog(DialogTypeEnum.STOPCAUSE, id);
  }

  showJobOrderDetail(id) {
    let data = {
      filter: this.filterCon,
      jobOrderId: id
    }
    this.loader.showDetailDialog(DialogTypeEnum.PRODUCTIONORDERREPORT, data);
  }
  filterShift(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.shiftList.length; i++) {
      const shift = this.shiftList[i];
      if (shift.shiftName.toLowerCase().indexOf(query.toLowerCase()) === 0) {
          filtered.push(shift);
      }
    }
    this.filteredShift = filtered;
  }
  handleDropdownClickForShift() {
    this.filteredShift = [...this.shiftList];
  }
  showJobOrderOperationDetail(id) {
    let data = {
      filter: this.filterCon,
      jobOrderOperationId: id
    }
    this.loader.showDetailDialog(DialogTypeEnum.PRODUCTIONORDERREPORT, data);
  }
  showStockDetail(stockId) {
    this.loader.showDetailDialog(DialogTypeEnum.STOCK, stockId);
  }

  calculateQualityLossPercentage(qualityLoss) {
    if(!qualityLoss.scrapCausePercentage) return 0;
    let percentage = (100 * qualityLoss.scrapCausePercentage);
    if (percentage) return parseFloat( percentage.toFixed(2));
    else return 0
  }

  calculateavailabilityLostPercentage(availability) {
    if(!availability) return 0;
    return parseFloat(availability.toFixed(2));
  }
  onShowAllTargetChanged(event) {
    let ci: any = this.chart.chart;
    if(event) {
      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('Target')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = false;
          // We hid a dataset ... rerender the chart
        }
      });
      // this.chart.chart.update = Object.assign({}, this.chart);
    } else {

      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('Target')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = true;
          // We hid a dataset ... rerender the chart
        }
      });
    }

    ci.update();
  }

  onShowAllAverageChanged(event) {
    let ci: any = this.chart.chart;
    if(event) {
      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('AVG')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = false;
          // We hid a dataset ... rerender the chart
        }
      });
      // this.chart.chart.update = Object.assign({}, this.chart);
    } else {

      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('AVG')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = true;
          // We hid a dataset ... rerender the chart
        }
      });
    }

    ci.update();
  }
  onShowAllDayChanged(event) {
    let ci: any = this.chart.chart;
    if(event) {
      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('Day')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = false;
          // We hid a dataset ... rerender the chart
        }
      });
      // this.chart.chart.update = Object.assign({}, this.chart);
    } else {

      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('Day')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = true;
          // We hid a dataset ... rerender the chart
        }
      });
    }

    ci.update();
  }
  onShowAllShiftChanged(event) {
    let ci: any = this.chart.chart;
    if(event) {
      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('Shift')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = false;
          // We hid a dataset ... rerender the chart
        }
      });
      // this.chart.chart.update = Object.assign({}, this.chart);
    } else {

      this.chart._data.datasets.forEach((ds, i) => {
        if(ds.label.includes('Shift')) {
          var meta = ci.getDatasetMeta(i);
          // See controller.isDatasetVisible comment
          meta.hidden = true;
          // We hid a dataset ... rerender the chart
        }
      });
    }

    ci.update();
  }

  onShowAllBarChanged(event) {
    let ci: any = this.chart.chart;
    if(event) {
      this.showLineview = false;
      this.chart._data.datasets[0].type="bar";
      this.chart._data.datasets[0].backgroundColor="#17b625";
      this.chart._data.datasets[0].borderColor="#17b625";
      this.chart._data.datasets[0].order=2;
      this.chart._data.datasets[1].type="bar";
      this.chart._data.datasets[1].backgroundColor="#9c9f42";
      this.chart._data.datasets[1].borderColor="#9c9f42";
      this.chart._data.datasets[1].order=2;

    } else {
      this.showLineview = true;
      this.onShowAllLineChanged(this.showLineview);
      // this.chart._data.datasets.forEach((ds, i) => {
      //   if(i < 2) {
      //     var meta = ci.getDatasetMeta(i);
      //     meta.hidden = true;
      //   }
      // });
    }
    ci.update();
    this.onShowAllShiftChanged(this.showAllShift);
    this.onShowAllDayChanged(this.showAllDay);
  }

  onShowAllLineChanged(event) {
    let ci: any = this.chart.chart;
    if(event) {
      this.showBarview = false;
      this.chart._data.datasets[0].type="line";
      this.chart._data.datasets[0].backgroundColor="#17b625";
      this.chart._data.datasets[0].borderColor="#17b625";
      this.chart._data.datasets[0].order=1;
      this.chart._data.datasets[1].type="line";
      this.chart._data.datasets[1].backgroundColor="#9c9f42";
      this.chart._data.datasets[1].borderColor="#9c9f42";
      this.chart._data.datasets[1].order=1;
      // this.chart._data.datasets.forEach((ds, i) => {
      //   if(i < 2) {
      //     var meta = ci.getDatasetMeta(i);
      //     meta.type = "line";
      //     meta.hidden = false;
      //     ds.type = "line";
      //     // meta.yAxisID = "y-axis-1";
      //   }
      // });
    } else {
      this.showBarview = true;
      this.onShowAllBarChanged(this.showBarview);
      // this.chart._data.datasets.forEach((ds, i) => {
      //   if(i < 2) {
      //     var meta = ci.getDatasetMeta(i);
      //     meta.type = "line";
      //     meta.hidden = true;
      //     // meta.yAxisID = "y-axis-1";
      //   }
      // });
    }
    ci.update();
    this.onShowAllShiftChanged(this.showAllShift);
    this.onShowAllDayChanged(this.showAllDay);
  }


  onShowWeeklyChanged(event) {
    if(event) {
      this.showMonthly = false;
      this.analyze();
    } else {
      this.showMonthly = true;
      this.onShowMonthlyChanged(this.showMonthly);
    }
  }
  // onShowDailyChanged(event) {
  //   if(event) {
  //     this.showMonthly = false;
  //     // this.showWeekly = false;
  //     this.analyze();
  //   } else {
  //     this.showWeekly = true;
  //     this.onShowMonthlyChanged(this.showMonthly);
  //   }
  // }

  onShowMonthlyChanged(event) {
    if(event) {
      this.showWeekly = false;
      this.analyze();
    } else {
      this.showWeekly = true;
      this.onShowWeeklyChanged(this.showWeekly);
    }
  }

  showStopListModal(stopCauseId, startDate, finishDate, shiftId, workstationId) {
    this.modal.active = true;
    this.modal.stopCauseId= stopCauseId;
    this.modal.startDate= startDate;
    this.modal.finishDate=finishDate;
    this.modal.shiftId=shiftId;
    this.modal.workstationId=workstationId;
  }


  exportCSV(type: BookType) {

    const transformData = [];

    if (this.myOriginalOeeReport2Items) {
      let oee2List = this.myOriginalOeeReport2Items.reportItemList.content;
      oee2List.map(itm => {
        transformData.push(itm);
        itm.children.map(shift => {
          transformData.push(shift);
          shift.children.map(job => {
            if(job.jobOrderId!=0){
              transformData.push(job);
            }
            
          })
        })

      })
    }




    const mappedDAta = transformData.map(itm => {
      const obj = {};
      this.loader.showLoader();
      this.cols.forEach(col => {
        if (col.field == "availability") {
          obj[this._translateSvc.instant(col.header)] = this.getPercentage(itm.availability);
        } else if (col.field == "performance") {
          obj[this._translateSvc.instant(col.header)] = this.getPercentage(itm.performance);
        } else if (col.field == "quality") {
          obj[this._translateSvc.instant(col.header)] = this.getPercentage(itm.quality);
        } else if (col.field == "oee") {
          obj[this._translateSvc.instant(col.header)] = this.getPercentage(itm.oee);
        } else if (col.field == "plannedProductionTime") {
          obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.plannedProductionTime * 1000)
        } else if (col.field == "runTime") {
          obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.runTime * 1000)
        } else if (col.field == "netRunTime") {
          obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.netRunTime * 1000)
        } else if (col.field == "fullyProductiveTime") {
          obj[this._translateSvc.instant(col.header)] = this.getReadableTime(itm.fullyProductiveTime * 1000)
        }


        else if (itm.hasOwnProperty(col.field)) {
          obj[this._translateSvc.instant(col.header)] = itm[col.field];
        }
      });
      return (obj);
    });
    this.appStateService.exportAsFile(mappedDAta, type, 'oee-report');
    this.loader.hideLoader();

  }


}
