import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { ConvertUtil } from 'app/util/convert-util';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { LoaderService } from 'app/services/shared/loader.service';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { SimulationService } from "app/services/dto-services/simulation/simulation.service";
import { SimulationReportService } from "app/services/dto-services/simulation-report/simulation-report.service";

@Component({
  selector: 'app-simulation-report',
  templateUrl: './simulation-report.component.html'
})
export class SimulationReportComponent implements OnInit, OnDestroy {

  @Input() workStationId: any = null;
  @Input() userClicked: any = false;

  selectedPlant;
  sub: Subscription;
  filterDto = {
    dayly: true,
    erp: null,
    finishDate: moment().add((4 * 7), 'days').toDate(),
    monthly: true,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 999999,
    plantId: null,
    query: null,
    startDate: new Date(),
    weekly: true,
    workCenterId: null,
    workStationId: this.workStationId,
    scheduleSimulationIdList: []
  }

  simulationFilter = { pageNumber: 1, pageSize: 500, scheduleSimulationId: null, scheduleSimulationNo: null, scheduleSimulationName: null, plantId: null };


  responseData: any;
  responseErpData: any;

  weeklyOptions: any;
  dailyOptions: any;
  dailogOptions: any;
  monthlyOptions: any;

  totalAllocationOptions: any;
  capacityOccupancyOptions: any;

  weeklyChartData: any;
  dailyChartData: any;
  dialogChartData: any;
  monthlyChartData: any;
  totalAllocationChartData: any;
  capacityOccupancyChartData: any;
  responseTotalAllocationData: any;
  erpResponseTotalAllocationData: any;

  totalAllocatedCapacity: any;
  totalAvailableCapacity: any;
  modal = { active: false };
  allocationModal = { active: false };
  jobGantViewModal = { active: false };
  moveChart = [{
    id: 'moveChart',
    afterDraw: function (chart, args, pluginOptions) {
      const { ctx, width, height, chartArea: { left, top, right, bottom } } = chart;
      ctx.beginPath();
      ctx.fillStyle = 'lightgrey';
      ctx.rect(left, bottom + 30, width, 10);
      ctx.fill();
    }
  }]
  widthSize: number = 1;
  capacityOccupancy: any;

  graphs = [
    { name: 'Available Capacity', code: 'AVC' },
    { name: 'Allocated Capacity', code: 'ALC' },
    { name: 'Allocation Percentage', code: 'ALP' },
    { name: 'Labour Allocation', code: 'LAL' },
    { name: 'Machine Wait Time', code: 'MWT' },
    { name: 'Planned Setup', code: 'PlS' },
    { name: 'Fixed Cost', code: 'FXC' },
    { name: 'Labor Cost', code: 'LBC' },
    { name: 'Variable Cost', code: 'VRC' },
    { name: 'Planned Cost', code: 'PlC' },
    { name: 'ERP Allocation', code: 'EAL' },
  ];
  selectedGraphs = [
    { name: 'Available Capacity', code: 'AVC' },
    { name: 'Allocated Capacity', code: 'ALC' },
    { name: 'Allocation Percentage', code: 'ALP' }
  ];

  availableCapacityChecked = true;
  allocatedCapacityChecked = true;
  percentageCapacityChecked = true;
  laborAllocationChecked = false;
  machineWaitTimeChecked = false;
  plannedSetupChecked = false;

  fixedCostChecked = false;
  laborCostChecked = false;
  variableCostChecked = false;
  plannedCostChecked = false;
  // actualCostChecked= false;
  erpAllocationChecked = false;
  selectedWorkstation: any = null;



  filterSimulation = { pageNumber: 1, pageSize: 500, scheduleSimulationId: null, scheduleSimulationNo: null, scheduleSimulationName: null, plantId: null };
  simulations;
  selectedSimulation;
  color: string;


  constructor(private appStateService: AppStateService, private loaderService: LoaderService,
    private stockCardService: StockCardService,
    private utilities: UtilitiesService,
    private _simulationSvc: SimulationService,
    private _simulationReportSvc: SimulationReportService

  ) {
  }

