import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import * as moment from 'moment';

@Component({
  selector: 'app-shift-based-stock-reports',
  templateUrl: './shift-based-stock-reports.component.html'
})
export class ShiftBasedStockReportsComponent implements OnInit {


  @Input() plantId = null;

  shiftBasedStockReportPageFilter = {
    createDate: null,
    finishDate: moment().add(1, 'M').toDate(),
    orderByDirection: null,
    orderByProperty: null,
    organizationId: null,
    pageNumber: 1,
    pageSize: 999999,
    plantId: this.plantId,
    query: null,
    shiftStartDate: null,
    startDate: new Date(),
    stockId: null,
  }

  selectButtons = [
    {name: 'Shift View', code: 'GV'},
    {name: 'Daily View', code: 'DV'},
    {name: 'Weekly View', code: 'WV'},
    {name: 'Monthly View', code: 'MV'},
  ];
  selectedbutton = {name: 'Shift View', code: 'GV'};

  viewOptions = [
    {icon: 'pi pi-bars', code: 'table'},
    {icon: 'pi pi-th-large', code: 'graph'},
  ];
  selectedViewOption = {icon: 'pi pi-th-large', code: 'graph'};
  shiftBaseStockReports: any;
  tableData: any[];
  lineChartData: any;
  weeklyChartData: any;
  monthlyChartData: any;
  dailyChartData: any;
  lineChartOptions: any;
  trendStockWarehouseShiftReportData: any;
  constructor(private loaderService: LoaderService, 
    private utilities: UtilitiesService,
    private dateFormatPipe: DatePipe,
    private stockCardService: StockCardService) { }

  ngOnInit() {
    this.shiftBasedStockReportPageFilter.plantId = this.plantId;
    this.lineChartOptions = this.createOptions('Shift Base Stock Report');
  }
  
  filtershiftBasedStockReport() {
    this.shiftBasedStockReportPageFilter.pageNumber = 1;
    const temp = Object.assign({}, this.shiftBasedStockReportPageFilter);
    if (temp.startDate) {
      temp.startDate = ConvertUtil.localDateShiftAsUTC(temp.startDate);
    }
    if (temp.finishDate) {
      temp.finishDate = ConvertUtil.date2EndOfDay(temp.finishDate);
      temp.finishDate = ConvertUtil.localDateShiftAsUTC(temp.finishDate);
    }
    const anotherTemp: any = Object.assign({}, temp);
    delete anotherTemp['shiftStartDate'];
    anotherTemp.weekly = true;
    anotherTemp.monthly = true;
    anotherTemp.dayly= true;

    this.loaderService.showLoader();
    Promise.all([
    this.stockCardService.filterShiftBasedStockReports(temp).toPromise(),
    this.stockCardService.trendAllStockWarehouseShiftReportDto(anotherTemp).toPromise(),
    ]).then(res => {

      const result1 = res[0];
      this.trendStockWarehouseShiftReportData = res[1];

      this.loaderService.hideLoader();
      this.shiftBaseStockReports = result1['content'];
      this.shiftBaseStockReports.forEach(item => {
        item.totalAmount = parseFloat((item.totalAmount || 0).toFixed(2));
        item.incomingAmount = parseFloat((item.incomingAmount || 0).toFixed(2));
      });
      this.initializeChart(this.shiftBaseStockReports);
      this.initializeWeeklyChart(this.trendStockWarehouseShiftReportData);
      this.initializeDailyChart(this.trendStockWarehouseShiftReportData);
      this.initializeMonthlyChart(this.trendStockWarehouseShiftReportData);
      this.tableData = [...this.shiftBaseStockReports];
    }, err=> {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    })
  }

  initializeChart(items: any[]) {
    if (!items || items.length === 0) {
      return;
    }

    const incomingAmount = items.map(item => item.incomingAmount);
    const outgoingAmount = items.map(item => item.outgoingAmount);
    const currentAmount = items.map(item => item.currentAmount);
    const totalAmount = items.map(item => item.totalAmount);
    const totalProduction = items.map(item => item.totalProduction);
    const totalCost = items.map(item => item.totalCost);
    const totalProfit = items.map(item => item.totalProfit);
    const lineLabels = items.map(item => this.dateFormatPipe.transform(item.shiftStartDate, 'dd/MM/yyyy') + ' - ' + item.shiftName);
  

    this.lineChartData = {
      labels: lineLabels,
      datasets: [
        {
          label: "Incoming Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#0fb41d',
          data: incomingAmount
        }, 
        {
          label: "Outgoing Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: outgoingAmount
        }, 
        {
          label: "Current Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#3a53c0',
          data: currentAmount
        }, 
        {
          label: "Total Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#4bc0c0',
          data: totalAmount
        },
        {
          label: "Total Production",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#39ed07',
          data: totalProduction
        },
        {
          label: "Total Cost",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#d4510b',
          data: totalCost
        },
        {
          label: "Total Profit",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#047a25',
          data: totalProfit
        },
      ]
    };

  }

