import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { StockCardService } from 'app/services/dto-services/stock/stock.service';
import { LoaderService } from 'app/services/shared/loader.service';
import { UtilitiesService } from 'app/services/utilities.service';
import { ConvertUtil } from 'app/util/convert-util';
import { ReservedColor } from 'app/util/reserved-color';
import * as moment from 'moment';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html'
})
export class StockReportsAdvanceChartComponent implements OnInit {


  @Input() plantId = null;

  showBy = "totalAmount";
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
    outputStockId: null,
  }

  reOrderPointChecked = false;

  selectButtons = [
    {name: 'Graph View', code: 'GV'},
    // {name: 'List View', code: 'LV'},
    {name: 'Daily View', code: 'DV'},
    {name: 'Weekly View', code: 'WV'},
    {name: 'Monthly View', code: 'MV'},
  ];
  selectedbutton = {name: 'Graph View', code: 'GV'};

  stockTypes = [
    {name: 'All', value: 4},
    {name: 'Raw Material', value: 1},
    {name: 'Semi Finished', value: 2},
    {name: 'Finished Product', value: 3},
  ];
  selectedType = {name: 'All', value: 4};
  selectedStock = null;

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
  shiftBaseStockFilteredReports: any;
  stockList: any[];
  constructor(private loaderService: LoaderService, 
    private utilities: UtilitiesService,
    private dateFormatPipe: DatePipe,
    private stockCardService: StockCardService) { }

  ngOnInit() {
    this.shiftBasedStockReportPageFilter.plantId = this.plantId;
    this.lineChartOptions = this.createOptions('Stock Report');
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
    anotherTemp.stockId = anotherTemp.outputStockId;
    delete anotherTemp['outputStockId'];
    anotherTemp.weekly = true;
    anotherTemp.monthly = true;
    anotherTemp.dayly= true;

    this.loaderService.showLoader();
    Promise.all([
    this.stockCardService.filterStockWareHouseShiftProdJobReport(temp).toPromise(),
    this.stockCardService.getTrendAllProdStockWarehouseShiftProdJobReport(anotherTemp).toPromise(),
    ]).then(res => {
      this.trendStockWarehouseShiftReportData = res[1];
      this.loaderService.hideLoader();
      this.shiftBaseStockReports = res[0]['content'];
      this.shiftBaseStockFilteredReports = {...this.shiftBaseStockReports};
      const nodeList = [];
      Object.keys(this.shiftBaseStockFilteredReports).forEach(key => {
        const node = this.shiftBaseStockFilteredReports[key];
        nodeList.push([...node]);
      })
      this.tableData = [].concat.apply([], nodeList);
      this.stockList = [...new Map(this.tableData.map(item =>
        [item['stockId'], item])).values()];
      this.onShowBy(this.showBy);
      this.initializeWeeklyChart(this.trendStockWarehouseShiftReportData);
      this.initializeDailyChart(this.trendStockWarehouseShiftReportData);
      this.initializeMonthlyChart(this.trendStockWarehouseShiftReportData);

    }, err=> {
      this.loaderService.hideLoader();
      this.utilities.showErrorToast(err);
    })
  }


  onStockChange(event) {
    this.selectedType = {name: 'All', value: 4};
    if(this.selectedStock) {
      for (const key in this.shiftBaseStockReports) {
        if (Object.prototype.hasOwnProperty.call(this.shiftBaseStockReports, key) &&
          +key === this.selectedStock.stockId) {
          this.shiftBaseStockFilteredReports = {key: this.shiftBaseStockReports[key]};
          break;
        } else {
          this.shiftBaseStockFilteredReports = {key: []};
        }
      }
    } else {
      this.shiftBaseStockFilteredReports = {...this.shiftBaseStockReports};
    }

    this.onShowBy(this.showBy);
  }

  onStockTypeChange(event) {
    if(this.selectedType) {
      if(this.selectedType.value === 4) {
        this.shiftBaseStockFilteredReports = {...this.shiftBaseStockReports};
      } else {
        for (const key in this.shiftBaseStockReports) {
          if (Object.prototype.hasOwnProperty.call(this.shiftBaseStockReports, key) &&
          this.shiftBaseStockReports[key][0]?.stockTypeId === this.selectedType.value) {
            this.shiftBaseStockFilteredReports = {key: this.shiftBaseStockReports[key]};
            break;
          } else {
            this.shiftBaseStockFilteredReports = {key: []};
          }
        }
      }
      
    } else {
      this.shiftBaseStockFilteredReports = {...this.shiftBaseStockReports};
    }

    this.onShowBy(this.showBy);
  }
 
  onShowBy(event: any) {
    const datasets = [];
      let mainLineLabels = [];
      let maxLength = 0;
      for (const key in this.shiftBaseStockFilteredReports) {
        if (Object.prototype.hasOwnProperty.call(this.shiftBaseStockFilteredReports, key)) {
          const stockList = this.shiftBaseStockFilteredReports[key];
          if(stockList.length >= maxLength){
            maxLength = stockList.length;
            mainLineLabels = stockList.map(item => this.dateFormatPipe.transform(item.shiftStartDate, 'dd/MM/yyyy') + ' - ' + item.shiftName);
          }
        }
      }
      for (const key in this.shiftBaseStockFilteredReports) {
        if(Object.prototype.hasOwnProperty.call(this.shiftBaseStockFilteredReports, key)){
          const stockList = this.shiftBaseStockFilteredReports[key];
          const totalAmount = [];
          const reOrderAmount = [];
          // const sumTotalAmount = [];
          for (let index = 0; index < mainLineLabels.length; index++) {
            const lineLabel = mainLineLabels[index];
            const stock = stockList?.find(item => (this.dateFormatPipe.transform(item.shiftStartDate, 'dd/MM/yyyy') + ' - ' + item.shiftName) === lineLabel);
            if(stock) {
              switch (this.showBy) {
                case 'totalAmount':
                  totalAmount.push(stock.totalAmount);
                  break;
                case 'incommingAmount':
                  totalAmount.push(stock.incomingAmount);
                  break;
                case 'outgoingAmount':
                  totalAmount.push(stock.outgoingAmount);
                  break;
                case 'totalProduction':
                  totalAmount.push(stock.totalProduction);
                  break;
                case 'totalCost':
                  totalAmount.push(stock.totalCost);
                  break;
                case 'totalProfit':
                  totalAmount.push(stock.totalProfit);
                  break;
                default:
                  totalAmount.push(stock.totalAmount);
                  break;
              }  
              
              reOrderAmount.push(stock.stockStrategy?.reorderPoint || 0);
              // let totalFroSumAmount = 0;
              // this.trendForShiftProdJobStockWarehouseShiftReportData.forEach(jbTrend => {
              //   let date1 = new Date(stock.shiftStartDate);
              //   let splitterDate = jbTrend.groupDate.split('-');
              //   let date2 = new Date(splitterDate[2]+ '-'+ (Number(splitterDate[1]) < 10 ? '0'+splitterDate[1]: splitterDate[1]) + '-'+ splitterDate[0]);
              //   if(date2.getTime() <= date1.getTime() && jbTrend.stockId === stock.stockId) {
              //     switch (this.showBy) {
              //       case 'totalAmount':
              //         totalFroSumAmount = jbTrend.sumTotalAmount;
              //         break;
              //       case 'incommingAmount':
              //         totalFroSumAmount = jbTrend.sumIncomingAmount;
              //         break;
              //       case 'outgoingAmount':
              //         totalFroSumAmount = jbTrend.sumOutgoingAmount;
              //         break;
              //       case 'totalProduction':
              //         totalFroSumAmount = jbTrend.sumTotalProduction;
              //         break;
              //       default:
              //         totalFroSumAmount = jbTrend.sumTotalAmount;
              //         break;
              //     } 
              //   }
              // });
              // sumTotalAmount.push(totalFroSumAmount);
            } else {
              totalAmount.push(NaN);
              reOrderAmount.push(NaN);
              // sumTotalAmount.push(NaN);
            }
          }

          if(stockList && stockList.length > 0) {
            const color = this.randomColor();
            const reservedColor = ReservedColor.GetColor(stockList[0].stockNo);
            if(!reservedColor) {
              ReservedColor.AddColor(color, stockList[0].stockNo);
            }
            datasets.push({
              label: stockList[0].stockNo + ' - ' +stockList[0].stockName,
              fill: false,
              tension: 0.4,
              pointBorderWidth: 0.4,
              backgroundColor: reservedColor ? reservedColor : color , 
              borderColor: reservedColor ? reservedColor : color ,
              data: totalAmount
            });
            if(this.reOrderPointChecked) {
              datasets.push({
                label: 'Reorder - ' +stockList[0].stockNo + ' - ' +stockList[0].stockName,
                fill: false,
                tension: 0.4,
                pointRadius: 0.1,
                borderColor: reservedColor ? reservedColor : color ,
                backgroundColor: reservedColor ? reservedColor : color , 
                data: reOrderAmount
              });
            }
          }
          
         
          // if(sumTotalAmount && sumTotalAmount.length) {
          //   datasets.push({
          //     label: (this.showDaily? 'Daily' : (this.showMonthly? 'Monthly' : 'Weekly')) + ' - ' + stockList[0].stockNo + ' - ' +stockList[0].stockName,
          //     fill: false,
          //     tension: 0.4,
          //     pointBorderWidth: 0.4,
          //     borderColor: this.randomColor(),
          //     data: sumTotalAmount
          //   });
          // }
         
        }
      }
      this.lineChartData = {
        labels: mainLineLabels,
        datasets: datasets
      };
  }

  randomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
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
