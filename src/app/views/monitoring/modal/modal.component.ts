import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {JobSch, MonitoringDataDto} from '../../../dto/monitor/monitor';
import {StopService} from '../../../services/dto-services/stop/stop.service';
import {UtilitiesService} from '../../../services/utilities.service';
import {interval as observableInterval, Subscription} from 'rxjs';
import { ScrapService } from 'app/services/dto-services/scrap.service';

@Component({
  selector: 'modal-content',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalContentComponent implements OnInit, OnDestroy {
  models: JobSch[];
  model: MonitoringDataDto;
  @Input('modal') modal;

  @Output() modalClosedEvent = new EventEmitter<any>();

  jobOrderId;
  stops;
  scrapData;
  reworkData;
  sessionCheckInterval: Subscription;

  workstationCategory = 'none';
  typeArray: Array<string> = [];

  @Input('model') set modelDto(model: MonitoringDataDto) {
    this.model = model;
    if (model) {
      this.models = model.datas;
      if (this.models[0].workstationCategory === 'LABOR') {
        this.workstationCategory = 'LABOR';
      } else {
        this.workstationCategory = 'none';
        this.getStops(this.models[0].jobOrderId, false);
        this.getScrapReworkData(this.models[0].jobOrderId, this.models[0].workStationName, 'REWORK', this.models[0].plantId, false);
        this.getScrapReworkData(this.models[0].jobOrderId, this.models[0].workStationName, 'SCRAP', this.models[0].plantId, false)
      }
     
    } else {
      this.models = null;
    }
  }


  constructor(private stopService: StopService, private utilities: UtilitiesService, private scrapService: ScrapService) {
  }

  ngOnInit() {
    this.startGettingDataSession();
  }

  startGettingDataSession() {
    const me = this;
    this.sessionCheckInterval = observableInterval(30 * 1000).subscribe(() => {
      me.getStops(me.jobOrderId, true);
      this.getScrapReworkData(me.jobOrderId, this.models[0].workStationName, 'REWORK', this.models[0].plantId, true);
      this.getScrapReworkData(me.jobOrderId, this.models[0].workStationName, 'SCRAP', this.models[0].plantId, true);
    });
  }

  ngOnDestroy() {
    this.typeArray = [];
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
  }

  onHideModal() {
    this.modal.active=false; 
    this.typeArray=[];
    this.modalClosedEvent.emit('modalClosed');
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
  }

  getStops(jobOrderId, forceUpdate) {

    if (this.jobOrderId === jobOrderId && !forceUpdate) {
      return;
    }

    this.jobOrderId = jobOrderId;

    if (!jobOrderId) {
      this.stops = null;
      return;
    }

    const data = {jobOrderId: jobOrderId};
    this.stopService.panelCustomsStops(data).then(res => {
      this.stops = res;
    }).catch(err => {
      this.utilities.showErrorToast(err);
    });
  }

  getScrapReworkData(jobOrderId, workstationName, type, plantId, forceUpdate) {
    if (this.jobOrderId === jobOrderId && !forceUpdate && this.typeArray.includes(type)) {
      return;
    }
    this.jobOrderId = jobOrderId;
    this.typeArray.push(type);
    if (!jobOrderId || !workstationName) {
      this.reworkData = null;
      this.scrapData = null;
      return;
    }
    const data = {jobOrderId, workstationName, type, plantId};
    this.scrapService.panelFilter(data).then(res => {
      if(type === 'REWORK') {
        this.reworkData = res['content'];
      } else {
        this.scrapData = res['content'];
      }
    }).catch(err => {
      this.utilities.showErrorToast(err);
    })
  }


}
