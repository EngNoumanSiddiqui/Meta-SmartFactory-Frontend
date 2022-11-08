import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../util/convert-util';
import {ResponseWorkstationReportDto} from '../../../../dto/analysis/daily-report/workstation-order-report';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'production-quantity-anlyz',
  templateUrl: './production-quantity.component.html'
})
export class ProductQuantityAnlyzComponent implements OnInit {
  barData: any;
  options: any;
  sitems: Array<ResponseWorkstationReportDto>;

  @Input('items') set x(items) {
    this.resetChartS();
    this.initializeChart(items);
    this.sitems = items;
  }

  constructor(private datePipe: DatePipe) {


  }


  ngOnInit(): void {

  }

  private resetChartS() {
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


  initializeChart(items: ResponseWorkstationReportDto[]) {

    if (!items || items.length === 0) {
      return;
    }

    const newLabels = [];
    const productionData = [];

    items.forEach(item => {
      const shiftStartDate = this.datePipe.transform(ConvertUtil.localDate2UTC(item.shiftStartDate), 'dd.MM.yyyy HH:mm');
      newLabels.push(shiftStartDate);
      const pow = item.powerConsumption.toFixed(2);
      productionData.push(pow);
    });
    const production = this.getDataSetItem('#3db245', 'Power Consumption', productionData);

    this.barData = {
      labels: newLabels,
      datasets: [production]
    };


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
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Power',
          }
        }]
      },
      tooltips: {
        enabled: true
      },
      hover: {
        animationDuration: 1
      },

      animation: {
        duration: 2000,
        // onComplete: function () {
        //   const chartInstance = this.chart,
        //     ctx = chartInstance.ctx;
        //   ctx.textAlign = 'center';
        //   ctx.fillStyle = '#000000';
        //   ctx.fontSize = '1em';
        //   ctx.textBaseline = 'middle';
        //   this.data.datasets.forEach(function (dataset, i) {
        //     const meta = chartInstance.controller.getDatasetMeta(i);
        //     if (meta.hidden) {
        //       return;
        //     }
        //     meta.data.forEach(function (bar, index) {
        //       let percent = '';
        //       switch (i) {
        //         case 0: // job load time
        //           percent = '' + items[index].totalProductionQuantity;
        //           break;
        //         // case 1: // stop duration
        //         //   percent = '' + items[index].totalDefectQuantity;
        //         //   break;
        //       }
        //       ctx.fillText(percent, bar._model.x, bar._model.y - 4);
        //
        //     });
        //   });
        // }
      }
    };

  }

  private getDataSetItem(hexColor, label, data) {

    return {
      label: label,
      fill: false, // for bar just comment here
      backgroundColor: ConvertUtil.hexToRGB(hexColor, 0.7),
      borderColor: hexColor,
      borderWidth: 1,
      data: data
    }
  }

}
