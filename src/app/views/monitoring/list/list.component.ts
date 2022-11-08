import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import * as SockJS from 'sockjs-client';
import {SJSCloseEvent, SJSMessageEvent, SJSOpenEvent} from '../../../dto/sockjs';
import {DassTokenEnum} from '../../../dto/enum/das-token-enum';
import {JobSch, MonitoringDataDto} from '../../../dto/monitor/monitor';
import {WorkcenterService} from '../../../services/dto-services/workcenter/workcenter.service';
import {ConvertUtil} from '../../../util/convert-util';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'app/services/auth/auth-service';


@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./monitor.component.css']
})

export class ListMonitoringComponent implements OnInit, OnDestroy {

  monitoringDatas: MonitoringDataDto[] = [];
  private URL: string = environment.websocketHost;
  private sock: SockJS;
  private token;
  private _opened = false;
  handlers = {};
  machineState = 'ALL';
  allMode = true;
  malfunction = false;
  showInActive = false;
  filterWorkcenter = {pageNumber: 1, pageSize: 500, workCenterName: ''};
  workcenterList: any[];

  selectedWorkCenterId;
  modal = {
    active: false
  }
  plant = null;
  selectedItem: MonitoringDataDto;
  sub: Subscription;

  constructor(private _workcenterSvc: WorkcenterService, 
    private appStateService: AppStateService,
    private authService: AuthService) {

    this.token = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    this.initializa(this.token);

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plant = null;
      } else {
        this.plant = res;
        this.populateWorkCenterList();
      }
      
    });
  }


  workCenterChanged(workCenter) {
    if (workCenter) {
      this.selectedWorkCenterId = workCenter.workCenterId;
    } else {
      this.selectedWorkCenterId = null;
    }
  }


  ngOnInit() {


    this.authService.disableAuthChecking();

  }

  populateWorkCenterList () {
    this._workcenterSvc.filter({...this.filterWorkcenter, plantId: this.plant ? this.plant.plantId : null}).then(result => {
      this.workcenterList = [{workCenterId: null, workCenterName: 'ALL'}];
      this.workcenterList = [...this.workcenterList, ...result['content']];

    }).catch(error => console.log(error));
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

          // console.log(dataItems.filter(data => data[0].plantId === this.plant.plantId));

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
              monitor.datas[0]['onScheduleEmployee'] = me.getPercentage(monitor.datas[0].onScheduleEmployee);
              if (monitor.datas && (monitor.datas.length > 0) && (monitor.datas[0].oeeAvarageReport) && Object.keys(monitor.datas[0].oeeAvarageReport).length) {
                const oeeReport = monitor.datas[0].oeeAvarageReport;
                // this.normalizePercent(oeeReport);
                if (oeeReport) {
                  if (oeeReport.oee1) {
                    oeeReport.oee1 = me.normalizeDecimal(oeeReport.oee1);
                  }
                  oeeReport.oee2 = oeeReport.oee2 ? this.normalizeDecimal(oeeReport.oee2) : null;
                  oeeReport.availability = oeeReport.availability ? this.normalizeDecimal(oeeReport.availability):null;
                  oeeReport.quality = oeeReport.quality? this.normalizeDecimal(oeeReport.quality) :null;
                  oeeReport.teep = oeeReport.teep ? this.normalizeDecimal(oeeReport.teep) : null;
                  // if (oeeReport.teep) {
                  //   oeeReport.teep = me.normalizeDecimal(oeeReport.teep);
                  // }
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


              if (me.modal.active && me.selectedItem
                && me.selectedItem.datas && me.selectedItem.datas.length > 0
                && dataItem[0].workStationId === me.selectedItem.datas[0].workStationId) {
                me.selectedItem = monitor;
                // console.log(me.selectedItem);
              }

            }
          });


        }
      };

      this.sock.onclose = (e) => {
        if (this.sock) {
          this.sock.close();
        }
        if(this.sock && this._opened) {
          this.initializa(this.token);
        }

       
      };

      this.sock.onerror = (e) => {
        console.log(JSON.stringify(e));
        if(this.sock && this._opened) {
          this.initializa(this.token);
        }
      };

      this._opened = true;
    }

  }

  public isOpen(): boolean {
    return this._opened;
  }

  public close(): void {
    if (this._opened) {
      this._opened = false;
      this.sock.close();
      delete this.sock;
      
    }
  }
  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

  public showMonitoringDetail(data: MonitoringDataDto) {

    this.selectedItem = data;
    this.modal.active = true;
  }

  private messageReceived(e: SJSMessageEvent) {
    this.callHandlers(e.type, e.type, e.data);
  }

  private callHandlers(type: string, ...params: any[]) {
    if (this.handlers[type]) {
      this.handlers[type].forEach(function (cb) {
        cb.apply(cb, params);
      });
    }
  }

  private addEvent(type: string, callback: Function): void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(callback);
  }

  public onOpen(callback: (e: SJSOpenEvent) => any): void {
    this.addEvent('open', callback);
  }

  public onMessage(callback: (type: string, data: any) => any): void {
    this.handlers = {};
    this.addEvent('message', callback);
  }

  public onClose(callback: (e: SJSCloseEvent) => any): void {
    this.addEvent('close', callback);
  }

  public send(data) {
    if (this._opened) {
      this.sock.send(data);
    }
  }

  ngOnDestroy() {
    this.close();
    this.sub.unsubscribe();

    this.authService.enableAuthChecking();
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
    return parseFloat((value * 100).toFixed(2));
  }

  isNullOrUndefined(obj) {
    return !(obj);
  }
}
