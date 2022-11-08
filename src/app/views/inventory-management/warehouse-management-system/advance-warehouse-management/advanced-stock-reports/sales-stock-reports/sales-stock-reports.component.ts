import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { ReservedColor } from 'app/util/reserved-color';
import * as moment from 'moment';

@Component({
  selector: 'app-sales-stock-reports',
  templateUrl: './sales-stock-reports.component.html'
})
export class SalesStockReportsAdvanceChartComponent implements OnInit {


  @Input() plantId = null;
  shiftBasedStockReportPageFilter = {
    "dayly": true,
    "monthly": true,
    "query": null,
    "weekly": true,
    finishDate: moment().add(1, 'M').toDate(),
    orderByDirection: null,
    orderByProperty: null,
    pageNumber: 1,
    pageSize: 999999,
    plantId: this.plantId,
    startDate: new Date(),
    stockId: null,
  }

  showBy = "totalAmount";

  dailyHeight = 500;
  weeklyHeight = 500;
  monthlyHeight = 500;

  selectButtons = [
    {name: 'Daily View', code: 'DV'},
    {name: 'Weekly View', code: 'WV'},
    {name: 'Monthly View', code: 'MV'}
  ];
  selectedbutton = {name: 'Daily View', code: 'DV'};
  viewOptions = [
    {icon: 'pi pi-bars', code: 'table'},
    {icon: 'pi pi-th-large', code: 'graph'},
  ];
  selectedViewOption = {icon: 'pi pi-th-large', code: 'graph'};
  lineChartData: any;
  weeklyChartData: any;
  monthlyChartData: any;
  dailyChartData: any;
  lineChartOptions: any;
  trendStockWarehouseShiftReportData: any;
  mainTrendStockWarehouseShiftReportData: any;

  stockTypes = [
    {name: 'All', value: 4},
    {name: 'Raw Material', value: 1},
    {name: 'Semi Finished', value: 2},
    {name: 'Finished Product', value: 3},
  ];
  selectedType = {name: 'All', value: 4};
  selectedStock = null;
  stockList: any[];

  constructor(private loaderService: LoaderService, 
    private utilities: UtilitiesService,
    private dateFormatPipe: DatePipe,
    private stockCardService: StockCardService) { }

  ngOnInit() {
    this.shiftBasedStockReportPageFilter.plantId = this.plantId;
    this.lineChartOptions = this.createOptions('Sales Stock Report');
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
    this.loaderService.showLoader();
    Promise.all([
    this.stockCardService.getTrendAllSalesStockWarehouseShiftProdJobReport(temp).toPromise(),
    ]).then(res => {
      this.trendStockWarehouseShiftReportData = res[0];
      this.mainTrendStockWarehouseShiftReportData = {...this.trendStockWarehouseShiftReportData};

      this.stockList = [...new Map(this.mainTrendStockWarehouseShiftReportData.montlyList.map(item =>
        [item['stockId'], item])).values()];
      this.loaderService.hideLoader();
      this.dailyHeight = 500;
      this.weeklyHeight = 500;
      this.monthlyHeight = 500;
      this.initializeMonthlyChart();
      this.initializeWeeklyChart();  
      this.initializeDailyChart();
    }, err=> {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    })
  }

 
  onStockChange(event) {
    this.selectedType = {name: 'All', value: 4};
    if(this.selectedStock) {
      for (const key in this.mainTrendStockWarehouseShiftReportData) {
        if (Object.prototype.hasOwnProperty.call(this.mainTrendStockWarehouseShiftReportData, key) && 
        this.mainTrendStockWarehouseShiftReportData[key].length > 0) {
          const filteredData = this.mainTrendStockWarehouseShiftReportData[key].filter(itm => itm.stockId === this.selectedStock.stockId);
          this.trendStockWarehouseShiftReportData[key] =  filteredData;
        } else {
          this.trendStockWarehouseShiftReportData[key] =  [];
        }
      }
    } else {
      this.trendStockWarehouseShiftReportData= {...this.mainTrendStockWarehouseShiftReportData};
    }

    this.onShowBy(this.showBy);
    this.dailyHeight = 500;
    this.weeklyHeight = 500;
    this.monthlyHeight = 500;
    this.initializeMonthlyChart();
    this.initializeWeeklyChart();  
    this.initializeDailyChart();
  }

