import { Component, Input, OnInit } from '@angular/core';
import { ItemService } from 'app/services/dto-services/quality-notification/item/item.service';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';
import { SkillMatrixReportService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-report.service';
import { SkillMatrixSamplingValueService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-sampling-value.service';
import { LoaderService } from 'app/services/shared/loader.service';
@Component({
  selector: 'employee-skill-matrix',
  templateUrl: './employee-skill-matrix.html',
  styles: [
    `
    .clear-fix{margin-bottom: 20px}
    :host ::ng-deep .table thead th {
      background: #f4f4f4;
    }
    :host ::ng-deep .ui-paginator{
      margin-right: 0px
    }
      `
  ]
})

export class EmployeeSkillMatrixComponent implements OnInit {

  workstationSkills = [];

  options: any;

  workLoadOptions: any;

  barData: any;

  workloadChartData: any;

  scheduleMaterialsList: any;

  scheduleWorkstationsList: any;

  employeeList = [];

  scheduleMaterialFilter = {
    endTime: null,
    materialId: null,
    orderByDirection: 'desc',
    orderByProperty: 'materialId',
    pageNumber: 1,
    pageSize: 1000000,
    query: null,
    startTime: null,
    plantId: null
  };

  scheduleWorkstationFilter = {
    endTime: null,
    workstationId: null,
    orderByDirection: 'desc',
    orderByProperty: 'workstationId',
    pageNumber: 1,
    pageSize: 1000000,
    query: null,
    startTime: null,
    plantId: null
  };

  skillMatrixPageFilter = {
    pageNumber: 1,
    pageSize: 100000,
    groupType: null,
    skillMatrixSamplingValueId: null,
    query: null,
    orderByProperty: 'skillMatrixSamplingValueId',
    orderByDirection: 'desc'
  };


  employeeLevelsData = [];

  filterData = [];

  skillMatrixSamplingValues = [];

  skillType: string = null;

  group: string;

  skillLevels = [];

  saturationData = {
    saturation: [],
    unsaturation: [],
    totalValue: []
  }

  modal = {
    active: false,
    type: null
  }

  @Input('matrixFilter') set sType(filter) {
    if(filter){
      this.scheduleWorkstationFilter.plantId = filter.plantId;
      this.skillType = filter.skillType;
      this.group = filter.group;
      this.skillMatrixPageFilter.groupType = filter.group;
      this.scheduleMaterialFilter.plantId = filter.plantId;
      this.scheduleMaterialFilter.startTime = filter.startDate;
      this.scheduleMaterialFilter.endTime = filter.finishDate;
      this.getSchaduleMaterials();
    }
  }

  @Input('filterData') set fD(data) {
    this.filterData = data;
    this.employeeLevelsData = [];
  }

  constructor(
    private _scheduleReportSvc: ScheduleReportService,
    private _skillMatrixSamplingValueSvc: SkillMatrixSamplingValueService,
    private _loaderSvc: LoaderService
  ) {

  }

  ngOnInit() {
    this._skillMatrixSamplingValueSvc.filter(this.skillMatrixPageFilter).then(res => {
      this._loaderSvc.hideLoader();
      if (res['content']) {
        res['content'].sort((a, b) => { return a.value - b.value});

        if (this.skillType == 'EMPLOYEE') {
          this.filterData.sort((a, b) => {
            return a.employeeId - b.employeeId;
          });
        }else{
          this.filterData.sort((a, b) => {
            return a.workStationId - b.workStationId;
          });
        }

        this.skillMatrixSamplingValues = res['content'];
        if (this.filterData && this.filterData.length > 0) {
          this.setSkillMatrix(this.filterData);
        } else {
          this.workstationSkills = [];
        }
      }
    })
  }

  getSchaduleMaterials() {
    this._scheduleReportSvc.getScheduledMaterialReport(this.scheduleMaterialFilter).then(res => {
      this.scheduleMaterialsList = res['content'];
    })
  }

  getScheduleWorkstations() {
    this._scheduleReportSvc.getScheduledWorkstationReport(this.scheduleWorkstationFilter).then(res => {
      this.scheduleWorkstationsList = res['content'];
    })
  }

  setSkillMatrix(data) {
    this.setOptions();
    this.setWorkLoadOptions();
    this.workstationSkills = data;
    let compareWith = null;

    if (this.skillType == 'EMPLOYEE') {
      this.employeeList = [...new Map(data.map(item => [item['employeeId'], item])).values()];
      compareWith = 'employeeId';
    } else if (this.skillType == 'WORKSTATION') {
      this.employeeList = [...new Map(data.map(item => [item['workStationId'], item])).values()];
      compareWith = 'workStationId';
    }
    //Calculate Saturation and unsaturation
    this.employeeList.forEach(element => {
      this.saturationData.saturation.push({id: element[compareWith], value: this.calculateSaturation(element, compareWith)});
      this.saturationData.unsaturation.push({id: element[compareWith], value: (100-this.calculateSaturation(element, compareWith))});
      let allSkillLevels = data.filter(d => (d[compareWith] == element[compareWith]));
      this.saturationData.totalValue.push(allSkillLevels.length);
    });

    this.skillMatrixSamplingValues.forEach((sv, index) => {
      let s = [];
      let workLoad = [];

      this.employeeList.forEach((emp) => {
        let selectedSkillLevelList = data.filter(d => (d[compareWith] == emp[compareWith]) && d.operationSkillValue >= sv.min && d.operationSkillValue <= sv.max);
        let employeeOperations = [...new Map(selectedSkillLevelList.map(item => [item['jobOrderOperationId'], item])).values()];
        let allSkillLevels = data.filter(d => (d[compareWith] == emp[compareWith]));

        // if (employeeOperations) {
        //   workLoad.push(employeeOperations.length);
        //   s.push(this.getPercentage((selectedSkillLevelList.length/allSkillLevels.length) * 100));
        // }
        workLoad.push(selectedSkillLevelList.length);
        s.push(this.getPercentage((selectedSkillLevelList.length/allSkillLevels.length) * 100));
      })
      this.skillLevels.push({
        level: sv,
        data: s,
        workLoad: workLoad
      });
    });

    // this.skillLevels.forEach(element => {
    //     element.workLoad.forEach((d, index) => {

    //       if(this.saturationData.totalValue[index] == undefined){
    //         this.saturationData.totalValue[index] = 0;
    //       }
    //       this.saturationData.totalValue[index] = this.saturationData.totalValue[index] + parseInt(d);
    //     });
    // });

    this.initializeChart(data);
  }

  setOptions() {
    this.options = {
      title: {
        display: false,
        text: 'MODEL AREA'
      },
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
            // maxRotation: 90,
            // minRotation: 30
          },

        }],
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              suggestedMin: 0,
              suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Efficiency',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#000000',
        }
      },
      // tooltips: {
      //   callbacks: {
      //       label: function(tooltipItem, data) {
      //           var label = data.datasets[tooltipItem.datasetIndex].label || '';

      //           if (label) {
      //               label += ': ';
      //           }
      //           // label += Math.round(tooltipItem.yLabel * 100) / 100;
      //           console.log('@tooltipItem', tooltipItem)
      //           console.log('@label', label)
      //           if(tooltipItem.datasetIndex < 2){
      //             return label + ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
      //           }else{
      //             return label + tooltipItem.yLabel;
      //           }
      //       }
      //   }
      //}
    };
  }


  setWorkLoadOptions(){
    this.workLoadOptions = {
      title: {
        display: false,
        text: 'MODEL AREA'
      },
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
              // suggestedMin: 0,
              // suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Operation Quantity',
            }
          },
          {
            position: 'right',
            id: 'y-axis-2',
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Efficiency',
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          fontColor: '#000000',
        }
      },
      // tooltips: {
      //   callbacks: {
      //       label: function(tooltipItem, data) {
      //           var label = data.datasets[tooltipItem.datasetIndex].label || '';

      //           if (label) {
      //               label += ': ';
      //           }
      //           // label += Math.round(tooltipItem.yLabel * 100) / 100;
      //           console.log('@tooltipItem', tooltipItem)
      //           console.log('@label', label)
      //           if(tooltipItem.datasetIndex < 2){
      //             return label + ConvertUtil.minuteDuration2StrTime(tooltipItem.yLabel);
      //           }else{
      //             return label + tooltipItem.yLabel;
      //           }
      //       }
      //   }
      //}
    };
  }
  getCategEmployeeValue = (category, employee) => {
    const value = this.workstationSkills.find(wrk => wrk.employeeId === employee.employeeId
      && wrk.firstName === employee.firstName
      && category.skillMatrixCategoryId === wrk.skillMatrixCategoryId);
    if (value) {
      return value.operationSkillValue;
    } else {
      return 0;
    }
  }

  getCategEmployeeInterest = (category, employee) => {
    const value = this.workstationSkills.find(wrk => wrk.employeeId === employee.employeeId
      && wrk.firstName === employee.firstName
      && category.skillMatrixCategoryId === wrk.skillMatrixCategoryId);
    if (value) {
      return value.interest;
    } else {
      return 0;
    }
  }

  getSaturation = (employee, index = 0) => {
    let total = 0;
    if (this.skillType == 'WORKSTATION') {
      this.workstationSkills.forEach(wrk => {
        if (wrk.workStationId === employee.workStationId && wrk.workStationName === employee.workStationName) {
          total = total + wrk.operationSkillValue;
        }
      });
    } else if (this.skillType == 'EMPLOYEE') {
      this.workstationSkills.forEach(wrk => {
        if (wrk.employeeId === employee.employeeId && wrk.firstName === employee.firstName) {
          total = total + wrk.operationSkillValue;
        }
      });
    }
    return total;
  }

  calculateSaturation(rowData, compareWith){
    let count:number = 0;
    this.skillMatrixSamplingValues.forEach(sv => {
      let d = this.filterData.filter(d => (d[compareWith] == rowData[compareWith]) && d.operationSkillValue >= sv.min && d.operationSkillValue <= sv.max);
      count = count + d.length;
    });

    return count;
  }


  initializeChart(item: any) {

    if (!item) {
      return;
    }

    // working effeciency;
    const newLabels = [];
    const wLabels = [];
    let datasets = [];
    const wDatasets = [];

    let filterById = 'employeeId';

    if (this.skillType == 'WORKSTATION') {
      filterById = 'workStationId';
      this.employeeList.forEach((element: any, index) => {
        if (!wLabels.includes(element.workStationName)) {
          wLabels.push(element.workStationName);
          newLabels.push(element.workStationName);
        }
      });
    } else {
      this.employeeList.forEach((element: any, index) => {
        if (!wLabels.includes(element.firstName + element.lastName)) {
          wLabels.push(element.firstName + element.lastName);
          newLabels.push(element.firstName + element.lastName);
        }
      });
    }
    this.skillLevels.forEach((element, index) => {
      datasets.push(this.setStackDataset('Level '+(index+1), element.level.color, element.data));
      wDatasets.push(this.getDataSetItem(element.level.color, 'Level '+(index+1), element.workLoad));
    });

    // const unsaturationData = this.saturationData.unsaturation.map(d => d.value);
    // const totalValueData = this.saturationData.totalValue.map(d => d.value);
    // datasets.push(this.setStackDataset('UNSATURATION', this.getBackgroundColor(9999), unsaturationData));
    wDatasets.push(this.getDataSetItem(this.getBackgroundColor(9999), 'Total Value', this.saturationData.totalValue));

    this.workloadChartData = {
      labels: newLabels,
      datasets: wDatasets
    };
    this.barData = {
      labels: wLabels,
      datasets: datasets
    };
  }

  private setStackDataset(label, color, data, stack = 'Stack 0') {
    return {
      label: label,
      backgroundColor: color,
      stack: stack,
      data: data
    }
  }

  private getDataSetItem(hexColor, label, data, axisId = 'y-axis-1') {

    return {
      yAxisID: axisId,
      label: label,
      fill: true, // for bar just comment here
      backgroundColor: hexColor,
      borderColor: hexColor,
      borderWidth: 1,
      data: data,
      type: (axisId == 'y-axis-2') ? 'line' : '',
    }
  }


  getBackgroundColor(index) {
    if (index == 0) {
      return '#abea68';
    } else if (index == 1) {
      return '#ffff00';
    } else if (index == 2) {
      return '#f57676';
    } else if (index == 9999) {
      return '#bb80f7';
    } else {
      return '#a9a5a5';
    }
  }


  calculateMaterialQuantity() {
    var total = 0;

    if (!this.scheduleMaterialsList) return total;

    this.scheduleMaterialsList.forEach(element => {
      total += parseInt(element.quantity, 10);
    });

    return total;
  }

  calculateUnsaturation(workstation) {
    var total = 0;

    if (workstation && workstation.categories) {
      workstation.categories.forEach(element => {
        total += parseInt(element.operationSkillValue, 10);
      });
    }

    return total;
  }

  calculateTotalValue(employee) {
    var total = 0;
    if (this.skillType == 'WORKSTATION') {
      this.filterData.forEach(wrk => {
        if ((wrk.workStationId == employee.workStationId)) {
          total = total + wrk.operationSkillValue;
        }
      })
    } else {
      this.filterData.forEach(wrk => {
        if ((wrk.employeeId == employee.employeeId)) {
          total = total + wrk.operationSkillValue;
          3
        }
      })
    }


    return total;
  }

  getPercentage(val) {
    if (val) {
      return val.toFixed(2);
    }
    return 0;
  }

  calculateSum(data) {
    let total = 0;
    if (data) {
      data.forEach(element => {
        total = total + element;
      });
    }

    return total;
  }

  calculatePercentage(data, i) {
    let total = 0;
    let percentage: any = 0;
    if (data) {
      this.skillLevels.forEach(skll => {
        total = total + skll.data[i];
      });
      percentage = (data / total * 100).toFixed(2);
    }

    return percentage;
  }

  calculateHorizentalSum(data, i) {
    let total = 0;
    if (data) {
      this.skillLevels.forEach(skll => {
        total = total + skll.data[i];
      })
      // data.forEach(element => {
      //   total = total + element;
      // });
    }

    return total;
  }

  onViewGraph(type:string){
    this.modal.type = type;
    this.modal.active = true;
  }

  onHide(){
    this.modal.type = null;
    this.modal.active = false;
  }
}
