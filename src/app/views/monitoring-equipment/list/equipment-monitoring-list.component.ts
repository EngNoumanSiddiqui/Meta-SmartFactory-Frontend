import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import * as SockJS from 'sockjs-client';
import {SJSCloseEvent, SJSMessageEvent, SJSOpenEvent} from '../../../dto/sockjs';
import {DassTokenEnum} from '../../../dto/enum/das-token-enum';
import {EquipmentMonitoringDataDto} from '../../../dto/monitor/monitor';
import {WorkcenterService} from '../../../services/dto-services/workcenter/workcenter.service';
import {ConvertUtil} from '../../../util/convert-util';

import { AppStateService } from 'app/services/dto-services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './equipment-monitoring-list.component.html',
  styleUrls: ['./equipment-monitor.component.css']
})

export class EquipmentMonitoringListComponent implements OnInit, OnDestroy {

  monitoringDatas: EquipmentMonitoringDataDto[] = [];
  private URL: string = environment.websocketHost;
  private sock: SockJS;
  private token;
  private _opened = false;
  handlers = {};
  machineState = 'ALL';
  allMode = true;
  filterWorkcenter = {pageNumber: 1, pageSize: 500, workCenterName: ''};
  workcenterList: any[];

  selectedWorkCenterId;
  modal = {
    active: false
  }
  plant = null;
  selectedItem: EquipmentMonitoringDataDto;
  sub: Subscription;

  constructor(private _workcenterSvc: WorkcenterService, private appStateService: AppStateService) {

    this.token = JSON.parse(localStorage.getItem(DassTokenEnum.TOKEN_DATA_KEY));
    this.initializa(this.token);

    this.sub = this.appStateService.plantAnnounced$.subscribe(res => {
      if (!(res)) {
        this.plant = null;
      } else {
        this.plant = res;
      }
      this.populateWorkCenterList();
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
      this.sock = new SockJS(this.URL + 'iodata');
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

          dataItems.forEach((dataItem: EquipmentMonitoringDataDto) => {
            if (dataItem) {
              me.monitoringDatas.push(dataItem);

              if (me.modal.active && me.selectedItem && dataItem.workStationId === me.selectedItem.workStationId) {
                me.selectedItem = dataItem;
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
      };

      this.sock.onerror = (e) => {
        console.log(JSON.stringify(e));
      };

      this._opened = true;
    }

  }

  public isOpen(): boolean {
    return this._opened;
  }

  public close(): void {
    if (this._opened) {
      this.sock.close();
      delete this.sock;
      this._opened = false;
    }
  }
  getPercentage(val) {
    if (val) {
      return (val * 100).toFixed(2);
    }
    return 0;
  }

  public showMonitoringDetail(data: EquipmentMonitoringDataDto) {

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

  isNullOrUndefined(obj) {
    return !(obj);
  }
}
