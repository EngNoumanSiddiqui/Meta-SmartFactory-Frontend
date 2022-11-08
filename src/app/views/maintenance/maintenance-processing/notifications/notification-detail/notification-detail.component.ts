

import {Component, Input, OnInit} from '@angular/core';
import {UtilitiesService} from '../../../../../services/utilities.service';
import {LoaderService} from '../../../../../services/shared/loader.service';
import { NotificationsService } from 'app/services/dto-services/maintenance/notifications.service';
import { MaintenanceOrderService } from 'app/services/dto-services/maintenance-equipment/maintenance-order.service';
import { DialogTypeEnum } from 'app/services/shared/dialog-types.enum';
@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit {
  showLoader = false;
  dataModel: any;
  id: any;

  @Input('dataModel') set setData(dataModel) {
    if (dataModel) {
      this.dataModel = JSON.parse(JSON.stringify(dataModel));
      if (dataModel.breakdown &&  dataModel.notificationStatus === 'COMPLETED' && dataModel.malfunctionEnd && dataModel.malfunctionStart) {
        const {hours, mins, secs} = this.date_time(dataModel.malfunctionStart, dataModel.malfunctionEnd);
        this.dataModel.breakdownDuration = hours + ':' + mins + ':' + secs;
      }
    }
  }
  @Input('id') set setId(id) {
    if (id) {
      this.id = id;
      this.initializeData(this.id);
    }
  }

  modalType = DialogTypeEnum;

  constructor(private utilities: UtilitiesService,
    private notificationServie: NotificationsService,
    private mStrategyTypeSvc: MaintenanceOrderService,
              private loaderService: LoaderService) {
  }
  ngOnInit() {
    setTimeout(() => {
      if (this.dataModel && this.dataModel.maintenanceOrder) {
        this.mStrategyTypeSvc.getDetail(this.dataModel.maintenanceOrder.maintenanceId).then((res) => this.dataModel.maintenanceOrder = res);
      }
    }, 1000);
  }

  date_time(startDate, endDate) {
    let timeDiff = new Date(endDate).getTime() - new Date(startDate).getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    timeDiff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(timeDiff / (1000 * 60));
    timeDiff -= mins * (1000 * 60);
    const secs = Math.floor(timeDiff / 1000)
    timeDiff -= secs * 1000;
    return {hours, mins, secs};
}

  showCreateOrderModal() {
    this.notificationServie.eventHandler.next('order');
  }

  showDetailModal(id , type) {
    this.loaderService.showDetailDialog(type, id);
  }


  initializeData(id) {
    this.notificationServie.getDetail(id).then(data => {
      this.dataModel = data;
      if (this.dataModel && this.dataModel.maintenanceOrder) {
        this.mStrategyTypeSvc.getDetail(this.dataModel.maintenanceOrder.maintenanceId).then((res) => this.dataModel.maintenanceOrder = res);
      }
    }).catch(err => console.error(err));
  }
}
