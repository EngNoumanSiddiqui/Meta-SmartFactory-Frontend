import { Component, Input, OnInit } from '@angular/core';
import { ScheduleReportService } from 'app/services/dto-services/schedule-report/schedule-report.service';
import { SkillMatrixReportService } from 'app/services/dto-services/skill-matrix-report/skill-matrix-report.service';

@Component({
  selector: 'workstation-skill-matrix',
  templateUrl: './workstation-skill-matrix.html',
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

export class WorkstationSkillMatrixComponent implements OnInit {

  workstationSkills = [];

  options: any;

  barData: any;

  workLoadChartOptions: any;

  workloadChartData: any;

  scheduleMaterialsList: any;

  scheduleWorkstationsList: any;

  workstationCategories: any;

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
  }

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
  }

  skillType: string = null;

  modal = {
    active: false,
    type: null
  };

  @Input('filterData') set fData(data: any) {


// let perData = [];
// let saturationData = {
//     saturation: [],
//     unsaturation: []
// }
// workstationCategories.forEach((wCategory, index) => {
//     let wData = {
//         category: wCategory,
//         data: [],
//         saturation: []
//     }
//     data.forEach(emp => {
//         wData.workStation = emp;
//         let selectedData = data.filter(element => element.workStationId == emp.workStationId);
//         let total = 0;
//         let totalSaturation = 0;
//         selectedData.forEach(item => {
//            total = total + item.interest;
//            totalSaturation = totalSaturation + item.saturation;

//         })
//         let empData = {
//                 id: emp.workStationId,
//                 wSLoadChartTime: emp.interest,
//                 wsLoadChartPercentage: parseFloat((emp.interest *100/total).toFixed(1)),
//         }

//         wData.data.push(empData);
//     });
//     perData.push(wData);
// });
    this.workstationCategories = [];
    this.workstationSkills = [];

    if (data && data.length > 0) {

      let workstationSkills = [];
      let data1 = [];

      if (this.skillType === 'WORKSTATION') {

        data = data.sort((a, b) => { return a.workStationId - b.workStationId });
        workstationSkills = [...new Map(data.map(item => [item['workStationId'], item])).values()];
        this.workstationCategories = [...new Map(data.map(item => [item['skillMatrixCategoryDescription'], item])).values()];
        workstationSkills.forEach((item: any, index) => {
          const categories = [];
          let found = false;
          data.forEach(element => {
            if (item.workStationId == element.workStationId) {
              found = true;
              categories.push({
                skillMatrixCategoryDescription: element.skillMatrixCategoryDescription,
                skillMatrixCategoryId: element.skillMatrixCategoryId,
                subOperationSkillValue: element.subOperationSkillValue,
                operationSkillValue: (this.getPercentage(element.saturation * 100)),
                interest: element.interest,
              });
            }
          });
          const allWsCategories = [];
          this.workstationCategories.forEach(element => {
            let cat = categories.find(ct => ct.skillMatrixCategoryDescription == element.skillMatrixCategoryDescription);
            if (cat) {
              allWsCategories.push(cat);
            } else {
              allWsCategories.push({
                skillMatrixCategoryDescription: element.skillMatrixCategoryDescription,
                skillMatrixCategoryId: element.skillMatrixCategoryId,
                subOperationSkillValue: 0,
                operationSkillValue: 0,
                interest: 0,
              })
            }
          });
          allWsCategories.sort((a, b) => a.skillMatrixCategoryDescription - b.skillMatrixCategoryDescription);
          data1.push({
            workStationId: item.workStationId,
            workStationName: item.workStationName,
            categories: allWsCategories,
            saturation: this.getSaturation(item, data)
          })
        });

        this.workstationSkills = data1;

        this.setOptions();
        this.setWorkLoadChartOptions();
        this.initializeChart(data)
      } else {
        data = data.sort((a, b) => { return a.employeeId - b.employeeId })
        workstationSkills = [...new Map(data.map(item => [item['employeeId'], item])).values()];
        this.workstationCategories = [...new Map(data.map(item => [item['skillMatrixCategoryDescription'], item])).values()];

        workstationSkills.forEach((item: any, index) => {
          const categories = [];
          data.forEach(element => {
            let fullName = item.firstName + ' ' + item.lastName;
            let fullName1 = element.firstName + ' ' + element.lastName;
            if (element.employeeId === item.employeeId && fullName == fullName1) {
              categories.push({
                skillMatrixCategoryDescription: element.skillMatrixCategoryDescription,
                skillMatrixCategoryId: element.skillMatrixCategoryId,
                subOperationSkillValue: element.subOperationSkillValue,
                operationSkillValue: (this.getPercentage(element.saturation * 100)),
                interest: element.interest,
              });
            }
          });
          const allWsCategories = [];
          this.workstationCategories.forEach(element => {
            let cat = categories.find(ct => ct.skillMatrixCategoryDescription == element.skillMatrixCategoryDescription);
            if (cat) {
              allWsCategories.push(cat);
            } else {
              allWsCategories.push({
                skillMatrixCategoryDescription: element.skillMatrixCategoryDescription,
                skillMatrixCategoryId: element.skillMatrixCategoryId,
                subOperationSkillValue: 0,
                operationSkillValue: 0,
                interest: 0,
              })
            }
          });
          allWsCategories.sort((a, b) => a.skillMatrixCategoryDescription - b.skillMatrixCategoryDescription);
          data1.push({
            workStationId: item.employeeId,
            workStationName: item.firstName + ' ' + item.lastName,
            categories: allWsCategories,
            saturation: this.getSaturation(item, data)
          })
        });
        this.workstationSkills = data1;
        this.setOptions();
        this.setWorkLoadChartOptions();
        this.initializeChart(data)
      }
    }
  }

  @Input('matrixFilter') set Mfilter(filter) {
    this.skillType = filter.skillType;
    this.scheduleMaterialFilter.plantId = filter.plantId;
    this.scheduleMaterialFilter.startTime = filter.startDate;
    this.scheduleMaterialFilter.endTime = filter.finishDate;
    this.getSchaduleMaterials();
  }

  constructor(
    private _skillMatrixReportSvc: SkillMatrixReportService,
    private _scheduleReportSvc: ScheduleReportService
  ) { }

  ngOnInit() {
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

  setWorkLoadChartOptions() {
    this.workLoadChartOptions = {
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
              labelString: 'Minutes',
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
    };
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
              // suggestedMin: 0,
              // suggestedMax: 100
            },
            display: 'auto',
            scaleLabel: {
              display: true,
              labelString: 'Percent',
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
    };
  }



  initializeChart(item: any) {

    if (!item || !this.workstationSkills || this.workstationSkills.length == 0) {
      return;
    }

    // working effeciency;
    const newLabels = [];
    const wLabels = [];
    let datasets = [];
    const wDatasets = [];

    //SET WORKSTATIONS OR EMPLOYEE NAMES
    this.workstationSkills.forEach((element, index) => {
      wLabels.push(element.workStationName);
      newLabels.push(element.workStationName);
    });


    //get unique categories
    let categories = [...new Map(item.map(itm => [itm['skillMatrixCategoryDescription'], itm])).values()];

    categories.push({ 'skillMatrixCategoryDescription': 'Total' });

    categories.forEach((element: any, index) => {
      const data = [];
      const wLoadData = [];
      let i = index;

      this.workstationSkills.forEach(wskill => {
        let wsCategory = wskill.categories.find(cat => element.skillMatrixCategoryDescription == cat.skillMatrixCategoryDescription);
        if(!wsCategory && element.skillMatrixCategoryDescription != 'Total'){
          data.push(0);
          wLoadData.push(0);
        }
        if (wsCategory) {
          data.push(this.calculateCategoryPercentage(wskill, wsCategory));
          wLoadData.push(wsCategory.interest);
        } else if (element.skillMatrixCategoryDescription == 'Total') {
          data.push(100 - (wskill.saturation/3));
          wLoadData.push(this.calculateTotalValue(wskill));
          i = 9999;
        }
      });
      let skillMatrixCategoryDescription = element.skillMatrixCategoryDescription;
      if (element.skillMatrixCategoryDescription == 'Total') {
        skillMatrixCategoryDescription = 'UNSATURATION';
      }
      datasets.push(this.setStackDataset(skillMatrixCategoryDescription, this.getBackgroundColor(i), data));
      wDatasets.push(this.getDataSetItem(this.getBackgroundColor(i), 'Sum of ' + element.skillMatrixCategoryDescription, wLoadData));
    });
    // console.log('@Categoriesss===>', categories);
    // categories.forEach((cat: any, index) => {

    //   const data = [];
    //   let i = index;
    //   let satIndex = 0;
    //   let skillMatrixCategoryDescription = null;
    //   item.forEach((itm) => {
    //     skillMatrixCategoryDescription = itm.skillMatrixCategoryDescription
    //     if (itm.skillMatrixCategoryDescription == cat.skillMatrixCategoryDescription) {
    //       data.push(itm.operationSkillValue);
    //     }else if (cat.skillMatrixCategoryDescription == 'Unsaturation') {
    //         // data.push(itm);
    //         data.push(100 - this.getSaturation(itm, item));
    //         i = 9999;
    //         satIndex = satIndex + 1;
    //     }
    //   });

    //   wDatasets.push(this.getDataSetItem(this.getBackgroundColor(i), skillMatrixCategoryDescription, data));
    //   datasets.push(this.setStackDataset(skillMatrixCategoryDescription, this.getBackgroundColor(i), data));
    // });



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

  getSaturation = (employee, data) => {
    let total = 0;
    if (this.skillType == 'WORKSTATION') {
      data.forEach(wrk => {
        if (wrk.workStationId === employee.workStationId && wrk.workStationName === employee.workStationName) {
          total = total + (wrk.saturation * 100);
        }
      });
    } else if (this.skillType == 'EMPLOYEE') {
      data.forEach(wrk => {
        if (wrk.employeeId === employee.employeeId && wrk.firstName === employee.firstName) {
          total = total + (wrk.saturation * 100);
        }
      });
    }
    return this.getPercentage(total);
  }

  calculateCategoryPercentage(workstation, wCategory){

    const total = this.getPercentage((workstation.saturation/3) * (wCategory.interest * 100 /  ((this.calculateTotalValue(workstation))))/100 );
    // if(workstation.workStationId == 70) console.log('@calculatecategoryTotal', total)
    if(total) return total;

    return 0;
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

  calculateTotalValue(workstation) {
    var total = 0;
    if (workstation && workstation.categories) {
      workstation.categories.forEach(element => {
        total += element.interest;
      });
    }

    return parseFloat(total.toFixed(2));
  }

  getPercentage(val) {
    if (val) {
      return val.toFixed(2);
    }
    return 0;
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
