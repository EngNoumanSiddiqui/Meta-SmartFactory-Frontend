import { Component, Input, OnInit } from '@angular/core';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';

@Component({
  selector: 'app-list-view-data',
  templateUrl: './list-view-data.component.html'
})
export class ListViewDataComponent implements OnInit {
  tableData: any;
  filteredTableData: any;
  @Input('tableData') set setTable(tableData) {
    if(tableData) {
      const cloneData = JSON.parse(JSON.stringify(tableData));
      this.tableData = [];
      if(cloneData) {
        let uniquestockList = cloneData.map(item => item.stockId);
        uniquestockList = Array.from(new Set(uniquestockList));
        //compare both array to find matched values in both array
        for(let i = 0; i < uniquestockList.length; i++) {
          let stockId = uniquestockList[i];
          let stock = cloneData.find(item => item.stockId === stockId);
          stock.children = [];
          stock.children = cloneData.filter(item => item.stockId === stockId);
          stock.children.forEach(element => {
            if(!element.shiftStartDate) {
              let date = element.groupDate;
              if(date) {
                element.groupDate = new Date(date.split('-')[2], date.split('-')[1] - 1, date.split('-')[0]);
              }
            }
          });;
          this.tableData.push({...stock});
        }
      }
      this.selectedStock = null;
      this.filteredTableData = [...this.tableData]
    } else {
      this.selectedStock = null;
      this.tableData = [];
      this.filteredTableData = [];
    }

  };

  selectedStock = null;
  // showBy = 'totalAmount';
  totalAmountChecked = true;
  outgoingAmountChecked = false;
  incommingAmountChecked = false;
  totalProductionChecked = false;
  totalCostChecked = false;
  totalProfitChecked = false;
  // fixedCostChecked = false;
  // variableCostChecked = false;
  // laborCostChecked = false;
  reOrderPointChecked = true;

  totalAmountId = this.ID();
  outgoingAmountId = this.ID();
  incommingAmountId = this.ID();
  totalProductionId = this.ID();
  reOrderPointId = this.ID();
  totalCostId = this.ID();
  // fixedCostId = this.ID();
  // variableCostId = this.ID();
  // laborCostId = this.ID();
  totalProfitId = this.ID();

  stockTypes = [
    {name: 'All', value: 4},
    {name: 'Raw Material', value: 1},
    {name: 'Semi Finished', value: 2},
    {name: 'Finished Product', value: 3},
  ];
  selectedType = {name: 'All', value: 4};

  frozenCols = [
    { field: 'stockNo', header: 'stock-no' },
    { field: 'stockName', header: 'stock-name' },
    { field: 'reorderPoint', header: 'reorder-point' }
  ];

  scrollableCols = [
    // { field: 'children', header: 'children' },
  ];



  constructor(private loaderService: LoaderService) { }
  ngOnInit() {
  }
  ID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  };


  onStockChange(event) {
    this.selectedType = {name: 'All', value: 4};
    if(this.selectedStock) {
      this.filteredTableData = this.tableData.filter(item => item.stockId === this.selectedStock.stockId);
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }

  onStockTypeChange(event) {
    if(this.selectedType) {
      if(this.selectedType.value === 4) {
        this.filteredTableData = [...this.tableData];
      } else {
        this.filteredTableData = this.tableData.filter(item => item.stockTypeId === this.selectedType.value);
      }
      
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }
  showMaterialDetailDialog(materialId: any) {
    this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
  }

  // getData(stockId, index, stockIndex) {
  //   let data = null;
  //   if(this.tableData) {
  //     for(let i = 0; i < this.tableData.length; i++) {
  //       if(this.getUniqueStockList[stockIndex].stockId === stockId && index === i) {
  //         // data = this.tableData[i];
  //         const filteredStock = this.tableData.filter(item => item.stockId === stockId);
  //         switch (this.showBy) {
  //           case 'totalAmount':
  //             data = filteredStock[i]?.totalAmount;
  //             if(!data) {
  //               data = filteredStock[i]?.sumTotalAmount;
  //             }
  //             break;
  //           case 'incommingAmount':
  //             data = filteredStock[i]?.incomingAmount;
  //             if(!data) {
  //               data = filteredStock[i]?.sumIncomingAmount;
  //             }
  //             break;
  //           case 'outgoingAmount':
  //             data = filteredStock[i]?.outgoingAmount;
  //             if(!data) {
  //               data = filteredStock[i]?.sumOutgoingAmount;
  //             }
  //             break;
  //           case 'totalProduction':
  //             data = filteredStock[i]?.totalProduction;
  //             if(!data) {
  //               data = filteredStock[i]?.sumTotalProduction;
  //             }
  //             break;
  //           default:
  //             data = filteredStock[i]?.totalAmount;
  //             if(!data) {
  //               data = filteredStock[i]?.sumTotalAmount;
  //             }
  //             break;
  //         }   
  //         break;
  //       }
  //     }
  //   }
  //   return data;
  // }
  // getShiftDate(stockId, index, stockIndex) {
  //   let date = null;
  //   if(this.tableData) {
  //     for(let i = 0; i < this.tableData.length; i++) {
  //       if(this.getUniqueStockList[stockIndex].stockId === stockId && index === i) {
  //         const filteredStock = this.tableData.filter(item => item.stockId === stockId);
  //         date = filteredStock[i]?.shiftStartDate;
  //         if(!date) {
  //           date = filteredStock[i]?.groupDate;
  //           if(date) {
  //             date  = new Date(date.split('-')[2], date.split('-')[1] - 1, date.split('-')[0]);
  //           }
  //         }
  //         break;
  //       }
  //     }
  //   }
  //   return date;
  // }
  get getShiftDateLength() {
    let stockIds = [];
    if(this.tableData) {
      // count same stock in array
      const stockId = this.tableData[0].stockId;
      for(let i = 0; i < this.tableData.length; i++) {
        if(this.tableData[i]?.stockId === stockId) {
          stockIds.push(this.tableData[i].stockId);
        }
      }
    }
    return stockIds;
  }


  get getcolspan() {
    let count = 0;

    if(this.totalAmountChecked) {
      count++;
    }
    if (this.outgoingAmountChecked) {
      count++;
    }

    if (this.totalProductionChecked) {
      count++;
    }
    if (this.incommingAmountChecked) {
      count++;
    }
    if (this.totalCostChecked) {
      count++;
    }
    // if (this.fixedCostChecked) {
    //   count++;
    // }
    // if (this.laborCostChecked) {
    //   count++;
    // }
    // if (this.variableCostChecked) {
    //   count++;
    // }
    if (this.totalProfitChecked) {
      count++;
    }

    return count + '';
  }

  get getwidth() {
    let count = 0;

    if(this.totalAmountChecked) {
      count++;
    }
    if (this.outgoingAmountChecked) {
      count++;
    }

    if (this.totalProductionChecked) {
      count++;
    }
    if (this.incommingAmountChecked) {
      count++;
    }
    if (this.totalCostChecked) {
      count++;
    }
    // if (this.fixedCostChecked) {
    //   count++;
    // }
    // if (this.laborCostChecked) {
    //   count++;
    // }
    // if (this.variableCostChecked) {
    //   count++;
    // }
    if (this.totalProfitChecked) {
      count++;
    }

    return (count * 78) + 'px';
  }

}