  initializeWeeklyChart(item: any) {
    if (!item.weeklyList || item.weeklyList.length === 0) {
      return;
    }
    const incomingAmount = item.weeklyList.map(item => item.sumIncomingAmount);
    const outgoingAmount = item.weeklyList.map(item => item.sumOutgoingAmount);
    const currentAmount = item.weeklyList.map(item => item.sumCurrentAmount);
    const totalAmount = item.weeklyList.map(item => item.sumTotalAmount);
    const totalProduction = item.weeklyList.map(item => item.sumTotalProduction);
    const lineLabels = item.weeklyList.map(item => item.groupDate);

    this.weeklyChartData = {
      labels: lineLabels,
      datasets: [
        {
          label: "Weekly Incoming Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#0fb41d',
          data: incomingAmount
        }, 
        {
          label: "Weekly Outgoing Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: outgoingAmount
        }, 
        {
          label: "Weekly Current Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#3a53c0',
          data: currentAmount
        }, 
        {
          label: "Weekly Total Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#4bc0c0',
          data: totalAmount
        },
        {
          label: "Weekly Production",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#39ed07',
          data: totalProduction
        },
      ]
    }

  }
  initializeDailyChart(item: any) {
    if (!item.dailyList || item.dailyList.length === 0) {
      return;
    }
    const incomingAmount = item.dailyList.map(item => item.sumIncomingAmount);
    const outgoingAmount = item.dailyList.map(item => item.sumOutgoingAmount);
    const currentAmount = item.dailyList.map(item => item.sumCurrentAmount);
    const totalAmount = item.dailyList.map(item => item.sumTotalAmount);
    const totalProduction = item.dailyList.map(item => item.sumTotalProduction);
    const lineLabels = item.dailyList.map(item => item.groupDate);

    this.dailyChartData = {
      labels: lineLabels,
      datasets: [
        {
          label: "Daily Incoming Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#0fb41d',
          data: incomingAmount
        }, 
        {
          label: "Daily Outgoing Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: outgoingAmount
        }, 
        {
          label: "Daily Current Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#3a53c0',
          data: currentAmount
        }, 
        {
          label: "Daily Total Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#4bc0c0',
          data: totalAmount
        },
        {
          label: "Daily Production",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#39ed07',
          data: totalProduction
        },
      ]
    }

  }

  initializeMonthlyChart(item: any) {
    if (!item.montlyList || item.montlyList.length === 0) {
      return;
    }
    const incomingAmount = item.montlyList.map(item => item.sumIncomingAmount);
    const outgoingAmount = item.montlyList.map(item => item.sumOutgoingAmount);
    const currentAmount = item.montlyList.map(item => item.sumCurrentAmount);
    const totalAmount = item.montlyList.map(item => item.sumTotalAmount);
    const totalProduction = item.montlyList.map(item => item.sumTotalProduction);
    const lineLabels = item.montlyList.map(item => item.groupDate);

    this.monthlyChartData = {
      labels: lineLabels,
      datasets: [
        {
          label: "Monthly Incoming Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#0fb41d',
          data: incomingAmount
        }, 
        {
          label: "Monthly Outgoing Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#ff9c3d',
          data: outgoingAmount
        }, 
        {
          label: "Monthly Current Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#3a53c0',
          data: currentAmount
        }, 
        {
          label: "Monthly Total Amount",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#4bc0c0',
          data: totalAmount
        },
        {
          label: "Monthly Production",
          fill: false,
          tension: 0.4,
          pointBorderWidth: 0.4,
          borderColor: '#39ed07',
          data: totalProduction
        },
      ]
    }

  }
  createOptions(yLabel) {
    return {
      elements: {
        line: {
          tension: 0 // disables bezier curves
        }
      },
      fill: false,
      responsive: true,
      scales: {
        xAxes: [{
          // type: 'time',
          display: true,
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 30
          },

          // time: {
          //   unit: 'hour',
          // },
          scaleLabel: {
            display: true,
            labelString: 'Time',
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: yLabel,
          }
        }]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#000000',
        }
      },
      // animation: {
      //   onComplete: function () {

      //     var scale = window.devicePixelRatio;                       

      //     var sourceCanvas = this.chart.canvas;
      //     var copyWidth = this.scales['y-axis-0'].width - 10;
      //     var copyHeight = this.scales['y-axis-0'].height + this.scales['y-axis-0'].top + 10;

      //     var targetCtx = this.chart.canvas.getContext("2d");

      //     targetCtx.scale(scale, scale);
      //     targetCtx.canvas.width = copyWidth * scale;
      //     targetCtx.canvas.height = copyHeight * scale;

      //     targetCtx.canvas.style.width = `${copyWidth}px`;
      //     targetCtx.canvas.style.height = `${copyHeight}px`;
      //     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);

      //     var sourceCtx = sourceCanvas.getContext('2d');

      //     // Normalize coordinate system to use css pixels.

      //     sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);

      //   },
      //   onProgress: function () {
      //     var copyWidth = this.scales['y-axis-0'].width;
      //     var copyHeight = this.scales['y-axis-0'].height + this.scales['y-axis-0'].top + 10;
      //     var sourceCtx = this.chart.canvas.getContext('2d');
      //     sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
      //   }
      // },

    };
  }

}
