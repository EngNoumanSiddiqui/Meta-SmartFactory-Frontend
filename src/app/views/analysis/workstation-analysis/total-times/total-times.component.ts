import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../../util/convert-util';
import {ResponseWorkstationReportDto} from '../../../../dto/analysis/daily-report/workstation-order-report';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'total-times',
  templateUrl: './total-times.component.html'
})
export class TotalTimesComponent implements OnInit {
  barData: any;
  options: any;
  sitems: Array<ResponseWorkstationReportDto>;

  @Input('items') set x(items) {
    this.resetChartS();
    this.initializeChart(items);
    this.sitems = items;
  }

  constructor(private dateFormatPipe: DatePipe) {


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
    const jobLoadTimeData = [];

    const netWorkingTimeData = [];

    const me = this;
    items.forEach(item => {

      const shiftStartDate = this.dateFormatPipe.transform(ConvertUtil.localDate2UTC(item.shiftStartDate), 'dd.MM.yyyy HH:mm');
      newLabels.push(shiftStartDate);
      jobLoadTimeData.push(me.seconds2Min(item.jobWaitingTime));
      netWorkingTimeData.push(me.seconds2Min(item.netWorkingTime));
    });
    const jobLoadTime = this.getDataSetItem('#3181ff', 'Job Waiting time', jobLoadTimeData);
    const netWorkingTime = this.getDataSetItem('#3db245', 'Net Working Time', netWorkingTimeData);

    this.barData = {
      labels: newLabels,
      datasets: [jobLoadTime, netWorkingTime]
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
            labelString: 'Time (min)',
          }
        }]
      },
      tooltips: {
        enable: true,
        callbacks: {
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
        //           percent = items[index].jobLoadedTime;
        //           break;
        //         case 1: // stop duration
        //           percent = items[index].stopDuration;
        //           break;
        //         case 2: // net working time
        //           percent = items[index].netWorkingTime;
        //           break;
        //       }
        //       ctx.fillText(percent, bar._model.x, bar._model.y - 4);
        //
        //     });
        //   });
        // }
      }
    };


  }

  seconds2Min(seconds) {
    if (seconds) {
      return seconds / 60;
    }
    return 0;
  }

  private getDataSetItem(hexColor, label, data) {

    return {
      label: label,
      fill: false,// for bar just comment here
      backgroundColor: ConvertUtil.hexToRGB(hexColor, 0.7),
      borderColor: hexColor,
      borderWidth: 1,
      data: data
    }
  }

}
