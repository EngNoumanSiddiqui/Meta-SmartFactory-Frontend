import {Component, Input, OnInit} from '@angular/core';
import {ConvertUtil} from '../../../util/convert-util';


@Component({
  selector: 'scrap-rework-chart-component',
  template: `
    <p-chart *ngIf="injected" type="bar" [data]="barData" [options]="options" [height]="'238px'"></p-chart>`
})
export class ScrapReworkChartTemplateComponent implements OnInit {
  barData: any;
  options: any;
  injected: any;


  @Input('injected')
  set in(injected) {
    this.injected = injected;
    this.initializeCharts(this.injected);
  }


  constructor() {

  }

  ngOnInit(): void {
  }


  private initializeCharts(injected: Array<any>) {
    this.barData = null;

    if (injected == null) {
      return;
    }
    const newLabels = [];
    const newScrapIds = [];
    const newBardatasets = [];
    const result = injected.reduce((r, a) => {
      if(a.scrapType) {
        r[a.scrapType.scrapDescription] = r[a.scrapType.scrapDescription] || [];
        r[a.scrapType.scrapDescription].push(a);
        return r;
      }
    }, Object.create(null));
    
    for (let key in result) {
      if (result[key]) {
        const itemList: Array<any> = result[key];
        for (let index = 0; index < itemList.length; index++) {
          const element = itemList[index];
          newLabels.push(element.scrapCause?.scrapCauseName);
          newScrapIds.push(element.scrapId);
        }
      }
    }
    for (let key in result) {
      if (result[key]) {
        const itemList: Array<any> = result[key];   
        let borderColor = ConvertUtil.dynamicRGBColors();
        let backColor = ConvertUtil.dynamicRGBColors(0.5);
        const dataSetItem = {
          label: key,
          borderColor: borderColor,
          borderWidth: 0,
          data: [],
          backgroundColor: backColor
        }

        newScrapIds.forEach((item: any) => {
          const itm = itemList.find(inj => inj.scrapId === item);
          if(itm) {
            dataSetItem.data.push(itm.quantity);
          } else {
            dataSetItem.data.push(0);
          }
        })
      
        // for (let index = 0; index < injected.length; index++) {
        //     const itm = itemList.find(inj => inj.scrapId === injected[index].scrapId);
        //       //   itm.scrapType.scrapTypeId === inj.scrapType.scrapTypeId 
        //       //   && itm.scrapCause.scrapCauseId === inj.scrapCause.scrapCauseId);;
        //     // const item = injected.find(inj => itm.scrapType && itm.scrapCause && inj.scrapType && inj.scrapCause &&
        //     //   itm.scrapType.scrapTypeId === inj.scrapType.scrapTypeId 
        //     //   && itm.scrapCause.scrapCauseId === inj.scrapCause.scrapCauseId);
        //     if(itm) {
        //       dataSetItem.data.push(itm.quantity);
        //     } else {
        //       dataSetItem.data.push(0);
        //     }
        //   // if(key === newLabels[index]) {
        //   //   const element = itemList[index];
        //   //   // newLabels.push(element.scrapCause?.scrapCauseName);
        //   //   dataSetItem.data.push(element.quantity);
        //   // } else {
        //   //   dataSetItem.data.push(0);
        //   // }
        // }

        newBardatasets.push({...dataSetItem});

      }
    }

    // injected.forEach(item => {

    //   let borderColor = ConvertUtil.dynamicRGBColors();
    //   let backColor = ConvertUtil.dynamicRGBColors(0.5);

    //   if (item.color) {
    //     borderColor = ConvertUtil.hexToRGB(item.color)
    //     backColor = ConvertUtil.hexToRGB(item.color, 0.5)
    //   }

    //   newBardatasets.push({
    //     label: item.scrapCause?.scrapCauseName,
    //     borderColor: borderColor,
    //     borderWidth: 1,
    //     data: [item.quantity],
    //     backgroundColor: backColor
    //   })

    //   ;
    // });

    this.barData = {
      labels: newLabels,
      datasets: newBardatasets
    };
    this.options = {
      fill: false,
      responsive: true,
      barValueSpacing: 20,
      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            display: false
          },
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: 'rgba(255,255,255,0.8)'
          },
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Quantities',
            fontColor: 'rgba(255,255,255,0.8)',
          },
          gridLines: {
            color: 'rgba(200,200,200,0.4)',
            lineWidth: 1
          },
        }]
      },
      
      tooltips: {
        enable: true,
        callbacks: {
          title: function(tooltipItem, data) {
            // const list = result[tooltipItem[0].xLabel];
            // const index = tooltipItem[0].datasetIndex;
            // const label = list[index]?.scrapCause?.scrapCauseName
            return 'Scrap Cause : ' + tooltipItem[0].label;
            // return 'Scrap Cause : ' + data.datasets[tooltipItem[0].datasetIndex]?.label
            // return data['labels'][tooltipItem[0]['index']];
          },
          label: function(tooltipItem, data) {
            return 'Quantity : ' + tooltipItem.yLabel;
            // return data['datasets'][0]['data'][tooltipItem['index']];
          },
          afterLabel: function(tooltipItem, data) {
            // return 'Scrap Type : ' + result[tooltipItem.label][tooltipItem.datasetIndex]?.scrapType?.scrapDescription;
            return 'Scrap Type : ' + data['datasets'][tooltipItem['datasetIndex']].label;
            // var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
            // return '(' + percent + '%)';
          }
          // title: (items, data) => data.datasets[items[0].datasetIndex].data[items[0].index].myProperty1,
          // label: (item, data) => data.datasets[item.datasetIndex].data[item.index].myProperty2
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
          // const chartInstance = this.chart,
          //   ctx = chartInstance.ctx;
          //   ctx.textAlign = 'center';
          //   ctx.fillStyle = '#d6d6d6';
          //   const fontSize = 18;

          //   ctx.fontSize = fontSize;
          //   ctx.textBaseline = 'middle';
          //   this.data.datasets.forEach(function (dataset, i) {
          //     const meta = chartInstance.controller.getDatasetMeta(i);
          //     if (!meta.hidden) {
          //       meta.data.forEach(function (bar, index) {

          //         const percent = injected[i].stopPercent;
          //         const padding = 4;
          //         const position = bar.tooltipPosition();
          //         ctx.fillText(percent + '%', position.x, position.y - (fontSize / 2) + padding);

          //       });
          //     }
          // });
        }
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#e9e9e0',
          fontSize: 10,
          boxWidth: 25,

        }
      },
    };
    

  }

  dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return '' + r + ',' + g + ',' + b;
  };


}
