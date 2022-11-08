import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { LoaderService } from "app/services/shared/loader.service";
import { UtilitiesService } from "app/services/utilities.service";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";
import { SimulationEntity } from "../models/similation-entity.model";
import { SimulationService } from "app/services/dto-services/simulation/simulation.service";
import { UsersService } from "app/services/users/users.service";
import { StockOrderSimulationService } from "app/services/dto-services/stock-order-simulation/stock-order-simulation.service";
import { ShiftSettingsRequestDto } from "app/dto/shift/shift.dto";

@Component({
  selector: "app-simulation-management",
  templateUrl: "./simulation-management.component.html",
  styleUrls: ["./simulation-management.component.scss"],
})
export class SimulationManagementComponent implements OnInit {
  @ViewChild("myModal") public myModal: ModalDirective;
  @ViewChild("myChildModal") public myChildModal: ModalDirective;
  @ViewChild("addSimulation") addSimulation: any;

  classReOrder = ["asc", "asc", "asc", "asc", "asc"];

  filters: SimulationEntity;
  tabs = {
    simulation: false,
    addShift: false,
    addCalendar: false,
    addCapacity: false,
  };

  showLoader = false;
  stopTypes: any = [];

  pagination: any;

  cols = [
    { field: "scheduleSimulationId", header: "simulation-id" },
    { field: "scheduleSimulationNo", header: "simulation-no" },
    { field: "scheduleSimulationName", header: "simulation-name" },
    { field: "note", header: "simulation-note" },
  ];

  selectedColumns = [
    { field: "scheduleSimulationId", header: "simulation-id" },
    { field: "scheduleSimulationNo", header: "simulation-no" },
    { field: "scheduleSimulationName", header: "simulation-name" },
    { field: "note", header: "simulation-note" },
  ];

  simulations: SimulationEntity[];
  selectedSimulation: SimulationEntity = {};
  plant: any;
  shiftRequestDto: ShiftSettingsRequestDto = {} as any;
  dataFromSimulation: any;
  dataFromSimulationCapacity: any;

  constructor(
    private _stockOrderSimulationSvc: StockOrderSimulationService,
    private _loaderSvc: LoaderService,
    private usersService: UsersService,
    private utilities: UtilitiesService,
    private _confirmationSvc: ConfirmationService,
    private _translateSvc: TranslateService,
    private _simulationService: SimulationService
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

  async getSimulation() {
    this._loaderSvc.showLoader();
    let result = await this._simulationService.filter(this.filters); // this will return list of handling Simulations
    if (result) {
      this._loaderSvc.hideLoader();
      this.pagination.currentPage = result["currentPage"];
      this.pagination.totalElements = result["totalElements"];
      this.pagination.totalPages = result["totalPages"];
      this.simulations = result["content"];
      this._loaderSvc.hideLoader();
    } else {
      this._loaderSvc.hideLoader();
    }
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
      pageNumber: 1,
      pageSize: 500,
      scheduleSimulationId: null,
      scheduleSimulationNo: null,
      scheduleSimulationName: null,
      plantId: this.plant?.plantId ? this.plant?.plantId : null,
    };
    this.getSimulation();
  }

  modalShow(data?: any) {
    if (data) {
      this.selectedSimulation = this.simulations.filter(
        (element: any) =>
          element.scheduleSimulationId === data.scheduleSimulationId
      )[0];
    }
    this.onChangeTab("simulation");
    this.myModal.show();
  }


  hide() {
    this.onChangeTab("");
    this.selectedSimulation = {};
    this.myModal.hide();
  }

  onChangeTab(type: any) {
    Object.keys(this.tabs).forEach((res: any) => {
      if (res === type) {
        this.tabs[res] = true;
      } else {
        this.tabs[res] = false;
      }
    });
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
    this.getSimulation();
  }

  delete(id) {
    this._confirmationSvc.confirm({
      message: this._translateSvc.instant("do-you-want-to-delete"),
      header: this._translateSvc.instant("delete-confirmation"),
      icon: "fa fa-trash",
      accept: async () => {
        await this._simulationService.delete(id);
        this.utilities.showSuccessToast("Save Deleted");
        this._loaderSvc.hideLoader();
        this.getSimulation();
      },
      reject: () => {
        this.utilities.showInfoToast("cancelled-operation");
      },
    });
  }

  someSimulationEvent(evnt) {
    if (evnt === "close") {
      this.hide();
    } else if (evnt === "saved") {
      this.hide();
      this.getSimulation();
      this.addSimulation.records();
    } else {
      this.onChangeTab(evnt);
    }
  }

  someEvent(evnt) {
    if (evnt === "close") {
      this.hideChild();
    } else if (evnt === "saved") {
      this.hideChild();
      this.getSimulation();
      this.addSimulation.records();
    } else {
      this.onChangeChildTab(evnt);
    }
  }

  hideChild() {
    this.onChangeChildTab("");
    // this.selectedSimulation = {};
    this.myChildModal.hide();
  }

  onChangeChildTab(type: any) {
    this.shiftRequestDto = {} as any;
    this.dataFromSimulation = {};
    this.dataFromSimulationCapacity = {};
    this.myChildModal.show();
    Object.keys(this.tabs).forEach((res: any) => {
      if (res !== 'simulation')
        if (res === type) {
          this.tabs[res] = true;
        } else {
          this.tabs[res] = false;
        }
    });
  }

  editShift(data) {
    if (data) {
      this.myChildModal.show();
      this.shiftRequestDto = data;
      Object.keys(this.tabs).forEach((res: any) => {
        if (res !== 'simulation') {
          if (res === 'addShift') {
            this.tabs[res] = true;
          } else {
            this.tabs[res] = false;
          }
        }
      });
    }
  }

  editCalender(data) {
    if (data) {
      this.myChildModal.show();
      this.dataFromSimulation = data;
      Object.keys(this.tabs).forEach((res: any) => {
        if (res !== 'simulation') {
          if (res === 'addCalendar') {
            this.tabs[res] = true;
          } else {
            this.tabs[res] = false;
          }
        }
      });
    }
  }

  editCapacity(data) {
    if (data) {
      this.myChildModal.show();
      this.dataFromSimulationCapacity = data;
      Object.keys(this.tabs).forEach((res: any) => {
        if (res !== 'simulation') {
          if (res === 'addCapacity') {
            this.tabs[res] = true;
          } else {
            this.tabs[res] = false;
          }
        }
      });
    }
  }
}
