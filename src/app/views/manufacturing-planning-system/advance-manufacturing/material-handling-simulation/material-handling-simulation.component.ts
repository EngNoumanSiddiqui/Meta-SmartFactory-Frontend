import { Component, OnInit } from "@angular/core";
import { LoaderService } from "app/services/shared/loader.service";
import { StockOrderSimulationService } from "../../../../services/dto-services/stock-order-simulation/stock-order-simulation.service";
import { SimulationRequestDto } from "./similation-response.model";
import { UsersService } from "../../../../services/users/users.service";
import { ProductionOrderService } from "app/services/dto-services/production-order/production-order.service";

@Component({
  selector: "app-sale-review-job-order",
  templateUrl: "./material-handling-simulation.component.html",
  styleUrls: ["./material-handling-simulation.component.scss"],
})
export class MaterialHandlingSimulationComponent implements OnInit {
  plant: any;
  selectedWorkstationId: any;
  pagination: any;
  filters: SimulationRequestDto;
  dates: any = { startDate: "", finishDate: "" };
  productionData: number;
  isVisiblePallet = false;
  stockOrders: any = [];
  warehouses = [];
  totalOrderQuantity = null;
  weekdays = ["Sun", "Mon", "Tue", "Wed", "Thus", "Fri", "Sat"];

  readonly columns_workstation = [
    {
      field: "workStation",
      displayName: "Work Station",
      filter: "",
    },
    {
      field: "customerCode",
      displayName: "Customer Code",
      filter: "",
    },
    {
      field: "stockNo",
      displayName: "Material No",
      filter: "",
    },
    {
      field: "stockName",
      displayName: "Material Name",
      width: "350px",
      filter: "",
    },
    {
      field: "unit",
      displayName: "Unit",
      filter: "",
    },
  ];
  readonly columns_pallet = [
    {
      field: "totalCapacity",
      displayName: "Total Capacity",
      filter: "",
    },
    {
      field: "totalQuantity",
      displayName: "Total Quantity",
      filter: "",
    },
    {
      field: "palletCode",
      displayName: "Pallet Code",
      filter: "",
    },
    {
      field: "totalPalletCapacity",
      displayName: "Total Pallet Capacity",
      filter: "",
    },
    {
      field: "totalPalletQuantity",
      displayName: "Total Pallet Quantity",
      filter: "",
    },
  ];
  readonly columns_job_orders = [
    {
      field: "totalQuantity",
      displayName: "No. of Job Orders",
      filter: "",
    },
    {
      field: "targetQuantity",
      displayName: "Target Produce",
      filter: "",
    },
    {
      field: "total",
      displayName: "Total Order quantity",
      filter: "",
    },
  ];
  columns_warehouse = [];
  columns_with_dates = [];

  caluculatedRows = [];

  constructor(
    private _loaderSvc: LoaderService,
    private _stockOrderSimulationSvc: StockOrderSimulationService,
    private usersService: UsersService,
    private prodOrderService: ProductionOrderService
  ) {
  }

  ngOnInit() {
    this._stockOrderSimulationSvc.watchStorage().subscribe((data: any) => {
      if (data) {
        this.plant = JSON.parse(data);
      } else if (this.usersService.getPlant() !== null) {
        this.plant = JSON.parse(this.usersService.getPlant());
      }
      this.defaultFilters();
    });
  }

  async getMaterialHandlingSimulation() {
    this._loaderSvc.showLoader();
    this.filters.startDate = this.dates.startDate;
    this.filters.finishDate = this.dates.finishDate;
    let result =
      await this._stockOrderSimulationSvc.getMaterialHandlingSimulationDtoPromise(
        this.filters
      ); // this will return list of handling Simulations
    if (result) {
      this._loaderSvc.hideLoader();
      this.pagination.currentPage = result["currentPage"];
      this.pagination.totalElements = result["totalElements"];
      this.pagination.totalPages = result["totalPages"];
      this.stockOrders = this.manipulateArrays(result["content"]);
      this.totalOrderQuantity = result["totalOrderQuantity"];
    }
  }

  manipulateArrays(content: any[]) {
    let list = [];
    content.forEach((element: any) => {
      element.warehouseInfo = {};
      element.stockShiftReports = {};
      element.allocatedCapacity = {};
      element.availableCapacity = {};
      element.productionPlan = {};

      element.trendStockWarehouseShiftReportList.forEach((item) => {
        element.stockShiftReports[item.groupDate] = item.sumTotalAmount;
        element.productionPlan[item.groupDate] = "";
      }); // initialize stock report table object in stockOrders

      element.trendWorkstationActualCapacityList.forEach((item) => {
        element.allocatedCapacity[item.groupDate] = item.allocatedCapacity;
        element.availableCapacity[item.groupDate] = item.availableCapacity;
      }); // initialize stock report table object in stockOrders

      element.wareHouseStockList.forEach((item) => {
        element.warehouseInfo[item.wareHouseNo] = item.quantity;
      }); // initialize warehouse table object in stockOrders

      element.warehouseInfo.total = 0;
      Object.keys(element.warehouseInfo).forEach((item) => {
        element.warehouseInfo.total =
          element.warehouseInfo.total + element.warehouseInfo[item];
      });

      list.push(...element.wareHouseStockList);
    }); // set warehouse values and reports for each stock

    list = list.map((x) => {
      return [
        JSON.stringify({
          wareHouseId: x.wareHouseId,
          wareHouseName: x.wareHouseName,
          wareHouseNo: x.wareHouseNo,
          wareHouseStockId: x.wareHouseStockId,
        }),
        {
          wareHouseId: x.wareHouseId,
          wareHouseName: x.wareHouseName,
          wareHouseNo: x.wareHouseNo,
          wareHouseStockId: x.wareHouseStockId,
        },
      ]; // creates array of array for warehouse columns
    });

    let list_ = new Map(list); // create key value pair from array of array

    this.columns_warehouse = [...list_.values()]; //finalize columns

    this.columns_with_dates = this.getDates(
      this.dates.startDate,
      this.dates.finishDate
    );

    console.log(content);

    return content;
  }

