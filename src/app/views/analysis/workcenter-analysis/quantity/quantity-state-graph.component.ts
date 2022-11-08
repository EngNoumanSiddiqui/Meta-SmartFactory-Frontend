import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'quantity-state-graph',
  template: `
  <p-chart type="bar" [data]="barData" [options]="options" [height]="height"></p-chart>

  `
})
export class QuantityStateGraphComponent implements OnInit {

  barData: any;

  options: any;
  height = '50vh';

  @Input('quantityData') set f(quantityData) {

    if (quantityData) {
      this.initChart(quantityData.workstationAnalysisList);
      // const ht = (quantityData.workstationAnalysisList.length * 2 ) + 50;
      // this.height = ht + 'vh';
    }
    // this.loadData(filterModel);

  }

  @Input('height') set h(height: string){
    this.height = height;
  }


  constructor() {

  }

  private initChart(items) {

    this.barData = null;

    if (!items || items.length < 1) {
      return;
    }
    const labels = [];
    const goodCount = [];
    const scrapCount = [];

    // items.forEach(item => {
    //   labels.push(item.workstationName);
    //   // I Just guess the rest service will return oee value between 0-1;
    //   if (item.goodCount !== 0) {
    //     goodCount.push(item.goodCount);
    //   }
    //   if (item.scrapCount !== 0) {
    //     scrapCount.push(item.scrapCount);
    //   }
    // });

    items.forEach(item => {
      if (!item.quantityDetailList) return;
      labels.push(item.workstationName)
      let good = 0;
      let scrap = 0;

      item.quantityDetailList.forEach(quantity => {
          if (quantity.goodQuantity !== 0) {
            good = good + quantity.goodQuantity;
          }
          if (quantity.scrapQuantity !== 0) {
            scrap = scrap + quantity.scrapQuantity;
          }
      });

      goodCount.push(good);
      scrapCount.push(scrap);

  });

    this.barData = {
      labels: labels,
      datasets: [
        {
          label: 'Scrap',
          backgroundColor: '#f5712f',
          borderColor: '#e06729',

          data: scrapCount
        },
        {
          label: 'Good Count',
          backgroundColor: '#6af544',
          borderColor: '#36dd35',
          data: goodCount
        },

      ]
    };
  }


  ngOnInit() {

    this.options = {
      title: {
        display: true,
        text: 'Overall Quantity By Workstation'
      },
      tooltips: {
        mode: 'index',
        intersect: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [
          {
            stacked: true
          }
        ]
      },

    }

  }

}
