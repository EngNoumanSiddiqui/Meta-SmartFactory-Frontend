import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { DassTokenEnum } from 'app/dto/enum/das-token-enum';
import { Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'environments/environment';
import { JobSch, MonitoringDataDto } from 'app/dto/monitor/monitor';
import { ConvertUtil } from 'app/util/convert-util';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
import { LoaderService } from 'app/services/shared/loader.service';
import { UsersService } from 'app/services/users/users.service';
@Component({
  selector: 'real-time-production-monitoring',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './list.component.html',
  styles: [`
   .container_components {
      max-height: 120px;
      overflow: hidden;
      /* display: list-item; */
    }

     .show_components {
      overflow: visible;
      max-height: 100%;
    }
  `]
})
export class ListProductionMonitoringComponent implements OnInit, OnDestroy {
  private URL: string = environment.websocketHost;
  private sock: SockJS;
  private token;
  private _opened = false;
  loading = false;
  machineState = 'ALL';
  selectedProductionMonitoringList: any = [] = [];

  productionMonitoringList = [];
  oldProductionMonitoringList = [];
  sub: Subscription;
  plant: any;
  monitoringDatas: MonitoringDataDto[] = [];
  productionSelectItem = null;
  showFullComponents = -10;
  showFullMaterials = -10;
  selectedColumns = [
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'workStationName', header: 'workstation' },
    { field: 'material', header: 'material' },
    // { field: 'setup', header: 'setup-min'  },
    // { field: 'actualSetup', header: 'actual-setup-min' },
    { field: 'plannedQuantity', header: 'planned-quantity' },
    { field: 'goodPieces', header: 'good-pieces' },
    { field: 'scrapPieces', header: 'scrap-pieces' },
    { field: 'components', header: 'component' },
    { field: 'neededQuantity', header: 'needed-quantity' },
    { field: 'usedQuantity', header: 'used-quantity' },
    { field: 'scrapQuantity', header: 'scrap-quantity' },
    { field: 'joScrapPercentage', header: 'jo-scrap-per' },
    { field: 'joChanges', header: 'jo-scrap-changes' },
    { field: 'joChanges-percent', header: 'jo-scrap-changes' },
    { field: 'joChanges-color', header: 'jo-scrap-changes' },
    { field: 'oee-per', header: 'oee-per' },
    // { field: 'oee2', header: 'oee2-per'  },
    // { field: 'plannedDuration', header: 'planned-duration-min' },
    // { field: 'plannedStart', header: 'planned-start-hm' },
    // { field: 'duration', header: 'duration-min'  },
    // { field: 'targetCurrently', header: 'target-currently'  },
    { field: 'onSchedule', header: 'on-schedule' },
    { field: 'scheduleChanges', header: 'on-schedule-changes' },
    { field: 'scheduleChanges-percentage', header: 'on-schedule-changes' },
    { field: 'scheduleChanges-color', header: 'on-schedule-changes' },
    { field: 'machineStatus', header: 'machine-status' },
    { field: 'status', header: 'production-state' },

  ]
  showedcols = [
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'workStationName', header: 'workstation' },
    { field: 'material', header: 'material' },
    { field: 'setup', header: 'setup-min' },
    { field: 'actualSetup', header: 'actual-setup-min' },
    { field: 'plannedQuantity', header: 'planned-quantity' },
    { field: 'goodPieces', header: 'good-pieces' },
    { field: 'scrapPieces', header: 'scrap-pieces' },
    { field: 'components', header: 'component' },
    { field: 'neededQuantity', header: 'needed-quantity' },
    { field: 'usedQuantity', header: 'used-quantity' },
    { field: 'scrapQuantity', header: 'scrap-quantity' },
    { field: 'joScrapPercentage', header: 'jo-scrap-per' },
    { field: 'joChanges', header: 'jo-scrap-changes' },
    { field: 'joChanges-percent', header: 'jo-scrap-changes' },
    { field: 'joChanges-color', header: 'jo-scrap-changes' },
    { field: 'oee1', header: 'oee1-per' },
    { field: 'oee2', header: 'oee2-per' },
    { field: 'plannedDuration', header: 'planned-duration-min' },
    { field: 'plannedStart', header: 'planned-start-hm' },
    { field: 'duration', header: 'duration-min' },
    { field: 'targetCurrently', header: 'target-currently' },
    { field: 'onSchedule', header: 'on-schedule' },
    { field: 'scheduleChanges', header: 'on-schedule-changes' },
    { field: 'scheduleChanges-percentage', header: 'on-schedule-changes' },
    { field: 'scheduleChanges-color', header: 'on-schedule-changes' },
    { field: 'machineStatus', header: 'machine-status' },
    { field: 'status', header: 'production-state' },

  ];
  cols = [
    { field: 'jobOrderId', header: 'job-order-id' },
    { field: 'workStationName', header: 'workstation' },
    { field: 'material', header: 'material' },
    { field: 'setup', header: 'setup-min' },
    { field: 'actualSetup', header: 'actual-setup-min' },
    // { field: 'plannedQuantity', header: 'planned-quantity'  },
    // { field: 'goodPieces', header: 'good-pieces'  },
    // { field: 'scrapPieces', header: 'scrap-pieces'  },
    { field: 'components', header: 'component' },
    // { field: 'neededQuantity', header: 'needed-quantity'  },
    // { field: 'usedQuantity', header: 'used-quantity'  },
    // { field: 'scrapQuantity', header: 'scrap-quantity'  },
    { field: 'joScrapPercentage', header: 'jo-scrap-per' },
    { field: 'joChanges', header: 'jo-scrap-changes' },
    // { field: 'joChanges-percent', header: 'jo-scrap-changes' },
    // { field: 'joChanges-color', header: 'jo-scrap-changes' },
    { field: 'oee1', header: 'oee1-per' },
    { field: 'oee2', header: 'oee2-per' },
    { field: 'plannedDuration', header: 'planned-duration-min' },
    { field: 'plannedStart', header: 'planned-start-hm' },
    { field: 'duration', header: 'duration-min' },
    { field: 'targetCurrently', header: 'target-currently' },
    { field: 'onSchedule', header: 'on-schedule' },
    { field: 'scheduleChanges', header: 'on-schedule-changes' },
    // { field: 'scheduleChanges-percentage', header: 'on-schedule-changes' },
    // { field: 'scheduleChanges-color', header: 'on-schedule-changes' },
    { field: 'machineStatus', header: 'machine-status' },
    { field: 'status', header: 'production-state' },

  ]

  maintenancecols = [
    { field: 'maintenanceOrderId', header: 'maintenance-order-id' },
    { field: 'workstation', header: 'workstation' },
    { field: 'operation', header: 'operation' },
    { field: 'orderType', header: 'order-type' },
    { field: 'plannerGroup', header: 'planner-group' },
    { field: 'equipment', header: 'equipment' },
    { field: 'component', header: 'component' },
    { field: 'quantity', header: 'quantity-unit' },
    { field: 'duration', header: 'duration-min' },
    { field: 'actualStart', header: 'actual-start' },
    { field: 'actualFinish', header: 'actual-finish' },
    { field: 'onSchedule', header: 'on-schedule' },
    { field: 'scheduleChanges', header: 'on-schedule-changes' },
    { field: 'scheduleChanges-percentage', header: 'on-schedule-changes' },
    { field: 'scheduleChanges-color', header: 'on-schedule-changes' },
    { field: 'maintenanceState', header: 'maintenance-status' }
  ];
  selectedWorkCenterId: any;
  selectedWorkstationId: any;
  fullproductionMonitoringList = [];

  // total top percentage real time calculation

  oldScrapPiecesMaterial = 0;
  newScrapPiecesMaterial = 0;
  oldGoodPiecesMaterial = 0;
  newGoodPiecesMaterial = 0;
  oldScrapPiecesComponent = 0;
  newScrapPiecesComponent = 0;
  oldUsedPiecesComponent = 0;
  newUsedPiecesComponent = 0;

  oldAverageJoScrap = 0;
  newAverageJoScrap = 0;

  oldAverageSchedule = 0;
  newAverageSchdedule = 0;

  constructor(private cdx: ChangeDetectorRef, private loaderService: LoaderService,
    private userService: UsersService,
    private appStateService: AppStateService) {
    if (this.userService.getPlant() !== null) {
      this.plant = JSON.parse(this.userService.getPlant());
    }
    this.token = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    this.loading = true;
    this.initializa(this.token);

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plant = null;
      } else {
        this.plant = res;
      }
      // this.populateWorkCenterList();
    });
  }



  ngOnInit() {
  }
  ngOnDestroy() {
    this.close();
    this.sub.unsubscribe();
  }


  showJobOrderDetail(jobOrderId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.JOBORDER, jobOrderId);
  }
  showWsDetail(workstationId) {
    this.loaderService.showDetailDialog(DialogTypeEnum.WORKSTATION, workstationId);
  }
  showMaterialDetail(materialId) {
    if (materialId) {
      this.loaderService.showDetailDialog(DialogTypeEnum.STOCK, materialId);
    }
  }
  public close(): void {
    if (this._opened) {
      this.sock.close();
      delete this.sock;
      this._opened = false;
    }
  }

  workCenterChanged(workCenter) {
    if (workCenter) {
      this.selectedWorkCenterId = workCenter.workCenterId;
    } else {
      this.selectedWorkCenterId = null;
    }
  }
  workStationChanged(workstation) {
    if (workstation) {
      this.selectedWorkstationId = workstation.workStationId;
    } else {
      this.selectedWorkstationId = null;
    }
  }

  filterColumns(col: any) {
    const a = !(col.field === 'joChanges-percent') && !(col.field === 'joChanges-color')
      && !(col.field === 'scheduleChanges-percentage') && !(col.field === 'scheduleChanges-color');
    return a;
  }

  onColumnChanged(event) {
    if (this.machineState === 'ALL' || this.machineState === 'PRODUCTION') {
      if (this.selectedColumns.findIndex(itm => itm.field === 'workStationName') !== -1) {
        this.selectedColumns.splice(1, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'workStationName'), 1)[0]);
      }
      if (this.selectedColumns.findIndex(itm => itm.field === 'jobOrderId') !== -1) {
        this.selectedColumns.splice(0, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'jobOrderId'), 1)[0]);
      }
      // maintain material column at same position
      if (this.selectedColumns.findIndex(itm => itm.field === 'material') !== -1) {
        const indexNo = 2;
        this.selectedColumns.splice(indexNo, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'material'), 1)[0]);
        if (this.selectedColumns.findIndex(itm => itm.field === 'plannedQuantity') === -1) {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'plannedQuantity'));
          this.selectedColumns.splice(indexNo + 1, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'plannedQuantity'), 1)[0]);
        } else {
          this.selectedColumns.splice(indexNo + 1, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'plannedQuantity'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'goodPieces') === -1) {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'goodPieces'));
          this.selectedColumns.splice(indexNo + 2, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'goodPieces'), 1)[0]);
        } else {
          this.selectedColumns.splice(indexNo + 2, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'goodPieces'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'scrapPieces') === -1) {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'scrapPieces'));
          this.selectedColumns.splice(indexNo + 3, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scrapPieces'), 1)[0]);
        } else {
          this.selectedColumns.splice(indexNo + 3, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scrapPieces'), 1)[0]);
        }
      } else {
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'material'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'plannedQuantity'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'goodPieces'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scrapPieces'), 1);
      }
      // maintain components column at same position
      if (this.selectedColumns.findIndex(itm => itm.field === 'components') !== -1) {
        const indexNo = 6;
        this.selectedColumns.splice(indexNo, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'components'), 1)[0]);
        if (this.selectedColumns.findIndex(itm => itm.field === 'neededQuantity') === -1) {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'neededQuantity'));
          this.selectedColumns.splice(indexNo + 1, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'neededQuantity'), 1)[0]);
        } else {
          this.selectedColumns.splice(indexNo + 1, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'neededQuantity'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'usedQuantity') === -1) {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'usedQuantity'));
          this.selectedColumns.splice(indexNo + 2, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'usedQuantity'), 1)[0]);
        } else {
          this.selectedColumns.splice(indexNo + 2, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'usedQuantity'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'scrapQuantity') === -1) {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'scrapQuantity'));
          this.selectedColumns.splice(indexNo + 3, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scrapQuantity'), 1)[0]);
        } else {
          this.selectedColumns.splice(indexNo + 3, 0, this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scrapQuantity'), 1)[0]);
        }
      } else {
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'components'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'neededQuantity'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'usedQuantity'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scrapQuantity'), 1);
      }



      if (this.selectedColumns.findIndex(itm => itm.field === 'joChanges') !== -1) {
        const indexNo = 11;
        this.selectedColumns.splice(indexNo, 0,
          this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges'), 1)[0]);
        if (this.selectedColumns.findIndex(itm => itm.field === 'joChanges-percent') !== -1) {
          this.selectedColumns.splice(indexNo + 1, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges-percent'), 1)[0]);
        } else {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'joChanges-percent'));
          this.selectedColumns.splice(indexNo + 1, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges-percent'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'joChanges-color') !== -1) {
          this.selectedColumns.splice(indexNo + 2, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges-color'), 1)[0]);
        } else {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'joChanges-color'));
          this.selectedColumns.splice(indexNo + 2, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges-color'), 1)[0]);
        }

      } else {
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges-percent'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'joChanges-color'), 1);
      }
      if (this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges') !== -1) {
        const indexNo = (this.selectedColumns.findIndex(itm => itm.field === 'joChanges') !== -1) ? 16 : 13;
        this.selectedColumns.splice(indexNo, 0,
          this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges'), 1)[0])

        if (this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage') !== -1) {
          this.selectedColumns.splice(indexNo + 1, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage'), 1)[0]);
        } else {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'scheduleChanges-percentage'));
          this.selectedColumns.splice(indexNo + 1, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color') !== -1) {
          this.selectedColumns.splice(indexNo + 2, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color'), 1)[0]);
        } else {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'scheduleChanges-color'));
          this.selectedColumns.splice(indexNo + 2, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color'), 1)[0]);
        }
      } else {
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color'), 1);
      }
    } else {
      if (this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges') !== -1) {
        this.selectedColumns.splice(12, 0,
          this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges'), 1)[0])

        if (this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage') !== -1) {
          this.selectedColumns.splice(13, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage'), 1)[0]);
        } else {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'scheduleChanges-percentage'));
          this.selectedColumns.splice(13, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage'), 1)[0]);
        }
        if (this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color') !== -1) {
          this.selectedColumns.splice(14, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color'), 1)[0]);
        } else {
          this.selectedColumns.push(this.showedcols.find(itm => itm.field === 'scheduleChanges-color'));
          this.selectedColumns.splice(14, 0,
            this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color'), 1)[0]);
        }
      } else {
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-percentage'), 1);
        this.selectedColumns.splice(this.selectedColumns.findIndex(itm => itm.field === 'scheduleChanges-color'), 1);
      }
    }
    // const joChanges = event.find(itm => itm.field === 'joChanges');
    // if (joChanges) {
    //   this.selectedColumns = event.forEach(element => element.field !== 'joChanges-percent' && element.field !== 'joChanges-color');
    // }
  }
  initializa(token) {
    const me = this;
    if (!this._opened) {
      this.sock = new SockJS(this.URL + 'status');
      this.sock.onopen = (e) => {
        console.log('ws opened')
      };

      this.sock.onmessage = (e) => {
        if ((typeof (e.data) !== 'undefined') && (e.data !== null)) {

          const dataItems = JSON.parse(e.data) as any[];

          me.monitoringDatas = [];

          if (dataItems.length === 0) {
            return;
          }

          dataItems.forEach((dataItem: JobSch[]) => {
            if (dataItem.length !== 0) {
              const monitor = new MonitoringDataDto();
              monitor.datas = dataItem;
              monitor.datas[0]['lastStopDurationAsString'] = me.getReadableTime(monitor.datas[0].lastStopDuration);
              monitor.datas[0]['jobOperationTimeAsString'] = me.getReadableTime(monitor.datas[0].jobOperationTime);
              monitor.datas[0]['onSchedule'] = me.getPercentage(monitor.datas[0].onSchedule);

              if (dataItem.length > 1) {
                // for manual jobs, more than 1 JobSch may come
                for (const item of monitor.datas) {
                  item.onSchedule = me.getPercentage(item.onSchedule);
                }
              }

              if (monitor.datas && (monitor.datas.length > 0) && (monitor.datas[0].oeeAvarageReport) && Object.keys(monitor.datas[0].oeeAvarageReport).length) {
                const oeeReport = monitor.datas[0].oeeAvarageReport;
                // this.normalizePercent(oeeReport);
                if (oeeReport) {
                  if (oeeReport.oee1) {
                    oeeReport.oee1 = me.normalizeDecimal(oeeReport.oee1);
                  }
                  if (oeeReport.oee2) {
                    oeeReport.oee2 = me.normalizeDecimal(oeeReport.oee2);
                  }
                  if (oeeReport.workPerformance) {
                    oeeReport.workPerformance = me.normalizeDecimal(oeeReport.workPerformance);
                  }
                  if (oeeReport.actualPerformance) {
                    oeeReport.actualPerformance = me.normalizeDecimal(oeeReport.actualPerformance);
                  }
                }
              }
              if (!(monitor.datas[0].oeeAvarageReport)) {
                monitor.datas[0].oeeAvarageReport = {
                  workstationId: 0,
                  shiftId: 0,
                  availability: 0,
                  quality: 0,
                  oee1: 0,
                  oee2: 0,
                  actualPerformance: 0,
                  workPerformance: 0,
                  teep: 0,
                  utilization: 0,
                  fullyProductiveTime: '',
                  hiddenFactory: '',
                };
              }
              // if (this.plant && this.plant.plantId) {
              //   if (monitor.datas[0].plantId === this.plant.plantId) {
              //     me.monitoringDatas.push(monitor);
              //   } else if (!monitor.datas[0].plantId) {
              //     me.monitoringDatas.push(monitor);
              //   }
              // } else {
              me.monitoringDatas.push(monitor);
              // }


              // if (me.modal.active && me.selectedItem
              //   && me.selectedItem.datas && me.selectedItem.datas.length > 0
              //   && dataItem[0].workStationId === me.selectedItem.datas[0].workStationId) {
              //   me.selectedItem = monitor;
              //   // console.log(me.selectedItem);
              // }

            }
          });
          const TwoDArray = me.monitoringDatas.map(itm => [...itm.datas]);
          this.oldProductionMonitoringList = this.productionMonitoringList ? JSON.parse(JSON.stringify(this.productionMonitoringList)) : [].concat(...TwoDArray);
          this.productionMonitoringList = [].concat(...TwoDArray);
          this.productionMonitoringList.map((item) => {
            const workstation = this.oldProductionMonitoringList.find(itm => itm.workStationId === item.workStationId);
            if (workstation) {
              /// for schedule
              if (item.onSchedule > workstation.onSchedule) {
                item.onScheduleBoolean = true;
                const newNumber = item.onSchedule - workstation.onSchedule;
                item.onScheduleChangesPer = (newNumber / workstation.onSchedule) * 100;
              } else if (item.onSchedule < workstation.onSchedule) {
                item.onScheduleBoolean = false;
                const newNumber = workstation.onSchedule - item.onSchedule;
                item.onScheduleChangesPer = (newNumber / workstation.onSchedule) * 100;
              } else {
                item.onScheduleBoolean = null;
                item.onScheduleChangesPer = 0;
              }

              // for JO Changes
              if (item.joScrapValue > workstation.joScrapValue) {
                item.OnJoChangesBoolean = true;
                const newNumber = item.joScrapValue - workstation.joScrapValue;
                item.OnJoChangesPer = (newNumber / workstation.joScrapValue) * 100;
              } else if (item.joScrapValue < workstation.joScrapValue) {
                item.OnJoChangesBoolean = false;
                const newNumber = workstation.joScrapValue - item.joScrapValue;
                item.OnJoChangesPer = (newNumber / workstation.joScrapValue) * 100;
              } else {
                if ((item.machineStatus === 'Closed') && (item.status === 'CLOSED')) {
                  item.OnJoChangesBoolean = null;
                } else {
                  item.OnJoChangesBoolean = workstation.OnJoChangesBoolean;
                }
                item.OnJoChangesPer = 0;

              }
            } else {
              item.onScheduleBoolean = null;
              item.OnJoChangesBoolean = null;
              item.onScheduleChangesPer = 0;
              item.OnJoChangesPer = 0;
              if (item.machineStatus === 'Running' || item.status === 'PRODUCTION') {
                item.onScheduleBoolean = true;
                if (item.joScrapValue > 0) {
                  item.OnJoChangesBoolean = true;
                }
              } else if (item.machineStatus === 'StandBy') {
                item.onScheduleBoolean = false;
              }
            }
            return { ...item }
          })

          this.fullproductionMonitoringList = JSON.parse(JSON.stringify(this.productionMonitoringList));
          if (this.machineState === 'PRODUCTION' || this.machineState === 'ALL') {
            this.productionMonitoringList = this.productionMonitoringList.filter(item => item.jobOrderId !== 0);
            if (this.productionSelectItem) {
              this.onProdListChanged(this.productionSelectItem);
            }
          } else {
            this.productionMonitoringList = this.productionMonitoringList.filter(item => item.maintenanceOperationWsDto
              && item.maintenanceOperationWsDto.maintenanceOrder
              && item.maintenanceOperationWsDto.maintenanceOrder.maintenanceId !== 0);
          }
          this.OnHeaderMaterialAndComponentCalculation();
          this.loading = false;

          console.log(this.showFullMaterials);
          this.cdx.detectChanges();
        }
      };

      this.sock.onclose = (e) => {
        if (this.sock) {
          this.sock.close();
        }
      };

      this.sock.onerror = (e) => {
        console.log(JSON.stringify(e));
      };

      this._opened = true;
    }

  }

  getMaterials = (rowData, index) => {
    return (this.showFullMaterials === index) ? rowData.materiaList : rowData.materiaList.slice(0, 2);
  }

  OnHeaderMaterialAndComponentCalculation() {
    this.oldScrapPiecesMaterial = this.newScrapPiecesMaterial;
    this.oldGoodPiecesMaterial = this.newGoodPiecesMaterial;
    this.oldScrapPiecesComponent = this.newScrapPiecesComponent;
    this.oldUsedPiecesComponent = this.newUsedPiecesComponent;
    this.oldAverageJoScrap = this.newAverageJoScrap;
    this.oldAverageSchedule = this.newAverageSchdedule;

    this.newScrapPiecesMaterial = 0;
    this.newGoodPiecesMaterial = 0;
    this.newScrapPiecesComponent = 0;
    this.newUsedPiecesComponent = 0;
    this.newAverageJoScrap = 0;
    this.newAverageSchdedule = 0;

    this.productionMonitoringList.forEach(item => {
      if (this.plant.plantId === item.plantId) {
        if (item.materiaList && item.materiaList.length > 0) {
          item.materiaList.forEach(material => {
            this.newScrapPiecesMaterial = this.newScrapPiecesMaterial + material.scrapQuantity;
            this.newGoodPiecesMaterial = this.newGoodPiecesMaterial + material.producedQuantity;
          });
        }
        if (item.componentList && item.componentList.length > 0) {
          item.componentList.forEach(component => {
            this.newScrapPiecesComponent = this.newScrapPiecesComponent + component.scrapQuantity;
            this.newUsedPiecesComponent = this.newUsedPiecesComponent + component.producedQuantity;
          });
        }
        this.newAverageSchdedule = this.newAverageSchdedule + Number(item.onSchedule);
        this.newAverageJoScrap = this.newAverageJoScrap + Number(item.joScrapValue);
      }
    })
  }

  onProductionStatusChanged(event) {
    if (event === 'PRODUCTION') {
      this.selectedColumns = [
        { field: 'jobOrderId', header: 'job-order-id' },
        { field: 'workStationName', header: 'workstation' },
        { field: 'material', header: 'material' },
        // { field: 'setup', header: 'setup-min'  },
        // { field: 'actualSetup', header: 'actual-setup-min' },
        { field: 'plannedQuantity', header: 'planned-quantity' },
        { field: 'goodPieces', header: 'good-pieces' },
        { field: 'scrapPieces', header: 'scrap-pieces' },
        { field: 'joScrapPercentage', header: 'jo-scrap-per' },
        { field: 'joChanges', header: 'jo-scrap-changes' },
        { field: 'joChanges-percent', header: 'jo-scrap-changes' },
        { field: 'joChanges-color', header: 'jo-scrap-changes' },
        { field: 'oee-per', header: 'oee-per' },
        // { field: 'oee2', header: 'oee2-per'  },
        // { field: 'plannedDuration', header: 'planned-duration-min' },
        // { field: 'plannedStart', header: 'planned-start-hm' },
        // { field: 'duration', header: 'duration-min'  },
        // { field: 'targetCurrently', header: 'target-currently'  },
        { field: 'onSchedule', header: 'on-schedule' },
        { field: 'scheduleChanges', header: 'on-schedule-changes' },
        { field: 'scheduleChanges-percentage', header: 'on-schedule-changes' },
        { field: 'scheduleChanges-color', header: 'on-schedule-changes' },
        { field: 'machineStatus', header: 'machine-status' },
        { field: 'status', header: 'production-state' },

      ];
      this.productionMonitoringList = this.fullproductionMonitoringList.filter(item => item.jobOrderId !== 0);
      if (this.productionSelectItem) {
        this.onProdListChanged(this.productionSelectItem);
      }
    } else if (event === 'MAINTENANCE') {
      this.selectedColumns = [
        { field: 'maintenanceOrderId', header: 'maintenance-order-id' },
        { field: 'workstation', header: 'workstation' },
        { field: 'operation', header: 'operation' },
        { field: 'orderType', header: 'order-type' },
        { field: 'plannerGroup', header: 'planner-group' },
        { field: 'equipment', header: 'equipment' },
        { field: 'component', header: 'component' },
        { field: 'quantity', header: 'quantity-unit' },
        { field: 'duration', header: 'duration-min' },
        { field: 'actualStart', header: 'actual-start' },
        { field: 'actualFinish', header: 'actual-finish' },
        { field: 'onSchedule', header: 'on-schedule' },
        { field: 'scheduleChanges', header: 'on-schedule-changes' },
        { field: 'scheduleChanges-percentage', header: 'on-schedule-changes' },
        { field: 'scheduleChanges-color', header: 'on-schedule-changes' },
        { field: 'maintenanceState', header: 'maintenance-status' },
        // { field: 'machineStatus', header: 'machine-status'  },
        // { field: 'status', header: 'production-state'  },

      ];
      this.productionMonitoringList = this.fullproductionMonitoringList.filter(item => item.maintenanceOperationWsDto
        && item.maintenanceOperationWsDto.maintenanceOrder
        && item.maintenanceOperationWsDto.maintenanceOrder.maintenanceId !== 0);
    }
  }
  getOnSchedule = (rowData) => {
    if (!this.oldProductionMonitoringList || this.oldProductionMonitoringList.length === 0) {
      if (rowData.status === 'PRODUCTION') {
        return true;
      } else if (rowData.status === 'MAINTENANCE' || rowData.status === 'CLOSED') {
        return null;
      }
      return false;
    }
    const workstation = this.oldProductionMonitoringList.find(itm => itm.workStationId === rowData.workStationId);
    if (workstation) {
      if (rowData.onSchedule > workstation.onSchedule) {
        return true;
      } else if (rowData.onSchedule < workstation.onSchedule) {
        return false;
      }
    }
    return null;
  }

  onProdListChanged(event) {
    const arr = this.fullproductionMonitoringList.filter(item => item.jobOrderId !== 0);
    switch (event) {
      case 'JO_IN_SCRAP':
        this.productionMonitoringList = arr.sort((a, b) => a.OnJoChangesPer - b.OnJoChangesPer).filter((itm, i) => itm.OnJoChangesBoolean === true && i < 11);
        break;
      case 'JO_DE_SCRAP':
        this.productionMonitoringList = arr.sort((a, b) => b.OnJoChangesPer - a.OnJoChangesPer).filter((itm, i) => itm.OnJoChangesBoolean === false && i < 11);
        break;
      case 'JO_IN_SCHEDULE':
        this.productionMonitoringList = arr.sort((a, b) => a.onSchedule - b.onSchedule).filter((itm, i) => itm.onScheduleBoolean === true && i < 11);
        break;
      case 'JO_DE_SCHEDULE':
        this.productionMonitoringList = arr.sort((a, b) => b.onSchedule - a.onSchedule).filter((itm, i) => itm.onScheduleBoolean === false && i < 11);
        break;
      case 'JO_UN_SCRAP':
        this.productionMonitoringList = arr.sort((a, b) => b.OnJoChangesPer - a.OnJoChangesPer).filter((itm, i) => itm.OnJoChangesBoolean === null && i < 11);
        break;
      case 'JO_UN_SCHEDULE':
        this.productionMonitoringList = arr.sort((a, b) => b.onSchedule - a.onSchedule).filter((itm, i) => itm.onScheduleBoolean === null && i < 11);
        break;

      default:
        this.productionMonitoringList = arr;
        break;
    }
  }

  getOnJoChanges = (rowData) => {
    if (!this.oldProductionMonitoringList || this.oldProductionMonitoringList.length === 0) {
      if (rowData.status === 'PRODUCTION') {
        return true;
      } else if (rowData.status === 'MAINTENANCE' || rowData.status === 'CLOSED') {
        return null;
      }
      return false;
    }
    const workstation = this.oldProductionMonitoringList.find(itm => itm.workStationId === rowData.workStationId);
    if (workstation) {
      if (rowData.materiaList && ((rowData.materiaList[0]?.scrapQuantity / rowData.materiaList[0]?.neededQuantity) * 100) >
        workstation.materiaList && ((workstation.materiaList[0]?.scrapQuantity / workstation.materiaList[0]?.neededQuantity) * 100)) {
        return true;
      } else if (rowData.materiaList && ((rowData.materiaList[0]?.scrapQuantity / rowData.materiaList[0]?.neededQuantity) * 100) <
        workstation.materiaList && ((workstation.materiaList[0]?.scrapQuantity / workstation.materiaList[0]?.neededQuantity) * 100)) {
        return false;
      }
    }
    return null;
  }

  getReadableTime(time) {
    if (time) {

      return ConvertUtil.longDuration2DHHMMSSTime(time)
    } else {
      return ' - ';
    }
  }

  normalizeDecimal(value) {
    if (Number(value) === 100) {
      return Math.round(100);
    }
    return Math.round(value * 100);
  }
  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

}