  defaultFilters(): void {
    this.pagination = {
      totalElements: 0,
      currentPage: 1,
      pageNumber: 1,
      pageSize: 1000,
      totalPages: 1,
      TotalPageLinkButtons: 5,
      RowsPerPageOptions: [10, 20, 30, 50, 100, 1000],
      rows: 1000,
      tag: "",
    };
    this.filters = {
      customerName: null,
      customerNo: null,
      finishDate: null,
      orderByDirection: null,
      orderByProperty: null,
      pageNumber: 1,
      pageSize: 1000,
      query: null,
      startDate: null,
      plantId: this.plant?.plantId ? this.plant?.plantId : null,
      stockName: null,
      stockNo: null,
      stockTypeId: null,
      workstationName: null,
      workstationNo: null,
    };

    this.dates.startDate = new Date();
    let today_ = new Date();
    this.dates.finishDate = new Date(today_.setDate(today_.getDate() + 6));
    this.getMaterialHandlingSimulation();
  }

  filter(field?: any, value?: any) {
    if (field) {
      this.filters[field] = value;
    }
  }

  calculateProduction(value: any, rowIndex: any, date: any) {
    !this.caluculatedRows.includes(rowIndex) &&
      this.caluculatedRows.push(rowIndex);
    for (
      let i = this.columns_with_dates.findIndex((item) => item.date === date);
      i < this.columns_with_dates.length;
      i++
    ) {
      this.stockOrders[rowIndex].stockShiftReports[
        this.columns_with_dates[i].date
      ] += parseInt(value) ? parseInt(value) : 0;
    }
  }

  datefilter(even: any) {
    if (
      this.dates.startDate &&
      this.dates.finishDate &&
      new Date(this.dates.finishDate) > new Date(this.dates.startDate)
    ) {
      this.dates.startDate = new Date(this.dates.startDate);
      this.dates.finishDate = new Date(this.dates.finishDate);
      this.filters.pageNumber = 1;
    }
  }

  getDateFormat(date_: any) {
    const date = new Date(date_);
    const yyyy = date.getFullYear();
    const day = date.getDay();
    let mm: any = date.getMonth() + 1; // Months start at 0!
    let dd: any = date.getDate();
    return { date: dd + "-" + mm + "-" + yyyy, day: this.weekdays[day] };
  }

  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = new Date(startDate);
    do {
      dateArray.push(this.getDateFormat(currentDate));
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    } while (currentDate <= new Date(stopDate));
    return dateArray;
  }

  myChanges(event) {
    this.pagination.currentPage = event.currentPage;
    this.pagination.pageNumber = event.pageNumber;
    this.pagination.totalElements = event.totalElements;
    this.pagination.pageSize = event.pageSize;
    this.pagination.TotalPageLinkButtons = event.totalPageLinkButtons;
    if (this.pagination.tag !== event.searchItem) {
      this.pagination.pageNumber = 1;
    }
    this.pagination.tag = event.searchItem;
    this.filters.pageNumber = this.pagination.pageNumber;
    this.filters.pageSize = this.pagination.pageSize;
    this.filters.query = this.pagination.tag;
    this.getMaterialHandlingSimulation();
  }

  async run() {
    try {
      if (this.caluculatedRows) {
        this._loaderSvc.showLoader();
        let fd = this.getDateFormat(this.dates.finishDate).date;
        let res = await Promise.all(
          this.caluculatedRows.map(async (index) => {
            let data = {
              minimumDelayQuantityBetweenOperation:
                this.stockOrders[index].stockShiftReports[fd],
              materialId: this.stockOrders[index].stock.stockId,
              quantity: this.stockOrders[index].stockShiftReports[fd],
              extraProducedQuantityPercentage: 0,
              startDate: this.dates.startDate,
              finishDate: this.dates.finishDate,
              plantId: this.plant.plantId,
              prodOrderMaterialList: [
                {
                  materialId: this.stockOrders[index].stock.stockId,
                  outputRate: 1,
                  neededQuantity: this.stockOrders[index].stockShiftReports[fd],
                  quantiyUnit: this.stockOrders[index].stock.baseUnit,
                },
              ],
            };

            return await this.prodOrderService.save(data);
          })
        );
        this._loaderSvc.hideLoader();
        console.log(res);
      }
    } catch (error) {
      this._loaderSvc.hideLoader();
      console.log(error);
    }
  }

}
