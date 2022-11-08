import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConvertUtil } from 'app/util/convert-util';
import { DatePipe } from '@angular/common';
import { UIChart } from 'primeng';

@Component({
    selector: 'quantity-state-line-graph',
    template: `
    <div class="row col-md-12">
        <strong>Day:</strong> <span style="align-self: center; margin-left: 4px;">{{fullData.day | date:'dd.MM.yyy'}}</span>
        <p-checkbox class="ml-auto" [(ngModel)]="showQuantities" binary="true" (onChange)="onShowQuantities($event)" label="Show Quantities"></p-checkbox>
    </div>
    <br>
    <div class="row col-md-12">
        <p-multiSelect [options]="goodQuantitiesList" [(ngModel)]="selectedGoodQuantities" 
            defaultLabel="{{'select-goods' | translate}}" [style]="{minWidth: '200px'}" optionLabel="label" (ngModelChange)="onSelectGoodQuantites($event)"></p-multiSelect>
    </div>
    <p-chart type="bar" [data]="barData" [options]="options" [height]="height" #chart1 id="chart"></p-chart>
    <div class="row col-md-12">
        <p-multiSelect [options]="scrapQuantitiesList" [(ngModel)]="selectedScrapQuantities" 
            defaultLabel="{{'select-goods' | translate}}" [style]="{minWidth: '200px'}" 
            optionLabel="label" (ngModelChange)="onSelectScrapQuantites($event)"></p-multiSelect>
    </div>
    <p-chart type="bar" [data]="barData2" [options]="options" [height]="height" #chart2></p-chart>
    `
})
export class QuantityStateLineGraphComponent implements OnInit {

    barData: any;
    barData2: any;
    pipe = new DatePipe('en-US');

    options: any;
    height = '60vh';
    showQuantities: boolean = true;
    quantityData: any;

    goodQuantitiesList = [];
    selectedGoodQuantities = [];
    scrapQuantitiesList = [];
    selectedScrapQuantities = [];

    @ViewChild('chart1') chart1: UIChart;
    @ViewChild('chart2') chart2: UIChart;
    fullData: any;

    @Input('quantityData') set f(quantityData) {
        if (quantityData) {
            this.fullData = quantityData;
            this.quantityData = quantityData.workstationAnalysisList;
            this.initChart(quantityData.workstationAnalysisList);
            const ht = (quantityData.workstationAnalysisList.length * 2) + 50;
            this.height = ht + 'vh';
        }
    }

    @Input('height') set h(height: string) {
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
        let goodQuantity = [];
        let cumulativeQuantity = [];
        let scrapQuantity = [];
        let scrapCumulativeQuantity = [];
        // const dataSets = [];
        // const dataSets2 = [];
        // console.log('Line Chart==============>', items)
        items.forEach((item, index) => {
            if (!item.quantityDetailList) return;
            item.quantityDetailList.forEach(quantity => {
                // this.pipe.transform(quantity.rangeStartDate, 'M/d/yy,H:mm', 'GMT') + ' - ' +
                if (index === 0) {
                    labels.push(this.pipe.transform(new Date(quantity.rangeFinishDate), 'dd.MM.yyy,H:mm'));
                }
                // if (quantity.goodQuantity !== 0) {
                goodQuantity.push(quantity.goodQuantity);
                if (cumulativeQuantity.length > 0) {
                    cumulativeQuantity.push((cumulativeQuantity[cumulativeQuantity.length - 1] + quantity.goodQuantity))
                } else {
                    cumulativeQuantity.push(quantity.goodQuantity);
                }
                // }
                // if (quantity.scrapQuantity !== 0) {
                scrapQuantity.push(quantity.scrapQuantity);
                if (scrapCumulativeQuantity.length > 0) {
                    scrapCumulativeQuantity.push((scrapCumulativeQuantity[scrapCumulativeQuantity.length - 1] + quantity.scrapQuantity))
                } else {
                    scrapCumulativeQuantity.push(quantity.scrapQuantity);
                }
                // }
            });
            // I Just guess the rest service will return oee value between 0-1;
            const goodQuantitylabel = 'Good Quantity By ' + item.workstationName;
            const goodCumulativelabel = item.workstationName + '-Cumulative Line';
            const scrapQuantitylabel = 'Scrap Quantity By ' + item.workstationName ;
            const scrapCumulativelabel = item.workstationName + '-Cumulative Line';
            const goodColor = this.getRandomColor();
            const goodCumulativeColor = this.getRandomColor();
            const scrapColor = this.getRandomColor();
            const scrapCumulativeColor = this.getRandomColor();
            this.goodQuantitiesList.push(
                {
                    label: goodQuantitylabel,
                    yAxisID: 'y-axis-1',
                    borderColor: goodColor,
                    order: 2,
                    data: JSON.parse(JSON.stringify(goodQuantity)),
                    fill: false,
                    backgroundColor: goodColor,
                }, {
                    label: goodCumulativelabel,
                    yAxisID: 'y-axis-2',
                    borderColor: goodCumulativeColor,
                    data: JSON.parse(JSON.stringify(cumulativeQuantity)),
                    fill: false,
                    type: 'line',
                    order: 1,
                    backgroundColor: goodCumulativeColor,
                }
            )

            this.selectedGoodQuantities = [...this.goodQuantitiesList];
            // dataSets.push();
            this.scrapQuantitiesList.push({
                label: scrapQuantitylabel,
                yAxisID: 'y-axis-1',
                borderColor: scrapColor,
                data: JSON.parse(JSON.stringify(scrapQuantity)),
                fill: false,
                order: 2,
                backgroundColor: scrapColor,
            }, {
                label: scrapCumulativelabel,
                yAxisID: 'y-axis-2',
                borderColor: scrapCumulativeColor,
                data: JSON.parse(JSON.stringify(scrapCumulativeQuantity)),
                fill: false,
                type: 'line',
                order: 1,
                backgroundColor: scrapCumulativeColor,
            });

            this.selectedScrapQuantities = [...this.scrapQuantitiesList]
            goodQuantity = [];
            scrapQuantity = [];
            cumulativeQuantity = [];
            scrapCumulativeQuantity = [];


        });
        this.barData = {
            labels: labels,
            datasets: this.selectedGoodQuantities
        };
        this.barData2 = {
            labels: labels,
            datasets: this.selectedScrapQuantities

        };
    }

