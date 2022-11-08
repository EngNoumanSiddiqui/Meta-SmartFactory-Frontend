import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

//models
import {JobOrderOEE, RequestOeeReportDto} from 'app/dto/oee/oee.model';
import {environment} from 'environments/environment';
import {ConvertUtil} from 'app/util/convert-util';
 
import {DialogTypeEnum} from 'app/services/shared/dialog-types.enum';

//services
import {AppStateService} from 'app/services/dto-services/app-state.service';
import {UtilitiesService} from 'app/services/utilities.service';
import {LoaderService} from 'app/services/shared/loader.service';
import {OeeService} from 'app/services/dto-services/oee/oee-service';
import {DatePipe} from '@angular/common';
import {UIChart} from 'primeng';

@Component({
  templateUrl: './oee-job-order-analysis.html',
  styleUrls: ['./oee-job-order-analysis.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OeeJobOrderAnalysisComponent implements OnInit {

  @ViewChild('chart') chart: UIChart;

  selectedWorkStationName;
  validWorkstation: any;
  display = false;

  filterCon: RequestOeeReportDto = {
    oeeReportId: 0,
    orderByDirection: null,
    orderByProperty: null,
    query: null,
    plantId: null,
    workcenterId: null,
    rangeStart: ConvertUtil.date2StartOfDay(new Date()),
    rangeEnd: new Date(),
    shiftId: null,
    workstationId: null,
    pageNumber: 1,
    pageSize: 90
  };

  availability = 'Availability';
  performance = 'Performance';
  quality = 'Quality';

  chartModal = {
    active: false,
    data: null
  };

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
  jobOrderReportData: JobOrderOEE = {
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
    scheduleLost: null,
    performanceLostPercentage: null,
    scheduleLostPercentage: null,
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
    topQualityLostList: null,
    topPerformanceLostList: null,
    topAvailabilityLostList: null
  }
  options: any;
  plantId: any;
  data: any;
  performanceGraphOptions: any;
  qualityGraphOptions: any;
  availabilityLossGraphOptions: any;

  constructor(private utilities: UtilitiesService,
    private loader: LoaderService,
    private _oeeSvc: OeeService,
    private appStateService: AppStateService,
    private datePipe: DatePipe) {
    this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plantId = null;
      } else {
        this.plantId = res.plantId;
      }
    });
  }

  ngOnInit() {
    this.setChartOptions();
    this.setPerformanceOptions();
    this.setQualityGraphOptions();
    this.setAvailabilityLossGraphOptions()
    this.analyze();
  }

  analyze() {
    this.treeData = null;

    this.loader.showLoader();
    this.validWorkstation = this.selectedWorkStationName;

    const temp = Object.assign({}, this.filterCon);
    //set end time to 23:59:59 of selected day.
    // temp.rangeEnd = moment(temp.rangeEnd).endOf('day').toDate();
    // temp.rangeStart = ConvertUtil.localDateShiftAsUTC(temp.rangeStart);
    // temp.rangeEnd = ConvertUtil.localDateShiftAsUTC(temp.rangeEnd);

    // ******************** Get Oee Job Report between selected Date/
    this._oeeSvc.getOeeReport(temp).then((result: any) => {

      if (result) {
        if (result.reportItemList) {
          let filter = result.reportItemList.content.map((item) => {
            item.dimension = this.datePipe.transform(item.dimension, 'dd.MM.yyyy');
            return item;
          })
          this.treeData = this.detailList2Node(filter);
          this.pagination.currentPage = result.reportItemList.currentPage;
          this.pagination.totalElements = result.reportItemList.totalElements;
          this.pagination.totalPages = result.reportItemList.totalPages;
        }
        this.setJobOrderOEEReport(result);
      }
      this.loader.hideLoader();

    }).catch(err => {
      this.loader.hideLoader();
      this.utilities.showErrorToast(err);
    })
    /********************************************************************************/

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
        const treeNode = me.detail2Node(item);
        list.push(treeNode);
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

  setJobOrderOEEReport(data: any) {
    //convert percentage value
    this.jobOrderReportData.oee = this.getPercentage(data.oee);
    this.jobOrderReportData.availability = this.getPercentage(data.availability);
    this.jobOrderReportData.performance = this.getPercentage(data.performance);
    this.jobOrderReportData.quality = this.getPercentage(data.quality);
    this.jobOrderReportData.teep = this.getPercentage(data.teep);
    this.jobOrderReportData.availabilityLostPercentage = data.availabilityLostPercentage;
    this.jobOrderReportData.scheduleLostPercentage = data.scheduleLostPercentage;
    this.jobOrderReportData.performanceLostPercentage = data.performanceLostPercentage;
    this.jobOrderReportData.qualityLostPercentage = data.qualityLostPercentage;

    //readable time
    this.jobOrderReportData.plannedProductionTime = this.getReadableTime(data.plannedProductionTime * 1000)
    this.jobOrderReportData.runTime = this.getReadableTime(data.runTime * 1000);
    this.jobOrderReportData.availabilityLost = this.getReadableTime(data.availabilityLost * 1000);
    this.jobOrderReportData.netRunTime = this.getReadableTime(data.netRunTime * 1000);
    this.jobOrderReportData.realPerformance = this.getReadableTime(data.realPerformance);
    this.jobOrderReportData.realNetRunTime = this.getReadableTime(data.realNetRunTime * 1000);
    this.jobOrderReportData.realFullyProductiveTime = this.getReadableTime(data.realFullyProductiveTime * 1000);
    this.jobOrderReportData.performanceLost = this.getReadableTime(data.performanceLost * 1000);
    this.jobOrderReportData.qualityLost = this.getReadableTime(data.qualityLost * 1000);
    this.jobOrderReportData.goodCount = data.goodCount;
    this.jobOrderReportData.scrapCount = data.scrapCount;

    if (data.topAvailabilityLostList) {
      //sort higher to lower
      this.jobOrderReportData.topAvailabilityLostList = data.topAvailabilityLostList.sort((n1, n2) => n2.actualStopDuration - n1.actualStopDuration);

    }
    if (data.topPerformanceLostList) {
      this.jobOrderReportData.topPerformanceLostList = data.topPerformanceLostList.sort(
        (n1, n2) => n2.performanceLoss - n1.performanceLoss);

    }

    if (data.topQualityLostList) {
      //check first if qualitylost scrap count is same for all or not
      var ids = new Set(data.topQualityLostList.map(d => d.scrapCount));
      if (ids.size === 1) {
        this.jobOrderReportData.topQualityLostList = data.topQualityLostList.sort(
          (n1, n2) => (n2.scrapCount + n2.goodCount) - (n1.scrapCount + n1.goodCount));
      } else {
        this.jobOrderReportData.topQualityLostList = data.topQualityLostList.sort(
          (n1, n2) => n2.scrapCount - n1.scrapCount);
      }
    }

    if (data.reportItemList) {
      this.jobOrderReportData.reportItemList = data.reportItemList.content;
      this.drawReportGraphs(data.reportItemList.content);
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
      return (val * 100).toFixed(1);
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
      this.selectedWorkStationName = event.workStationName;
    } else {
      this.selectedWorkStationName = null;
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
            if (tooltipItem.datasetIndex > 1) {
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
        }
      }
    };
  }
  drawReportGraphs(data, graph: string = 'oee') {

    this.data = null;
    var labels = [];
    //oee
    var oeeShifts = [];
    var oeeDay = [];
    //quanity
    var totalQuantityByShift = [];
    var totalQuantityByDay = [];
    var scrapByShift = [];
    var scrapByDay = [];

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
    if (graph == 'oee') {
      this.drawDefaultGraph(labels, oeeShifts, oeeDay);
    } else if (graph == 'availability') {
      this.drawAvailabilityLossGraph(labels, oeeDay, oeeShifts, runTimeByShift, runTimeByDay, plannedProductionTimeByShift, plannedProductionTimeByDay);
    } else if (graph == 'performance') {
      this.drawPerformanceGraph(labels, oeeDay, oeeShifts, runTimeByShift, runTimeByDay, netRunTimeByShift, netRunTimeByDay);
    } else if (graph == 'quality') {
      this.drawQualityGraph(labels, oeeDay, oeeShifts, totalQuantityByShift, totalQuantityByDay, scrapByShift, scrapByDay);
    }
  }
  drawDefaultGraph(labels, oeeShifts, oeeDay) {
    this.data = {
      labels: labels,
      datasets: [
        {
          label: `OEE by Shift`,
          data: oeeShifts,
          fill: false,
          borderColor: '#17b625'
        },
        {
          label: `OEE by Day`,
          data: oeeDay,
          fill: false,
          borderColor: '#ff9f42'
        }
      ]
    }
  }

  drawAvailabilityLossGraph(labels, availabilityByDay, availabilityByShift, runTimeByShift, runTimeByDay, plannedProductionTimeByShift, plannedProductionTimeByDay) {
    let availabilityLossGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Availability by Shift`,
          data: availabilityByShift,
          fill: false,
          borderColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Availability by Day`,
          data: availabilityByDay,
          fill: false,
          borderColor: '#ff9f42'
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
          label: `Planned Production Time by Shift`,
          data: plannedProductionTimeByShift,
          fill: false,
          borderColor: '#62d8cb'
        },
        {
          yAxisID: "y-axis-2",
          label: `Planned Production Time by Day`,
          data: plannedProductionTimeByDay,
          fill: false,
          borderColor: '#0f4ac3'
        }
      ]
    }
    this.data = availabilityLossGraphData;
    this.chart.options = this.availabilityLossGraphOptions;
  }
  drawPerformanceGraph(labels, performanceByDay, performanceByShift, runTimeByShift, runTimeByDay, netRunTimeByShift, netRunTimeByDay) {
    let performanceGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Performance by Shift`,
          data: performanceByShift,
          fill: false,
          borderColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Performance by Day`,
          data: performanceByDay,
          fill: false,
          borderColor: '#ff9f42'
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
        }
      ]
    }
    this.data = performanceGraphData;
    // this.options = this.performanceGraphOptions;
    this.chart.options = this.performanceGraphOptions;
  }

  drawQualityGraph(labels, qualityByDay, qualityByShift, totalQuantityByShift, totalQuantityByDay, scrapByShift, scrapByDay) {
    let qualityGraphData = {
      labels: labels,
      datasets: [
        {
          yAxisID: "y-axis-1",
          label: `Quality by Shift`,
          data: qualityByShift,
          fill: false,
          borderColor: '#17b625'
        },
        {
          yAxisID: "y-axis-1",
          label: `Quality by Day`,
          data: qualityByDay,
          fill: false,
          borderColor: '#ff9f42'
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
        }
      ]
    }
    this.data = qualityGraphData;
    // this.options = this.qualityGraphOptions;
    this.chart.options = this.qualityGraphOptions;

  }

  showJobOrderDetail(id) {
    let data = {
      filter: this.filterCon,
      jobOrderId: id
    }
    this.loader.showDetailDialog(DialogTypeEnum.PRODUCTIONORDERREPORT, data);
  }

  calculateQualityLossPercentage(qualityLoss) {
    let percentage = (100 * (qualityLoss.scrapCount / (qualityLoss.scrapCount + qualityLoss.goodCount)));

    if (percentage) return percentage.toFixed(2)
    else return 0
  }
}