  onStockTypeChange(event) {

    if(this.selectedType) {
      if(this.selectedType.value === 4) {
        this.trendStockWarehouseShiftReportData= {...this.mainTrendStockWarehouseShiftReportData};
      } else {
        for (const key in this.mainTrendStockWarehouseShiftReportData) {
          if (Object.prototype.hasOwnProperty.call(this.mainTrendStockWarehouseShiftReportData, key) && this.mainTrendStockWarehouseShiftReportData[key].length > 0) {
            const filteredData = this.mainTrendStockWarehouseShiftReportData[key].filter(itm => itm.stockTypeId === this.selectedType.value);
            this.trendStockWarehouseShiftReportData[key] =  filteredData;
          } else {
            this.trendStockWarehouseShiftReportData[key] =  [];
          }
        
        }
      }
      
    } else {
      this.trendStockWarehouseShiftReportData= {...this.mainTrendStockWarehouseShiftReportData};
    }

    this.onShowBy(this.showBy);
    this.dailyHeight = 500;
    this.weeklyHeight = 500;
    this.monthlyHeight = 500;
    this.initializeMonthlyChart();
    this.initializeWeeklyChart();  
    this.initializeDailyChart();
  }

  randomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  onShowBy(event) {
    this.dailyHeight = 500;
    this.weeklyHeight = 500;
    this.monthlyHeight = 500;
    if(this.selectedbutton.code=='WV') {
      this.initializeWeeklyChart();
    } else if(this.selectedbutton.code=='DV') {
      this.initializeDailyChart();
    } else if(this.selectedbutton.code=='MV') {
      this.initializeMonthlyChart();
    }
  }
  initializeWeeklyChart() {
    if (!this.trendStockWarehouseShiftReportData || !this.trendStockWarehouseShiftReportData.weeklyList || this.trendStockWarehouseShiftReportData.weeklyList.length === 0) {
      this.weeklyChartData = {
        labels: [],
        datasets: []
      }
      return;
    }
    let results = this.trendStockWarehouseShiftReportData.weeklyList.reduce(function(results, org) {
      (results[org.stockId] = results[org.stockId] || []).push(org);
      return results;
    }, {});

    const lineLabels = [...new Set(this.trendStockWarehouseShiftReportData.weeklyList.map(item => item.groupDate))];
    const datasets = [];
    for (const key in results) {
      this.weeklyHeight = this.weeklyHeight + 5;
      const stockList = results[key];
      const totalAmount = [];
      for (let index = 0; index < lineLabels.length; index++) {
        const lineLabel = lineLabels[index];
        const stock = stockList.find(item => item.groupDate === lineLabel);
        if(stock) {
          switch (this.showBy) {
            case 'totalAmount':
              totalAmount.push(stock.sumTotalAmount);
              break;
            case 'incommingAmount':
              totalAmount.push(stock.sumIncomingAmount);
              break;
            case 'outgoingAmount':
              totalAmount.push(stock.sumOutgoingAmount);
              break;
            case 'totalProduction':
              totalAmount.push(stock.sumTotalProduction);
              break;
            default:
              totalAmount.push(stock.sumTotalAmount);
              break;
          }  
        } else {
          totalAmount.push(NaN);
        }
      }

      let color = ReservedColor.GetColor(stockList[0].stockNo);
      datasets.push({
        label: stockList[0].stockNo + ' - ' +stockList[0].stockName,
        fill: false,
        tension: 0.4,
        pointBorderWidth: 0.4,
        borderColor: color ? color : ReservedColor.AddColor(this.randomColor(), stockList[0].stockNo),
        data: totalAmount
      });
    } 

    this.weeklyChartData = {
      labels: lineLabels,
      datasets: datasets
    }

    this.weeklyHeight = this.weeklyHeight;

  }
  initializeDailyChart() {
    if (!this.trendStockWarehouseShiftReportData|| !this.trendStockWarehouseShiftReportData.dailyList || this.trendStockWarehouseShiftReportData.dailyList.length === 0) {
      this.dailyChartData = {
        labels: [],
        datasets: []
      }
      return;
    }
    let results = this.trendStockWarehouseShiftReportData.dailyList.reduce(function(results, org) {
      (results[org.stockId] = results[org.stockId] || []).push(org);
      return results;
    }, {});

    const lineLabels = [...new Set(this.trendStockWarehouseShiftReportData.dailyList.map(item => item.groupDate))];
    const datasets = [];
    for (const key in results) {
      const stockList = results[key];
      this.dailyHeight = this.dailyHeight + 5;
      const totalAmount = [];
      for (let index = 0; index < lineLabels.length; index++) {
        const lineLabel = lineLabels[index];
        const stock = stockList.find(item => item.groupDate === lineLabel);
        if(stock) {
          switch (this.showBy) {
            case 'totalAmount':
              totalAmount.push(stock.sumTotalAmount);
              break;
            case 'incommingAmount':
              totalAmount.push(stock.sumIncomingAmount);
              break;
            case 'outgoingAmount':
              totalAmount.push(stock.sumOutgoingAmount);
              break;
            case 'totalProduction':
              totalAmount.push(stock.sumTotalProduction);
              break;
            default:
              totalAmount.push(stock.sumTotalAmount);
              break;
          }  
        } else {
          totalAmount.push(NaN);
        }
      }
      let color = ReservedColor.GetColor(stockList[0].stockNo);
      datasets.push({
        label: stockList[0].stockNo + ' - ' +stockList[0].stockName,
        fill: false,
        tension: 0.4,
        pointBorderWidth: 0.4,
        borderColor: color ? color : ReservedColor.AddColor(this.randomColor(), stockList[0].stockNo),
        data: totalAmount
      });
    } 

    this.dailyChartData = {
      labels: lineLabels,
      datasets: datasets
    }

    this.dailyHeight = this.dailyHeight;

    // this.dailyChartData = {
    //   labels: lineLabels,
    //   datasets: [
    //     {
    //       label: "Daily Incoming Amount",
    //       fill: false,
    //       tension: 0.4,
    //       pointBorderWidth: 0.4,
    //       borderColor: '#0fb41d',
    //       data: incomingAmount
    //     }, 
    //     {
    //       label: "Daily Outgoing Amount",
    //       fill: false,
    //       tension: 0.4,
    //       pointBorderWidth: 0.4,
    //       borderColor: '#ff9c3d',
    //       data: outgoingAmount
    //     }, 
    //     {
    //       label: "Daily Current Amount",
    //       fill: false,
    //       tension: 0.4,
    //       pointBorderWidth: 0.4,
    //       borderColor: '#3a53c0',
    //       data: currentAmount
    //     }, 
    //     {
    //       label: "Daily Total Amount",
    //       fill: false,
    //       tension: 0.4,
    //       pointBorderWidth: 0.4,
    //       borderColor: '#4bc0c0',
    //       data: totalAmount
    //     },
    //     {
    //       label: "Daily Production",
    //       fill: false,
    //       tension: 0.4,
    //       pointBorderWidth: 0.4,
    //       borderColor: '#39ed07',
    //       data: totalProduction
    //     },
    //   ]
    // }

  }
  initializeMonthlyChart() {
    if (!this.trendStockWarehouseShiftReportData ||!this.trendStockWarehouseShiftReportData.montlyList || this.trendStockWarehouseShiftReportData.montlyList.length === 0) {
      this.monthlyChartData = {
        labels: [],
        datasets: []
      }
      return;
    }
    let results = this.trendStockWarehouseShiftReportData.montlyList.reduce(function(results, org) {
      (results[org.stockId] = results[org.stockId] || []).push(org);
      return results;
    }, {});

    const lineLabels = [...new Set(this.trendStockWarehouseShiftReportData.montlyList.map(item => item.groupDate))];
    const datasets = [];
    for (const key in results) {
      const stockList = results[key];
      this.monthlyHeight = this.monthlyHeight + 5;
      const totalAmount = [];
      for (let index = 0; index < lineLabels.length; index++) {
        const lineLabel = lineLabels[index];
        const stock = stockList.find(item => item.groupDate === lineLabel);
        if(stock) {
          switch (this.showBy) {
            case 'totalAmount':
              totalAmount.push(stock.sumTotalAmount);
              break;
            case 'incommingAmount':
              totalAmount.push(stock.sumIncomingAmount);
              break;
            case 'outgoingAmount':
              totalAmount.push(stock.sumOutgoingAmount);
              break;
            case 'totalProduction':
              totalAmount.push(stock.sumTotalProduction);
              break;
            default:
              totalAmount.push(stock.sumTotalAmount);
              break;
          }  
        } else {
          totalAmount.push(NaN);
        }
      }

      let color = ReservedColor.GetColor(stockList[0].stockNo);
      datasets.push({
        label: stockList[0].stockNo + ' - ' +stockList[0].stockName,
        fill: false,
        tension: 0.4,
        pointBorderWidth: 0.4,
        borderColor: color ? color : ReservedColor.AddColor(this.randomColor(), stockList[0].stockNo),
        data: totalAmount
      });
    } 

    this.monthlyChartData = {
      labels: lineLabels,
      datasets: datasets
    }
    this.monthlyHeight = this.monthlyHeight;
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