    ngOnInit() {
        this.setChartOptions();
    }

    setChartOptions() {
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
                yAxes: [
                    {
                        position: 'left',
                        id: 'y-axis-1',
                        ticks: {
                            beginAtZero: true,
                        },
                        display: 'auto',
                        scaleLabel: {
                            display: true,
                            labelString: 'Minutes',
                        }
                    },
                    {
                        position: 'right',
                        id: 'y-axis-2',
                        ticks: {
                            beginAtZero: true,
                        },
                        display: 'auto',
                        scaleLabel: {
                            display: true,
                            labelString: 'Quantities',
                        }
                    }
                ]
            },
            animation: {
                duration: 1000,
                onComplete: function () {
                    const chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#000000';
                    ctx.font = 'lighter 0.75rem "Arial"';
                    // ctx.fontSize = '1em';
                    ctx.textBaseline = 'middle';
                    this.data.datasets.forEach(function (dataset, i) {
                        const meta = chartInstance.controller.getDatasetMeta(i);
                        if (meta.hidden) {
                            return;
                        }
                        meta.data.forEach(function (bar, index) {
                            let percent = '';
                            if (dataset.type === 'line' && dataset.data[index] > 0) {
                                if (index !== 0 && dataset.data[index] !== dataset.data[index - 1]) {
                                    percent = dataset.data[index];
                                } else if (index === 0) {
                                    percent = dataset.data[index];
                                }

                            }
                            const offset = -3;

                            ctx.fillText(percent, bar._model.x, bar._model.y + offset);

                        });
                    });
                }
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    fontColor: '#000000',
                }
            },
            tooltips: {
                callbacks: {
                  label: function (tooltipItem, data) {
                    let label = data.datasets[tooltipItem.datasetIndex].label || '';
        
                    if (label) {
                      label += ': ';
                    }
                    // label += Math.round(tooltipItem.yLabel * 100) / 100;
                    // console.log('@tooltipItem', tooltipItem)
                    // console.log('@label', label)
                    if (data.datasets[tooltipItem.datasetIndex].yAxisID === 'y-axis-1') {
                      return label + ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
                    } else {
                      return label + tooltipItem.yLabel;
                    }
                  }
                }
              }
        };
    }


    onSelectGoodQuantites(event) {
        this.chart1.data.datasets = [...this.selectedGoodQuantities];
        this.chart1.chart.update();
    }
    onSelectScrapQuantites(event) {
        this.chart2.data.datasets = [...this.selectedScrapQuantities];
        this.chart2.chart.update();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    onShowQuantities(event) {

        if (event && event.checked) {
            
            this.chart1.options.animation = {
                duration: 1000,
                onComplete: function () {
                    const chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = '#000000';
                    ctx.font = 'lighter 0.75rem "Arial"';
                    // ctx.fontSize = '1em';
                    ctx.textBaseline = 'middle';
                    this.data.datasets.forEach(function (dataset, i) {
                        const meta = chartInstance.controller.getDatasetMeta(i);
                        if (meta.hidden) {
                            return;
                        }
                        meta.data.forEach(function (bar, index) {
                            let percent = '';
                            if (dataset.type === 'line' && dataset.data[index] > 0) {
                                if (index !== 0 && dataset.data[index] !== dataset.data[index - 1]) {
                                    percent = dataset.data[index];
                                } else if (index === 0) {
                                    percent = dataset.data[index];
                                }

                            }
                            const offset = -3;

                            ctx.fillText(percent, bar._model.x, bar._model.y + offset);

                        });
                    });
                }
            }
        } else {
            this.chart1.options.animation = null;
        }
        this.chart1.reinit();
    }

}
