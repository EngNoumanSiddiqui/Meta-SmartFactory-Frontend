import {Component, OnInit, ViewChild} from '@angular/core';

import {RequestStopListDto} from '../../../../dto/analysis/stop-down-time/filter-custom-stop';
import {StopService} from '../../../../services/dto-services/stop/stop.service';
import {UtilitiesService} from '../../../../services/utilities.service';
import {ConvertUtil} from '../../../../util/convert-util';
import {LoaderService} from '../../../../services/shared/loader.service';
import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { UIChart } from 'primeng';

@Component({
  templateUrl: './custom-stop-downtime-analysis.html'
})
export class CustomStopDowntimeAnalysisComponent implements OnInit {
  barData: any;
  options: any;
  display = false;
  injected = [];
  dataTable = [];
  details = [];
  filterCon = new RequestStopListDto();
  pagination = {
    totalElements: 0,
    currentPage: 1,
    pageNumber: 1,
    pageSize: 20,
    totalPages: 1,
    TotalPageLinkButtons: 5,
    RowsPerPageOptions: [10, 20, 30, 50, 100, 200, 500, 1000],
    rows: 20,
    tag: ''
  };

  pageFilter = {
    actualFinishTime: null,
    actualStartTime: null,
    employeeId: null,
    employeeName: null,
    plantId: null,
    jobOrderOperationId: null,
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 20,
    query: null,
    shiftId: null,
    stopCauseId: null,
    stopCauseName: null,
    stopId: null,
    workStationId: null,
    workStationName: null,
  }
  sub: any;
  selectedPlant: any;
  plantTed = true;

  optionList = [];
  selectedOptionList = [];
  @ViewChild('chart2') chart2: UIChart;

  constructor(private utilities: UtilitiesService, private appStateService: AppStateService, private loader: LoaderService,
              private _stopSvc: StopService) {


  }

  exportAsPng(printSectionId: string) {
    this.utilities.exportAsPng(printSectionId);
  }

  onplantTed(event) {
    if(this.plantTed) {
      this.filterCon.plantId = this.selectedPlant?.plantId;
    } else {
      this.filterCon.plantId = null;
    }
  }

  setWorkStationFilter(event) {
    if (event) {
      this.filterCon.workstationId = event.workStationId;
      this.pageFilter.workStationId = event.workStationId;
    } else {
      this.filterCon.workstationId = null;
      this.pageFilter.workStationId = null;
    }
  }
  setStopCauseFilter(event) {
    if (event) {
      this.filterCon.stopCauseId = event.stopCauseId;
      this.pageFilter.stopCauseId = event.stopCauseId;
    } else {
      this.filterCon.stopCauseId = null;
      this.pageFilter.stopCauseId = null;
    }
  }

  showemployeeDetails(empID) {
    this.loader.showDetailDialog(DialogTypeEnum.STAFF, empID);
  }
  showworkstationDetails(empID) {
    this.loader.showDetailDialog(DialogTypeEnum.WORKSTATION, empID);
  }

  ngOnInit(): void {
    this.filterCon.startDate = ConvertUtil.date2StartOfDay(new Date());
    this.filterCon.endDate = new Date();
    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.selectedPlant = null;
        this.filterCon.plantId = null;
      } else {
        this.selectedPlant = res;
        this.filterCon.plantId = this.selectedPlant.plantId;
      }
    });

    this.barData = {
      labels: [],
      datasets: [
        {
          label: 'Stop Duration',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: []
        },
      ]
    };
    this.setOptions(this.injected);

  }

  setOptions(injected) {
    this.options = {
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          display: false,
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Stop Duration (minute)',
          }
        }]
      },
      tooltips: {
        enable: true,
        callbacks: {
          title: function(tooltipItems, data) {
            return '';
          },
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
            return label;
          }
        }
      },
      hover: {
        animationDuration: 1
      },
      scaleValuePaddingX: 10,
      scaleValuePaddingY: 10,
      animation: {
        duration: 1000,
        onComplete: function () {
          const chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000000';
          ctx.fontSize = '1em';
          ctx.textBaseline = 'middle';
          this.data.datasets.forEach(function (dataset, i) {
            const meta = chartInstance.controller.getDatasetMeta(i);
            if (meta.hidden) {
              return;
            }
            meta.data.forEach(function (bar, index) {
              const percent = injected[i].stopPercent;
              const cost = (injected[i].actualCost ? injected[i].actualCost : '') + ' ' + (injected[i].currency ? injected[i].currency : '');

              const position = bar.tooltipPosition();
              ctx.font = '10px regular';
              ctx.fillText(percent + '%', position.x, position.y - 5);
              // ctx.fillText(percent + '%', bar._model.x, bar._model.y - 4);


              const offset = Math.abs(bar._model.base - bar._model.y) / 2;
              ctx.font = '12px regular';

              ctx.fillText(cost, bar._model.x, bar._model.y + offset);
            });
          });
        }
      }
    };
  }

  getReadableTime(time) {
    if(time)
      return ConvertUtil.longDuration2DHHMMSSTime(time)
  }


  analyze() {
    this.loader.showLoader();

    const temp = Object.assign({}, this.filterCon);
    //
    // temp.startDate =  ConvertUtil.localDateShiftAsUTC(this.filterCon.startDate);
    // temp.endDate =  ConvertUtil.localDateShiftAsUTC(this.filterCon.endDate);

    this._stopSvc.customsStopsObs(temp).subscribe(result => {
      this.details = result
      this.initializeChart(result);
    }, error => {
      this.utilities.showErrorToast(error)
    });

    this.pageFilter.actualStartTime = this.filterCon.startDate;
    this.pageFilter.actualFinishTime = this.filterCon.endDate;
    this.pageFilter.plantId = this.filterCon.plantId;
    this._stopSvc.filterObs(this.pageFilter).subscribe((res: any) => {
      this.dataTable = res['content'];
      this.pagination.currentPage = res['currentPage'];
      this.pagination.totalElements = res['totalElements'];
      this.pagination.totalPages = res['totalPages'];
      this.loader.hideLoader();
    }, err => {
      this.loader.hideLoader();
      this.utilities.showErrorToast(err);
    })
  }

  private initializeChart(injected) {

    if (injected == null) {
      return;
    }
    if (injected.length === 0) {
      this.utilities.showInfoToast('STOP-NOT-FOUND');
    }
    const newLabels = [];
    const newBardatasets = [];
    injected.forEach(item => {

      const color = this.dynamicColors();
      newBardatasets.push({
        label: item.stopCause,
        borderColor: 'rgb(' + color + ')',
        borderWidth: 1,
        data: [item.stopDurationAsMinutes],
        backgroundColor: 'rgba(' + color + ',0.5)'
      })
      ;
    });

    this.optionList = [...newBardatasets];
    this.selectedOptionList = [...newBardatasets];

    this.injected = injected;

    const me = this;

    this.setOptions(injected);
    setTimeout(() => {
      this.barData = {
        labels: newLabels,
        datasets: newBardatasets
      };
    }, 300);

  }

  onSelectOptions(event) {
    this.chart2.data.datasets = [...this.selectedOptionList];
    this.chart2.chart.update();
}

  dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };


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
    this.pageFilter.query = this.pagination.tag;
    this.analyze()
  }

}
