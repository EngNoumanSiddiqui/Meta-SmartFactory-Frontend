import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {EquipmentMonitoringDataDto} from '../../../dto/monitor/monitor';
import {ConvertUtil} from '../../../util/convert-util';
import {Subscription} from 'rxjs';

@Component({
  selector: 'equipment-monitoring-modal-detail',
  templateUrl: './equipment-monitoring-detail.component.html',
  styleUrls: ['./equipment-monitoring-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EquipmentMonitoringDetailComponent implements OnInit, OnDestroy {

  showFullComponents = false;
  model: EquipmentMonitoringDataDto;

  sessionCheckInterval: Subscription;
  height = "38rem";
  @Input('model') set modelDto(model: EquipmentMonitoringDataDto) {
    this.model = model;
    if(this.model) {
      if(this.model.equipmentDataList.length === 2) {
        this.height = "18rem";
      } else if(this.model.equipmentDataList.length >= 3) {
        this.height = "16.5rem";
      }
    }
  }

  constructor() {

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (this.sessionCheckInterval) {
      this.sessionCheckInterval.unsubscribe();
    }
  }

  getReadableTime(time) {
    if (time) {
      return ConvertUtil.longDuration2DHHMMSSTime(time)
    } else {
      return ' - ';
    }
  }

  toDate(duration) {
    if (duration && duration > -1) {
      const d = new Date(0, 0, 0, 0, 0, 0, 0);
      d.setMilliseconds(duration)
      return d;
    }
    return 0;
  }

}