  ngOnInit() {


    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.selectedPlant = null;
        this.filterDto.plantId = null;
      } else {
        this.selectedPlant = res;
        this.filterDto.plantId = res.plantId;
        this.filterSimulation.plantId = res.plantId;
        this.filterSimulations();
        if (this.workStationId) {
          this.filterDto.workStationId = this.workStationId;
        }
        this.analyze();
      }
    });

    this.weeklyOptions = this.option('Weekly Allocation Report', 'Hours', 'Weeks');
    this.dailogOptions = this.option('Weekly Allocation Report', 'Hours', 'Weeks');
    this.dailyOptions = this.option('Daily Allocation Report', 'Hours', 'Days');
    this.monthlyOptions = this.option('Monthly Allocation Report', 'Hours', 'Months');
    this.totalAllocationOptions = this.allocationTotalOptions('Total Allocation Report', 'Hours', 'Months');
    this.capacityOccupancyoption();

    this.initializeWeeklyChart();
    this.initializeDailyChart();
    this.initializeMonthlyChart();
    this.initializeTotalAllocationChart();
  }


  option(name: string, left = "Hours", right = "Hours") {
    return {
      title: {
        display: true,
        text: name
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        animationDuration: 1
      },
      scales: {
        xAxes: {
          scaleLabel: {
            display: true,
            labelString: right,
          }
        },
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
              labelString: left,
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              display: true,
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            gridLines: {
              display: false,
              drawBorder: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Allocation Percentage',
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
              if (dataset.yAxisID == 'y-axis-2') {
                ctx.fillText(percent + '%', bar._model.x, bar._model.y + offset);
              } else {
                if (percent) {
                  ctx.fillText(percent, bar._model.x, bar._model.y + offset);
                }
              }



            });
          });
        }
      }
    };
  }

  allocationTotalOptions(name: string, left = "Hours", right = "Hours") {
    const me = this;
    return {
      title: {
        display: true,
        text: name
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      maintainAspectRatio: false,
      hover: {
        animationDuration: 1
      },
      scales: {
        xAxes: {
          scaleLabel: {
            display: true,
            labelString: right,
          }
        },
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
              labelString: left,
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              display: true,
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            gridLines: {
              display: false,
              drawBorder: false,
              drawOnChartArea: false,
              drawTicks: false,
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Allocation Percentage',
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
              if (dataset.yAxisID == 'y-axis-2') {
                ctx.fillText(percent + '%', bar._model.x, bar._model.y + offset);
              } else {
                if (percent) {
                  ctx.fillText(percent, bar._model.x, bar._model.y + offset);
                }
              }



            });
          });
        }
      },
      onClick: function (e) {
        var xLabel = this.scales['x-axis-0'].getValueForPixel(e.offsetX);
        var value = this.data.labels[xLabel];
        me.selectedWorkstation = me.responseTotalAllocationData.find(itm => itm.workStationName == value);
        if (!me.userClicked) {
          me.allocationModal.active = true;
          me.userClicked = true;
        } else {
          me.jobGantViewModal.active = true;
        }
        // if(typeof(value) == 'string') {
        //   JobOrderServiceStatic.showJobOrderDetails(value.substr(2))
        // } else if(typeof(value) == 'object') {
        //   JobOrderServiceStatic.showJobOrderDetails(value[0].substr(2))
        // }
      },
    };
  }

  capacityOccupancyoption() {
    this.capacityOccupancyOptions = {
      title: {
        display: false,
        text: ''
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      responsive: true,
      hover: {
        animationDuration: 1
      },
      scales: {
        xAxes: {
          scaleLabel: {
            display: false,
            labelString: '',
          }
        },
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
              display: false,
              labelString: '',
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
                ctx.fillText(percent, bar._model.x, bar._model.y + offset);
              }

            });
          });
        }
      }
    };
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
    }, 500);
  }

  analyze() {
    this.filterDto.pageNumber = 1;
    const temp = Object.assign({}, this.filterDto);
    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }

    const erpTemp = Object.assign({}, temp);
    erpTemp.erp = true;
    this.loaderService.showLoader();
    // if(this.filterDto.workCenterId || this.filterDto.workStationId) {
    //   this.stockCardService.trendWorkstationActualCapacityByPlant(temp).toPromise().then(res => {
    //     this.loaderService.hideLoader();
    //     this.responseData = res;
    //     this.initializeWeeklyChart();
    //     this.initializeDailyChart();
    //   }).catch(err => {
    //     this.loaderService.hideLoader();
    //     this.utilities.showErrorToast(err);
    //   })
    // } else {
    Promise.all([
      this._simulationReportSvc.trendWorkstationActualCapacityByPlantReportSimulation(temp).toPromise(),
      // this.stockCardService.trendAllWorkstationActualCapacityByPlant(erpTemp).toPromise(),
    ]).then(res => {
      this.loaderService.hideLoader();
      if (res[0]) {
        let daily = res[0].daily.filter(itm => itm.erp === false);
        let montly = res[0].montly.filter(itm => itm.erp === false);
        let weekly = res[0].weekly.filter(itm => itm.erp === false);
        let erpdaily = res[0].daily.filter(itm => itm.erp === true);
        let erpmontly = res[0].montly.filter(itm => itm.erp === true);
        let erpweekly = res[0].weekly.filter(itm => itm.erp === true);
        this.responseData = { daily, montly, weekly };
        this.responseErpData = { daily: erpdaily, montly: erpmontly, weekly: erpweekly };;
      }
      this.initializeWeeklyChart();
      this.initializeDailyChart();
      this.initializeMonthlyChart();
    }).catch(err => {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    })
    // }
    Promise.all([
      this._simulationReportSvc.trendWorkstationActualCapacitySimulation(temp).toPromise(),
      // this.stockCardService.trendWorkstationActualCapacity(erpTemp).toPromise(),
    ]).then(res => {
      this.loaderService.hideLoader();
      this.responseTotalAllocationData = res[0]['content'] ? res[0]['content'].filter(itm => itm.erp === false) : [];
      this.erpResponseTotalAllocationData = res[0]['content'] ? res[0]['content'].filter(itm => itm.erp === true) : [];;
      this.initializeTotalAllocationChart();
    }, err => {
      this.utilities.showErrorToast(err);
    })

  }

  dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };

  initializeChart(arr: any[], erpArr: any[], istotalAlloc = false) {
    let allocatedCapacity = [];
    let availableCapacity = [];
    let plannedCapacity = [];
    let laborAllocation = [];
    let machineWaitTime = [];
    let plannedSetup = [];

    let plannedCost = [];
    let variableCost = [];
    let fixedCost = [];
    let laborCost = [];

    let erpplannedCapacity = [];
    let erpavailableCapacity = [];
    let erpallocatedCapacity = [];
    let erplaborAllocation = [];
    let erpmachineWaitTime = [];
    let erpplannedSetup = [];

    let erpplannedCost = [];
    let erpvariableCost = [];
    let erpfixedCost = [];
    let erplaborCost = [];

    let lineLabels = [];
    let datasets = [];

    if (arr && arr.length) {
      // simulationCapacity = arr.filter(x=> x.scheduleSimulationId !== 0).map(item=> item.allocatedCapacity);
      allocatedCapacity = arr.filter(x => x.scheduleSimulationId === 0).map(item => item.allocatedCapacity);
      availableCapacity = arr.map(item => item.availableCapacity);
      plannedCapacity = arr.map(item => Number.isInteger(item.plannedCapacity) ? item.plannedCapacity : parseFloat(item.plannedCapacity || 0 + '').toFixed(2));
      laborAllocation = arr.map(item => item.employeeWorkingTime);
      machineWaitTime = arr.map(item => item.machineWaitTime);
      plannedSetup = arr.map(item => item.plannedSetup);
      plannedCost = arr.map(item => item.plannedCost);
      variableCost = arr.map(item => (item.variableCost || 0));
      fixedCost = arr.map(item => (item.fixedCost || 0));
      laborCost = arr.map(item => (item.laborCost || 0));
      if (istotalAlloc) {
        lineLabels = arr.map(item => item.workStationName);
      } else {
        let distinctDates = arr.filter((item, i, arr) => arr.findIndex((t) => t.groupDate === item.groupDate) === i);
        lineLabels = distinctDates.map(item => item.groupDate);
      }
    }

    if (erpArr && erpArr.length) {
      erpArr.forEach(item => {

        let label = null;
        if (istotalAlloc) {
          label = lineLabels.find(x => x === item.workStationName);
        } else {
          label = lineLabels.find(x => x === item.groupDate);;
        }
        if (label) {
          erpallocatedCapacity.push(item.allocatedCapacity);
          erpavailableCapacity.push(item.availableCapacity);
          erpplannedCapacity.push(Number.isInteger(item.plannedCapacity) ? item.plannedCapacity : parseFloat(item.plannedCapacity || 0 + '').toFixed(2));
          erplaborAllocation.push(item.employeeWorkingTime);
          erpmachineWaitTime.push(item.machineWaitTime);
          erpplannedSetup.push(item.plannedSetup);
          erpplannedCost.push(item.plannedCost);
          erpvariableCost = arr.map(item => (item.variableCost || 0));
          erpfixedCost = arr.map(item => (item.fixedCost || 0));
          erplaborCost = arr.map(item => (item.laborCost || 0));

          // erpgainedSetup.push(item.gainedSetup);
          // erpjobOrderEarly.push(item.jobOrderEarlyTime);
          // erpjobOrderLate.push(item.jobOrderLateTime);
          // erpplannedCost.push(item.plannedCost);
          // erpactualCost.push(item.actualCost);
        } else {
          erpallocatedCapacity.push(NaN);
          erpavailableCapacity.push(NaN);
          erpplannedCapacity.push(NaN);
          erplaborAllocation.push(NaN);
          erpmachineWaitTime.push(NaN);
          erpplannedSetup.push(NaN);
          erpplannedCost.push(NaN);
          erpvariableCost.push(NaN);
          erpfixedCost.push(NaN);
          erplaborCost.push(NaN);
          // erpgainedSetup.push(NaN);
          // erpjobOrderEarly.push(NaN);
          // erpjobOrderLate.push(NaN);
          // erpplannedCost.push(NaN);
          // erpactualCost.push(NaN);
        }
      });
    }
    if (!this.color) {
      this.color = this.dynamicColors();
    }

    if (this.allocatedCapacityChecked && this.selectedSimulation) {
      this.selectedSimulation.forEach(event => {
        let simulationData = arr.filter(x => x.scheduleSimulationId === event.scheduleSimulationId).map(item => item.allocatedCapacity);
        if (simulationData && simulationData.length > 0) {
          datasets.push({
            label: event.scheduleSimulationName,
            borderColor: '#05a60d',
            yAxisID: 'y-axis-1',
            backgroundColor: 'rgba(' + this.color + ',0.5)',
            data: simulationData,
            order: 2,
            borderWidth: 1
          })
        }
      });
    }
    if (this.allocatedCapacityChecked) {
      datasets.push({
        label: 'Allocated Capacity',
        borderColor: '#05a60d',
        yAxisID: 'y-axis-1',
        backgroundColor: '#05a60d',
        data: allocatedCapacity,
        order: 2,
        borderWidth: 1
      })

      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Allocated Capacity',
          borderColor: '#232bcc',
          yAxisID: 'y-axis-1',
          backgroundColor: '#232bcc',
          data: erpallocatedCapacity,
          order: 2,
          borderWidth: 1
        })
      }
    }
    if (this.availableCapacityChecked) {
      datasets.push({
        label: 'Available Capacity',
        // yAxisID: 'y-axis-2',
        borderColor: '#e87a0c',
        backgroundColor: '#e87a0c',
        data: availableCapacity,
        fill: false,
        type: 'line',
        order: 1,
        lineTension: 0.5,
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Available Capacity',
          // yAxisID: 'y-axis-2',
          borderColor: '#7802c7',
          backgroundColor: '#7802c7',
          data: erpavailableCapacity,
          fill: false,
          type: 'line',
          order: 1,
          lineTension: 0.5,
        });
      }
    }

    if (this.percentageCapacityChecked) {
      datasets.push({
        label: 'Allocation Percentage',
        borderColor: '#ffc505',
        backgroundColor: '#ffc505',
        data: plannedCapacity,
        yAxisID: 'y-axis-2',
        fill: false,
        type: 'line',
        order: 1,
        lineTension: 0.5,
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Allocation Percentage',
          yAxisID: 'y-axis-2',
          borderColor: '#07b3e3',
          backgroundColor: '#07b3e3',
          data: erpplannedCapacity,
          fill: false,
          type: 'line',
          order: 1,
          lineTension: 0.5,
        });
      }
    }
    if (this.laborAllocationChecked) {
      datasets.push({
        label: 'Labor Allocation',
        borderColor: '#e007d2',
        backgroundColor: '#e007d2',
        data: laborAllocation,
        order: 2,
        borderWidth: 1
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Labor Allocation',
          borderColor: '#8623b0',
          backgroundColor: '#8623b0',
          data: erplaborAllocation,
          order: 2,
          borderWidth: 1
        });
      }
    }
    if (this.machineWaitTimeChecked) {
      datasets.push({
        label: 'Machine Wait',
        borderColor: '#dfeb07',
        backgroundColor: '#dfeb07',
        data: machineWaitTime,
        order: 2,
        borderWidth: 1
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Machine Wait',
          borderColor: '#12a9c7',
          backgroundColor: '#12a9c7',
          data: erpmachineWaitTime,
          order: 2,
          borderWidth: 1
        });
      }
    }
    if (this.plannedSetupChecked) {
      datasets.push({
        label: 'Planned Setup',
        borderColor: '#00d61d',
        backgroundColor: '#00d61d',
        data: plannedSetup,
        order: 2,
        borderWidth: 1
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Planned Setup',
          borderColor: '#99ba04',
          backgroundColor: '#99ba04',
          data: erpplannedSetup,
          order: 2,
          borderWidth: 1
        });
      }
    }
    if (this.fixedCostChecked) {
      datasets.push({
        label: 'Fixed Cost',
        borderColor: '#6bcafa',
        backgroundColor: '#6bcafa',
        data: fixedCost,
        fill: false,
        type: 'line',
        order: 1,
        lineTension: 0.5,
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Fixed Cost',
          borderColor: '#375b6e',
          backgroundColor: '#375b6e',
          data: erpfixedCost,
          fill: false,
          type: 'line',
          order: 1,
          lineTension: 0.5,
        });
      }
    }
    if (this.laborCostChecked) {
      datasets.push({
        label: 'Labor Cost',
        borderColor: '#667a28',
        backgroundColor: '#667a28',
        data: laborCost,
        fill: false,
        type: 'line',
        order: 1,
        lineTension: 0.5,
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Labor Cost',
          borderColor: '#a8b389',
          backgroundColor: '#a8b389',
          data: erplaborCost,
          fill: false,
          type: 'line',
          order: 1,
          lineTension: 0.5,
        });
      }
    }
    if (this.variableCostChecked) {
      datasets.push({
        label: 'Variable Cost',
        borderColor: '#eb2b00',
        backgroundColor: '#eb2b00',
        data: variableCost,
        fill: false,
        type: 'line',
        order: 1,
        lineTension: 0.5,
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Variable Cost',
          borderColor: '#de8a23',
          backgroundColor: '#de8a23',
          data: erpvariableCost,
          fill: false,
          type: 'line',
          order: 1,
          lineTension: 0.5,
        });
      }
    }
    if (this.plannedCostChecked) {
      datasets.push({
        label: 'Planned Cost',
        borderColor: '#b3ff30',
        backgroundColor: '#b3ff30',
        data: plannedCost,
        fill: false,
        type: 'line',
        order: 1,
        lineTension: 0.5,
      });
      if (this.erpAllocationChecked) {
        datasets.push({
          label: 'ERP Planned Cost',
          borderColor: '#1c4d02',
          backgroundColor: '#1c4d02',
          data: erpplannedCost,
          fill: false,
          type: 'line',
          order: 1,
          lineTension: 0.5,
        });
      }
    }
    // if(this.actualCostChecked) {
    //   datasets.push({
    //     label: 'Actual Cost',
    //     borderColor: '#8797cc',
    //     backgroundColor: '#8797cc',
    //     data: actualCost,
    //     fill: false,
    //     type: 'line',
    //     order:1,
    //     lineTension: 0.5,
    //   });
    //   if(this.erpAllocationChecked) {
    //     datasets.push({
    //       label: 'ERP Actual Cost',
    //       borderColor: '#f00078',
    //       backgroundColor: '#f00078',
    //       data: erpactualCost,
    //     fill: false,
    //     type: 'line',
    //     order:1,
    //     lineTension: 0.5,
    //     });
    //   }
    // }
    return {
      labels: lineLabels,
      datasets: datasets
    };


  }

  onGraphSelected(event) {
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "AVC")) {
      this.availableCapacityChecked = true;
    } else {
      this.availableCapacityChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "ALC")) {
      this.allocatedCapacityChecked = true;
    } else {
      this.allocatedCapacityChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "ALP")) {
      this.percentageCapacityChecked = true;
    } else {
      this.percentageCapacityChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "LAL")) {
      this.laborAllocationChecked = true;
    } else {
      this.laborAllocationChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "MWT")) {
      this.machineWaitTimeChecked = true;
    } else {
      this.machineWaitTimeChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "PlS")) {
      this.plannedSetupChecked = true;
    } else {
      this.plannedSetupChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "FXC")) {
      this.fixedCostChecked = true;
    } else {
      this.fixedCostChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "LBC")) {
      this.laborCostChecked = true;
    } else {
      this.laborCostChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "VRC")) {
      this.variableCostChecked = true;
    } else {
      this.variableCostChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "PlC")) {
      this.plannedCostChecked = true;
    } else {
      this.plannedCostChecked = false;
    }
    if (this.selectedGraphs && this.selectedGraphs.find(x => x.code === "EAL")) {
      this.erpAllocationChecked = true;
    } else {
      this.erpAllocationChecked = false;
    }

    this.initializeWeeklyChart();
    this.initializeDailyChart();
    this.initializeMonthlyChart();
    this.initializeTotalAllocationChart();
  }

  onChangeCheckbox(event) {
    this.initializeWeeklyChart();
    this.initializeDailyChart();
    this.initializeMonthlyChart();
    this.initializeTotalAllocationChart();
  }

  groupArrayOfObjects(list, key) {
    return list.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  initializeDailyChart() {
    // let data = this.responseData?.daily.sort(function (a, b) {
    //   var dateA = new Date(a.groupDate);
    //   var dateB = new Date(b.groupDate);
    //   return dateA > dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
    // });
    let finalChart = [];
    if (this.responseData?.daily?.length > 0) {
      let dailyChart = Object.assign([], this.groupArrayOfObjects(this.responseData?.daily, 'groupDate'));
      let chart = [];
      for (const key in dailyChart) {
        chart.push(dailyChart[key]);
      }
      chart.forEach(x => {
        x.forEach(y => {
          finalChart.push(y);
        });
      });
    }
    this.dailyChartData = this.initializeChart(finalChart || [], this.responseErpData?.daily || []);
  }

  initializeWeeklyChart() {
    this.weeklyChartData = this.initializeChart(this.responseData?.weekly || [], this.responseErpData?.weekly || []);
  }
  initializeMonthlyChart() {
    this.monthlyChartData = this.initializeChart(this.responseData?.montly || [], this.responseErpData?.montly || []);
  }

  initializeTotalAllocationChart() {
    this.totalAllocationChartData = this.initializeChart(this.responseTotalAllocationData || [], this.erpResponseTotalAllocationData || [], true);
    let allocatedCapacity = [];
    let availableCapacity = [];
    let erpallocatedCapacity = [];
    let erpavailableCapacity = [];
    if (this.responseTotalAllocationData && this.responseTotalAllocationData.length) {
      allocatedCapacity = this.responseTotalAllocationData.map(item => item.allocatedCapacity);
      availableCapacity = this.responseTotalAllocationData.map(item => item.availableCapacity);
    }
    if (this.erpResponseTotalAllocationData && this.erpResponseTotalAllocationData.length) {
      erpallocatedCapacity = this.erpResponseTotalAllocationData.map(item => item.allocatedCapacity);
      erpavailableCapacity = this.erpResponseTotalAllocationData.map(item => item.availableCapacity);
    }
    this.totalAllocatedCapacity = allocatedCapacity.reduce((a, b) => a + b, 0);
    this.totalAvailableCapacity = availableCapacity.reduce((a, b) => a + b, 0);
    this.capacityOccupancy = parseFloat(((this.totalAllocatedCapacity / this.totalAvailableCapacity) * 100) + '').toFixed(2);

    const erptotalAllocatedCapacity = erpallocatedCapacity.reduce((a, b) => a + b, 0);
    const erptotalAvailableCapacity = erpavailableCapacity.reduce((a, b) => a + b, 0);
    const erpcapacityOccupancy = parseFloat(((erptotalAllocatedCapacity / erptotalAvailableCapacity) * 100) + '').toFixed(2);

    const datasets = [
      {
        label: null,
        borderColor: '#05a60d',
        yAxisID: 'y-axis-1',
        backgroundColor: '#05a60d',
        data: [this.capacityOccupancy],
        order: 2,
        borderWidth: 1
      }
    ];

    if (this.erpAllocationChecked) {
      datasets.push({
        label: null,
        borderColor: '#232bcc',
        yAxisID: 'y-axis-1',
        backgroundColor: '#232bcc',
        data: [erpcapacityOccupancy],
        order: 2,
        borderWidth: 1
      });
    }

    this.capacityOccupancyChartData = {
      labels: [],
      datasets: datasets
    };
  }

  setSelectedWorkstation(event) {
    if (event) {
      this.filterDto.workStationId = event.workStationId;
    } else {
      this.filterDto.workStationId = null;
    }
  }

  setSelectedWorkCenter(event) {
    if (event) {
      this.filterDto.workCenterId = event.workCenterId;
    } else {
      this.filterDto.workCenterId = null;

    }
  }

  handleDropdownClickForSimulation() {
    // this.filteredSimulations = (this.filteredSimulations && this.filteredSimulations.length) ? [...this.filteredSimulations] : [...this.allSimulations];
    // if (this.filteredSimulations.length == 0) {
    //   this.simulationFilter.plantId = this.selectedPlant.plantId;
    //   this.searchTerms.next(this.simulationFilter);
    // }
  }

  // private initSimulationList(res) {
  //   if (!res || res.length === 0) {
  //     this.utilities.showInfoToast('SIMULATION-NOT-FOUND');
  //     return;
  //   }

  //   this.filteredSimulations = [...this.allSimulations];

  // }


  filterSimulations() {
    this._simulationSvc.filter(this.filterSimulation)
      .then(result => {
        this.simulations = [...result['content']];
        // this.loadData();
      }).catch(error => console.log(error));
  }

  simulationChanged(event) {
    this.filterDto.scheduleSimulationIdList = event.value?.map(sim => sim.scheduleSimulationId);
  }



  onHide() {
    this.dailogOptions = null;
    this.dialogChartData = null;
    this.modal.active = false;
  }


  getwidth = (length) => {
    if (!length || length <= 13) {
      return '100%';
    }
    return (length * 20) + 500 + 'px';
  }
}
