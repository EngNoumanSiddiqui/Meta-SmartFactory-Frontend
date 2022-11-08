import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {EquipmentMonitoringDataDto} from '../../../dto/monitor/monitor';
import {UtilitiesService} from '../../../services/utilities.service';
import {interval as observableInterval, Subscription} from 'rxjs';

@Component({
  selector: 'equipment-modal-content',
  templateUrl: './equipment-modal.component.html',
  styleUrls: ['./equipment-modal.component.css']
})

export class EquipmentModalContentComponent implements OnInit, OnDestroy {
  model: EquipmentMonitoringDataDto;
  @Input('modal') modal;
  sessionCheckInterval: Subscription;

  @Input('model') set modelDto(model: EquipmentMonitoringDataDto) {
    this.model = model;
  }

  constructor(private utilities: UtilitiesService) {
  }

  ngOnInit() {
    const me = this;
    this.sessionCheckInterval = observableInterval(30 * 1000).subscribe(() => {
      // todo
    });
  }

  ngOnDestroy() {
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
  }
}
