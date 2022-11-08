import {Component, OnInit} from '@angular/core';
import {StopService} from '../../../../services/dto-services/stop/stop.service';
import {EmployeeService} from '../../../../services/dto-services/employee/employee.service';
import {Subject} from 'rxjs';
import {RequestEmployeeStopListDto} from '../../../../dto/analysis/employee/filter-employee-stops';
import {EmployeeAnlyzItemDto, EmployeeWorkItemDto, ResponseEmployeeStopItemDto} from '../../../../dto/analysis/employee/employee-stop-item';
import {UtilitiesService} from '../../../../services/utilities.service';
import {LoaderService} from '../../../../services/shared/loader.service';

@Component({
  templateUrl: './employee-analysis.html',

})
export class EmployeeAnalysisComponent implements OnInit {
  barData: any;
  options: any;

  stopItem: EmployeeAnlyzItemDto;
  myWorkDetails: EmployeeWorkItemDto[];
  selectedWorkDetails = [];
  myStopReasons;
  selectedStopReasons = [];

  workDetailsCols = [
    {field: 'sdate', header: 'date'},
    {field: 'workStationName', header: 'workstation-name'},
    {field: 'startTime', header: 'start-time'},
    {field: 'endTime', header: 'end-time'},
    {field: 'totalWorkingTime', header: 'total-working-time'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'netWorkingTime', header: 'net-working-time'},
    {field: 'workingTimeEfficiency', header: 'working-time-efficiency'},
    {field: 'producedQuantity', header: 'produced-quantity'}
  ];

  stopReasonCols = [
    {field: 'stopCauseName', header: 'stop-cause'},
    {field: 'stopDuration', header: 'stop-duration'},
    {field: 'stopPercentage', header: 'stop-duration-percentage'}
  ]

  // selected employee on dropdown
  selectedEmployee: any;

  // employe who is for analyze drown
  validEmployee = {
    employee: null,
    startDate: null,
    endDate: null
  };

  pageFilter = {
    pageNumber: 1,
    pageSize: 20,
    query: '',
    orderByProperty: '',
    orderByDirection: 'desc'
  };

  display = false;
  filterCon = new RequestEmployeeStopListDto();
  private searchTerms = new Subject();

  constructor(private _employeeSvc: EmployeeService,
              private loaderService: LoaderService,
              private utilities: UtilitiesService,
              private _stopSvc: StopService) {


  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }

  reset() {
    this.stopItem = null;
    this.myWorkDetails = null;
    this.selectedWorkDetails = [];
    this.myStopReasons = [];
    this.selectedStopReasons = [];

    this.resetChart();
  }

  ngOnInit(): void {
    this.reset();

  }


  analyze() {
    this.loaderService.showLoader();
    if (this.selectedEmployee && this.selectedEmployee.fullName) {
      this.validEmployee.employee = this.selectedEmployee.fullName;
    }
    if (this.filterCon.startDate) {

      this.validEmployee.startDate = this.filterCon.startDate;
    }
    if (this.filterCon.endDate) {
      this.validEmployee.endDate = this.filterCon.endDate;
    }
    this.reset();
    this._stopSvc.employeeWorkstationsStops(this.filterCon)
      .then(result => {
        this.loaderService.hideLoader();
        this.myWorkDetails = result as EmployeeWorkItemDto[];
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });

    this._stopSvc.employeeStopReasons(this.filterCon)
      .then(result => {
        this.loaderService.hideLoader();
        this.initializeStopItems(result)
      })
      .catch(error => {
        this.loaderService.hideLoader();
        this.utilities.showErrorToast(error)
      });


  }

  isLoading() {
    return this.loaderService.isLoading();
  }

  private initializeStopItems(stopItem) {
    if (!stopItem.responseEmployeeStopItemDtos || stopItem.responseEmployeeStopItemDtos.length === 0) {
      this.utilities.showInfoToast('EMPLOYEE-STOP-NOT-FOUND!!');
      return;
    }
    this.initializeChart(stopItem.responseEmployeeStopItemDtos);


    this.myStopReasons = stopItem.responseEmployeeStopItemDtos;
    if (this.myStopReasons) {
      this.myStopReasons.push({
        stopCauseName: 'total',
        stopDuration: stopItem.totalStopDuration,
        stopPercentage: 100
      })
    }

  }

  private resetChart() {
    this.barData = null;

    this.options = {

      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: false,
            labelString: '',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: false,
          scaleLabel: {
            display: true,
            labelString: ' ',
          }
        }]
      }
    };
  }


  private addToChart(aLabel, aData, newBardatasets) {

    const val = aData as number;

    if (aData === 0) {
      return;
    }
    const color = this.dynamicColors();
    newBardatasets.push({
      label: aLabel,
      borderColor: 'rgb(' + color + ')',
      borderWidth: 1,
      data: [val],
      backgroundColor: 'rgba(' + color + ',0.5)'
    });
  }

  private initializeChart(items: Array<ResponseEmployeeStopItemDto>) {
    const newLabels = [];
    const newBardatasets = [];

    items.forEach(item => {
      this.addToChart(item.stopCauseName, item.stopPercentage, newBardatasets);
    });

    this.barData = {
      labels: newLabels,
      datasets: newBardatasets
    };
    this.options = {
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: false,
          scaleLabel: {
            display: true,
            labelString: '',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Stop Percent',
          }
        }]
      },
      tooltips: {
        enabled: true
      },
      hover: {
        animationDuration: 1
      },
      scaleValuePaddingX: 10,
      scaleValuePaddingY: 10,
      animation: {
        duration: 1,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          const fontSiz = 18;
          ctx.fontSize = fontSiz;
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (!meta.hidden) {
              meta.data.forEach(function (bar, index) {
                const data = dataset.data[index];
                const padding = 4;
                const position = bar.tooltipPosition();
                ctx.fillText(data + '%', position.x, position.y - (fontSiz / 2) + padding);
              });
            }
          });
        }
      }
    };

  }

  dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };


  onChangeEmployee(event) {
    this.selectedEmployee = event;

    if (event && event.hasOwnProperty('employeeId')) {
      this.filterCon.employeeId = event.employeeId;
    } else {
      this.filterCon.employeeId = null;
    }
  }


}
